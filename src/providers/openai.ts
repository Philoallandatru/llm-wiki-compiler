/**
 * OpenAI LLM provider implementation.
 *
 * Wraps the openai npm package to implement the LLMProvider interface.
 * Translates Anthropic-style tool schemas (input_schema) to OpenAI format (parameters).
 */

import OpenAI from "openai";
import type { LLMProvider, LLMMessage, LLMTool } from "../utils/provider.js";
import {
  EMBEDDING_MODELS,
  DEFAULT_EMBEDDINGS_TIMEOUT_MS,
  EMBEDDINGS_TIMEOUT_ENV_VAR,
  MINIMAX_EMBEDDING_MODEL,
  OPENAI_DEFAULT_TIMEOUT_MS,
} from "../utils/constants.js";

/** Construction options for an OpenAI-compatible provider. */
interface OpenAIProviderOptions {
  baseURL?: string;
  apiKey?: string;
  embeddingsBaseURL?: string;
  embeddingModel?: string;
  /**
   * Per-request timeout in milliseconds. Defaults to 10 minutes for cloud
   * OpenAI (matches the SDK default). Long compile-time completions on
   * slower local models can exceed this — see {@link OllamaProvider} which
   * raises the default and reads LLMWIKI_REQUEST_TIMEOUT_MS / OLLAMA_TIMEOUT_MS.
   */
  timeoutMs?: number;
  /** Timeout in milliseconds for embedding requests only. */
  embeddingTimeoutMs?: number;
}

/** Shape returned by MiniMax's embeddings endpoint. */
interface MiniMaxEmbeddingResponse {
  vectors?: number[][];
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

/**
 * Read an integer-millisecond timeout from an env var. Returns undefined when
 * the env var is unset, empty, non-numeric, zero, or negative — so the caller
 * silently falls back to the next source in its resolution chain (env-var
 * typos like `OLLAMA_TIMEOUT_MS=30m` are not surfaced to the user).
 */
export function readTimeoutEnv(name: string): number | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** Resolve the OpenAI client timeout from LLMWIKI_REQUEST_TIMEOUT_MS, if set. */
function resolveOpenAITimeoutMs(): number | undefined {
  return readTimeoutEnv("LLMWIKI_REQUEST_TIMEOUT_MS");
}

/** Translate an Anthropic-style LLMTool to an OpenAI ChatCompletionTool. */
export function translateToolToOpenAI(
  tool: LLMTool,
): OpenAI.ChatCompletionTool {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema,
    },
  };
}

/** OpenAI-backed LLM provider. */
export class OpenAIProvider implements LLMProvider {
  protected readonly client: OpenAI;
  protected readonly embeddingsClient: OpenAI;
  protected readonly model: string;
  protected readonly configuredEmbeddingModel?: string;
  protected readonly embeddingsBaseURL?: string;
  protected readonly usesMiniMaxEmbeddings: boolean;
  private readonly apiKey: string;
  private readonly embeddingTimeoutMs: number;

  constructor(model: string, options: OpenAIProviderOptions = {}) {
    this.model = model;
    this.configuredEmbeddingModel = options.embeddingModel;
    // The OpenAI SDK validates OPENAI_API_KEY at construction time.
    // Pass the key explicitly so the provider controls when validation happens.
    const resolvedKey = options.apiKey ?? process.env.OPENAI_API_KEY ?? "";
    this.apiKey = resolvedKey;
    const timeout = options.timeoutMs ?? resolveOpenAITimeoutMs() ?? OPENAI_DEFAULT_TIMEOUT_MS;
    this.embeddingTimeoutMs = resolveEmbeddingTimeoutMs(options.embeddingTimeoutMs);
    const baseURL = options.baseURL ?? null;
    this.embeddingsBaseURL = options.embeddingsBaseURL ?? options.baseURL;
    this.usesMiniMaxEmbeddings = isMiniMaxBaseURL(this.embeddingsBaseURL);
    this.client = new OpenAI({
      apiKey: resolvedKey,
      baseURL,
      timeout,
    });
    this.embeddingsClient = options.embeddingsBaseURL
      ? new OpenAI({
        apiKey: resolvedKey,
        baseURL: options.embeddingsBaseURL,
        timeout: this.embeddingTimeoutMs,
      })
      : new OpenAI({ apiKey: resolvedKey, baseURL, timeout: this.embeddingTimeoutMs });
  }

