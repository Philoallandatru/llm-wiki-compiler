/**
 * Image OCR conversion tests.
 *
 * The production converter uses Anthropic vision, so these tests mock the
 * shared vision helper and verify convert behavior without network calls,
 * credentials, or model nondeterminism.
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import convertCommand from "../src/commands/convert.js";
import { useTempRoot } from "./fixtures/temp-root.js";
import { runAnthropicImagePrompt } from "../src/vision/anthropic-image.js";

vi.mock("../src/vision/anthropic-image.js", () => ({
  runAnthropicImagePrompt: vi.fn(),
}));

const root = useTempRoot();
const mockedVision = vi.mocked(runAnthropicImagePrompt);

describe("convert image OCR", () => {
  beforeEach(() => {
    mockedVision.mockReset();
  });

  it("converts OCR text from supported image files", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockResolvedValue("Receipt Total\n\n$12.00");
    const { inputDir, outDir } = await seedImage("ocr-success", "receipt.png");

    const summary = await convertCommand(inputDir, { out: outDir });
    const body = await readFile(summary.outputs[0].outputPath, "utf-8");

    expect(summary.written).toBe(1);
    expect(body).toContain("sourceType: image");
    expect(body).toContain("Receipt Total");
  });

  it("reports no-text OCR results as conversion failures", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockResolvedValue("NO_TEXT");
    const { inputDir, outDir } = await seedImage("ocr-empty", "blank.webp");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /One or more files failed/,
    );
  });

  it("reports missing OCR backend or credential failures clearly", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mockedVision.mockRejectedValue(new Error("Image OCR convert requires the Anthropic provider"));
    const { inputDir, outDir } = await seedImage("ocr-backend", "scan.jpg");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /One or more files failed/,
    );
  });
});

/** Seed a minimal local image file path for scanner/converter routing. */
async function seedImage(folderName: string, fileName: string): Promise<{ inputDir: string; outDir: string }> {
  const inputDir = path.join(root.dir, folderName);
  const outDir = path.join(root.dir, `${folderName}-out`);
  await mkdir(inputDir, { recursive: true });
  await writeFile(path.join(inputDir, fileName), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return { inputDir, outDir };
}
