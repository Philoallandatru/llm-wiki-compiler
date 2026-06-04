/**
 * Integration coverage for compile-time extraction caching.
 *
 * These tests exercise the real compile pipeline with stubbed provider calls.
 * The important recovery story is an interrupted compile: concept extraction
 * succeeds, page generation fails before source state is persisted, and the
 * next compile run should reuse the persisted extraction instead of calling
 * the LLM extraction tool again.
 */

import { describe, it, expect, vi } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { compileAndReport } from "../src/compiler/index.js";
import * as llm from "../src/utils/llm.js";
import { EXTRACTIONS_DIR } from "../src/utils/constants.js";
import { useCompileProject } from "./fixtures/compile-project.js";

/** Tool-use JSON returned by the extraction stub. */
function extractionResponse(): string {
  return JSON.stringify({
    concepts: [
      {
        concept: "Cached Topic",
        summary: "A topic extracted before page generation failed.",
        is_new: true,
      },
    ],
  });
}

/** Minimal page body that passes the compile-path validators. */
const PAGE_BODY = "Cached topic body generated after retry. ^[sample.md]";

/** Spy type for the callClaude helper. */
type CallClaudeSpy = ReturnType<typeof vi.spyOn<typeof llm, "callClaude">>;

/** Count extraction tool calls on the shared callClaude spy. */
function countExtractionCalls(spy: CallClaudeSpy): number {
  return spy.mock.calls.filter(([options]) => options.tools).length;
}

/** Run a compile that fails after extraction and assert the cache is present. */
async function runInterruptedCompile(root: string): Promise<CallClaudeSpy> {
  const callSpy = vi.spyOn(llm, "callClaude").mockImplementation(async ({ tools }) => {
    if (tools && tools.length > 0) return extractionResponse();
    throw new Error("page generation failed");
  });

  await expect(compileAndReport(root)).rejects.toThrow("page generation failed");
  expect(await readdir(path.join(root, EXTRACTIONS_DIR))).toHaveLength(1);
  return callSpy;
}

/** Switch the LLM stub from failing page generation to successful generation. */
function mockSuccessfulPageGeneration(callSpy: CallClaudeSpy): void {
  callSpy.mockImplementation(async ({ tools }) => {
    if (tools && tools.length > 0) return extractionResponse();
    return PAGE_BODY;
  });
}

describe("extraction cache integration", () => {
  const ctx = useCompileProject({ dirSuffix: "extraction-cache" });

  it("reuses cached concepts after page generation fails mid-compile", async () => {
    const callSpy = await runInterruptedCompile(ctx.dir);
    mockSuccessfulPageGeneration(callSpy);
    await compileAndReport(ctx.dir);

    expect(countExtractionCalls(callSpy)).toBe(1);
    const page = await readFile(
      path.join(ctx.dir, "wiki", "concepts", "cached-topic.md"),
      "utf-8",
    );
    expect(page).toContain(PAGE_BODY);
  });

  it("bypasses cached concepts when extraction caching is disabled", async () => {
    const callSpy = await runInterruptedCompile(ctx.dir);
    mockSuccessfulPageGeneration(callSpy);
    await compileAndReport(ctx.dir, { noExtractionCache: true });

    expect(countExtractionCalls(callSpy)).toBe(2);
  });
});