  /** Send a single non-streaming completion request. */
  async complete(system: string, messages: LLMMessage[], maxTokens: number): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
    });

    return response.choices[0]?.message?.content ?? "";
  }

  /** Stream a completion, invoking onToken for each text chunk. */
  async stream(
    system: string,
    messages: LLMMessage[],
    maxTokens: number,
    onToken?: (text: string) => void,
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
      stream: true,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        onToken?.(delta);
      }
    }

    return fullText;
  }

  /** Call the model with tool definitions and return the parsed tool input as JSON. */
  async toolCall(
    system: string,
    messages: LLMMessage[],
    tools: LLMTool[],
    maxTokens: number,
  ): Promise<string> {
    const openaiTools = tools.map(translateToolToOpenAI);

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
      tools: openaiTools,
      tool_choice: "required",
    });

    const toolCalls = response.choices[0]?.message?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      return toolCalls[0].function.arguments;
    }

    return response.choices[0]?.message?.content ?? "";
  }

  /**
   * Produce a single embedding vector via the OpenAI embeddings API.
   * Subclasses (e.g. Ollama) override embeddingModel() to pick a different model.
   */
  async embed(text: string): Promise<number[]> {
    if (this.usesMiniMaxEmbeddings) {
      return this.embedWithMiniMax(text);
    }

    const response = await this.embeddingsClient.embeddings.create({
      model: this.embeddingModel(),
      input: text,
    });

    const vector = response.data[0]?.embedding;
    if (!Array.isArray(vector)) {
      throw new Error("OpenAI embeddings response did not include a vector.");
    }
    return vector;
  }

  /** Default embedding model for this provider. Subclasses may override. */
  protected embeddingModel(): string {
    if (this.usesMiniMaxEmbeddings && !this.configuredEmbeddingModel) {
      return MINIMAX_EMBEDDING_MODEL;
    }
    return this.configuredEmbeddingModel ?? EMBEDDING_MODELS.openai;
  }

  /** Produce one vector through MiniMax's `texts`/`vectors` embeddings API. */
  protected async embedWithMiniMax(text: string): Promise<number[]> {
    const url = `${this.embeddingsBaseURL?.replace(/\/$/, "")}/embeddings`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.embeddingHeaders(),
      signal: AbortSignal.timeout(this.embeddingTimeoutMs),
      body: JSON.stringify({
        model: this.embeddingModel(),
        texts: [text],
        type: "db",
      }),
    });
    const body = (await response.json()) as MiniMaxEmbeddingResponse;
    return parseMiniMaxVector(response.status, body);
  }

  /** Headers for raw embedding fetch calls. */
  private embeddingHeaders(): Record<string, string> {
    return {
      "content-type": "application/json",
      authorization: `Bearer ${this.apiKey}`,
    };
  }
}

/** Return true when an OpenAI-compatible chat URL points at MiniMax. */
function isMiniMaxBaseURL(baseURL?: string): boolean {
  return Boolean(baseURL && /minimax/i.test(baseURL));
}

/** Extract the first vector from MiniMax's response or throw a clear error. */
function parseMiniMaxVector(status: number, body: MiniMaxEmbeddingResponse): number[] {
  const vector = body.vectors?.[0];
  if (Array.isArray(vector)) return vector;

  const statusCode = body.base_resp?.status_code;
  const statusMsg = body.base_resp?.status_msg;
  throw new Error(
    `MiniMax embeddings response did not include a vector ` +
      `(HTTP ${status}, code ${statusCode ?? "unknown"}: ${statusMsg ?? "unknown error"}).`,
  );
}

/** Resolve embedding timeout separately from long-running generation calls. */
function resolveEmbeddingTimeoutMs(explicit?: number): number {
  return (
    explicit ??
    readTimeoutEnv(EMBEDDINGS_TIMEOUT_ENV_VAR) ??
    DEFAULT_EMBEDDINGS_TIMEOUT_MS
  );
}
