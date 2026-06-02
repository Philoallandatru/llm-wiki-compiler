/**
 * Tests for OpenAI tool schema translation.
 * Verifies that Anthropic-style tool schemas (input_schema) are correctly
 * converted to OpenAI format (parameters).
 */

import { afterEach, describe, it, expect, vi } from "vitest";
import { OpenAIProvider, translateToolToOpenAI } from "../src/providers/openai.js";
import type { LLMTool } from "../src/utils/provider.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("translateToolToOpenAI", () => {
  it("translates input_schema to parameters", () => {
    const tool: LLMTool = {
      name: "get_weather",
      description: "Get the weather for a city",
      input_schema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
        },
        required: ["city"],
      },
    };

    const result = translateToolToOpenAI(tool);

    expect(result.type).toBe("function");
    expect(result.function.name).toBe("get_weather");
    expect(result.function.description).toBe("Get the weather for a city");
    expect(result.function.parameters).toEqual(tool.input_schema);
  });

  it("preserves required fields through translation", () => {
    const tool: LLMTool = {
      name: "search",
      description: "Search documents",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number" },
        },
        required: ["query"],
      },
    };

    const result = translateToolToOpenAI(tool);
    const params = result.function.parameters as Record<string, unknown>;
    expect(params.required).toEqual(["query"]);
  });

  it("translates multiple tools correctly", () => {
    const tools: LLMTool[] = [
      {
        name: "tool_a",
        description: "First tool",
        input_schema: { type: "object", properties: { x: { type: "string" } } },
      },
      {
        name: "tool_b",
        description: "Second tool",
        input_schema: { type: "object", properties: { y: { type: "number" } } },
      },
    ];

    const results = tools.map(translateToolToOpenAI);

    expect(results).toHaveLength(2);
    expect(results[0].function.name).toBe("tool_a");
    expect(results[1].function.name).toBe("tool_b");
    expect(results[0].function.parameters).toEqual(tools[0].input_schema);
    expect(results[1].function.parameters).toEqual(tools[1].input_schema);
  });

  it("uses MiniMax's embeddings request and response shape", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({
        vectors: [[0.1, 0.2, 0.3]],
        base_resp: { status_code: 0, status_msg: "success" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const provider = new OpenAIProvider("MiniMax-M2.7", {
      apiKey: "test-key",
      baseURL: "https://api.minimax.chat/v1",
    });

    await expect(provider.embed("hello")).resolves.toEqual([0.1, 0.2, 0.3]);
    const request = fetchMock.mock.calls[0];
    const body = JSON.parse(request[1].body as string) as Record<string, unknown>;

    expect(request[0]).toBe("https://api.minimax.chat/v1/embeddings");
    expect(body).toEqual({
      model: "embo-01",
      texts: ["hello"],
      type: "db",
    });
  });
});
