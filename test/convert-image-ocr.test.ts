/**
 * Image OCR conversion tests.
 *
 * The production converter can use Anthropic or OpenAI-compatible vision, so
 * these tests mock the shared helpers and verify convert behavior without
 * network calls, credentials, or model nondeterminism.
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import convertCommand from "../src/commands/convert.js";
import type { ConvertSummary } from "../src/convert/types.js";
import { useTempRoot } from "./fixtures/temp-root.js";
import { runAnthropicImagePrompt } from "../src/vision/anthropic-image.js";
import { runOpenAICompatibleImagePrompt } from "../src/vision/openai-image.js";

vi.mock("../src/vision/anthropic-image.js", () => ({
  runAnthropicImagePrompt: vi.fn(),
}));

vi.mock("../src/vision/openai-image.js", () => ({
  runOpenAICompatibleImagePrompt: vi.fn(),
}));

const root = useTempRoot();
const mockedVision = vi.mocked(runAnthropicImagePrompt);
const mockedOpenAIVision = vi.mocked(runOpenAICompatibleImagePrompt);
const originalProvider = process.env.LLMWIKI_PROVIDER;

describe("convert image OCR", () => {
  beforeEach(() => {
    mockedVision.mockReset();
    mockedOpenAIVision.mockReset();
    restoreProvider();
  });

  afterEach(() => {
    restoreProvider();
  });

  it("converts OCR text from supported image files", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockResolvedValue("Receipt Total\n\n$12.00");

    const { summary, body } = await convertSeededImage("ocr-success", "receipt.png");

    expect(summary.written).toBe(1);
    expect(body).toContain("sourceType: image");
    expect(body).toContain("Receipt Total");
  });

  it("uses OpenAI-compatible vision when LLMWIKI_PROVIDER=openai", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    process.env.LLMWIKI_PROVIDER = "openai";
    mockedOpenAIVision.mockResolvedValue("Invoice Total\n\n$34.00");

    const { summary, body } = await convertSeededImage("ocr-openai", "invoice.png");

    expect(summary.written).toBe(1);
    expect(mockedOpenAIVision).toHaveBeenCalledWith(
      expect.stringContaining("invoice.png"),
      expect.any(String),
    );
    expect(mockedVision).not.toHaveBeenCalled();
    expect(body).toContain("Invoice Total");
  });

  it("skips no-text OCR results without failing the whole conversion", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockResolvedValue("NO_TEXT");

    const { summary } = await convertSeededImage("ocr-empty", "blank.webp");

    expectSkippedImage(summary, "Image OCR found no visible text");
  });

  it("skips missing OCR backend or credential failures", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockRejectedValue(new Error("Image OCR convert requires the Anthropic provider"));

    const { summary } = await convertSeededImage("ocr-backend", "scan.jpg");

    expectSkippedImage(summary, "Image OCR convert requires");
  });
});

/** Convert one seeded image and return the summary plus first output body. */
async function convertSeededImage(
  folderName: string,
  fileName: string,
): Promise<{ summary: ConvertSummary; body: string }> {
  const { inputDir, outDir } = await seedImage(folderName, fileName);
  const summary = await convertCommand(inputDir, { out: outDir });
  const body = summary.outputs[0]
    ? await readFile(summary.outputs[0].outputPath, "utf-8")
    : "";
  return { summary, body };
}

/** Assert that image OCR failure was recorded as a skip, not a command failure. */
function expectSkippedImage(summary: ConvertSummary, reason: string): void {
  expect(summary.written).toBe(0);
  expect(summary.failed).toBe(0);
  expect(summary.skipped).toBe(1);
  expect(summary.skippedFiles[0].reason).toContain(reason);
}

/** Restore the provider environment exactly as it was before this test file. */
function restoreProvider(): void {
  if (originalProvider === undefined) {
    delete process.env.LLMWIKI_PROVIDER;
    return;
  }
  process.env.LLMWIKI_PROVIDER = originalProvider;
}

/** Seed a minimal local image file path for scanner/converter routing. */
async function seedImage(
  folderName: string,
  fileName: string,
): Promise<{ inputDir: string; outDir: string }> {
  const inputDir = path.join(root.dir, folderName);
  const outDir = path.join(root.dir, `${folderName}-out`);
  await mkdir(inputDir, { recursive: true });
  await writeFile(path.join(inputDir, fileName), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return { inputDir, outDir };
}
