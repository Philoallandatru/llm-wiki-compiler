/**
 * Compile-time coverage for optional embedding refresh controls.
 *
 * The LLM generation calls are stubbed while the compile pipeline, page write,
 * index generation, and embedding refresh decision all run for real.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "fs";
import path from "path";
import { compileAndReport } from "../src/compiler/index.js";
import { OpenAIProvider } from "../src/providers/openai.js";
import * as llm from "../src/utils/llm.js";
import { useCompileProject } from "./fixtures/compile-project.js";

const ctx = useCompileProject({ dirSuffix: "embeddings-options" });

/** Tool-use JSON returned by the extraction stub. */
function extractionResponse(): string {
  return JSON.stringify({
    concepts: [
      {
        concept: "Embedding Option Topic",
        summary: "A topic used to test embedding options.",
        is_new: true,
      },
    ],
  });
}

/** Stub extraction and page-generation calls for a successful compile. */
function mockSuccessfulCompile(): void {
  vi.spyOn(llm, "callClaude").mockImplementation(async ({ tools }) => {
    if (tools && tools.length > 0) return extractionResponse();
    return "Embedding option body. ^[sample.md]";
  });
}

/** Make provider selection use OpenAI so embed() can be spied safely. */
function useStubbedOpenAIEmbeddings(): ReturnType<typeof vi.fn> {
  process.env.LLMWIKI_PROVIDER = "openai";
  process.env.OPENAI_API_KEY = "test-key";
  process.env.LLMWIKI_EMBEDDING_MODEL = "test-embed";
  const embed = vi.fn().mockResolvedValue([0.1, 0.2]);
  vi.spyOn(OpenAIProvider.prototype, "embed").mockImplementation(embed);
  return embed;
}

afterEach(() => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.LLMWIKI_EMBEDDING_MODEL;
  delete process.env.LLMWIKI_NO_EMBEDDINGS;
});

describe("compile embedding refresh controls", () => {
  it("refreshes embeddings after a normal successful compile", async () => {
    mockSuccessfulCompile();
    const embed = useStubbedOpenAIEmbeddings();

    const result = await compileAndReport(ctx.dir);

    expect(result.compiled).toBe(1);
    expect(embed).toHaveBeenCalled();
    expect(existsSync(path.join(ctx.dir, ".llmwiki", "embeddings.json"))).toBe(true);
  });

  it("skips embeddings when noEmbeddings is set", async () => {
    mockSuccessfulCompile();
    const embed = useStubbedOpenAIEmbeddings();

    const result = await compileAndReport(ctx.dir, { noEmbeddings: true });

    expect(result.compiled).toBe(1);
    expect(embed).not.toHaveBeenCalled();
    expect(existsSync(path.join(ctx.dir, ".llmwiki", "embeddings.json"))).toBe(false);
  });

  it("skips embeddings through LLMWIKI_NO_EMBEDDINGS", async () => {
    mockSuccessfulCompile();
    const embed = useStubbedOpenAIEmbeddings();
    process.env.LLMWIKI_NO_EMBEDDINGS = "1";

    const result = await compileAndReport(ctx.dir);

    expect(result.compiled).toBe(1);
    expect(embed).not.toHaveBeenCalled();
  });

  it("keeps compile successful when embeddings fail", async () => {
    mockSuccessfulCompile();
    process.env.LLMWIKI_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "test-key";
    vi.spyOn(OpenAIProvider.prototype, "embed").mockRejectedValue(
      new Error("embedding timeout"),
    );

    const result = await compileAndReport(ctx.dir);

    expect(result.compiled).toBe(1);
    expect(result.errors).toEqual([]);
    expect(existsSync(path.join(ctx.dir, "wiki", "concepts", "embedding-option-topic.md")))
      .toBe(true);
  });
});
