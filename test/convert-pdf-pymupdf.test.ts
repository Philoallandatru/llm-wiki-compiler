/**
 * PyMuPDF regression coverage for `llmwiki convert`.
 *
 * PyMuPDF is an optional runtime dependency outside npm's control. This test
 * exercises the real PDF conversion path when Python can import `fitz`, and
 * otherwise verifies that users get a clear conversion failure without a
 * published output folder.
 */

import { describe, expect, it, vi } from "vitest";
import { existsSync } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import convertCommand from "../src/commands/convert.js";
import { useTempRoot } from "./fixtures/temp-root.js";

const execFileAsync = promisify(execFile);
const fixturePdf = path.resolve("test/fixtures/multimodal/sample.pdf");
const root = useTempRoot();

/** Copy the shared sample PDF into an isolated input folder. */
async function seedPdfInput(): Promise<string> {
  const inputDir = path.join(root.dir, "pdf-input");
  await mkdir(inputDir, { recursive: true });
  const content = await readFile(fixturePdf);
  await writeFile(path.join(inputDir, "sample.pdf"), content);
  return inputDir;
}

/** Return true when one of the supported Python commands can import PyMuPDF. */
async function hasPyMuPDF(): Promise<boolean> {
  for (const [command, ...prefix] of pythonCandidates()) {
    try {
      await execFileAsync(command, [...prefix, "-c", "import fitz"]);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/** Mirror the production Python command search order. */
function pythonCandidates(): string[][] {
  if (process.env.PYMUPDF_PYTHON) return [[process.env.PYMUPDF_PYTHON]];
  if (process.platform === "win32") return [["python"], ["py", "-3"]];
  return [["python3"], ["python"]];
}

/** Read the only Markdown output body from a conversion folder. */
async function readSingleOutput(outDir: string): Promise<string> {
  const files = (await readdir(outDir)).filter((file) => file.endsWith(".md"));
  expect(files).toHaveLength(1);
  return readFile(path.join(outDir, files[0]), "utf-8");
}

describe("convert PDF with PyMuPDF", () => {
  it("converts a sample PDF or fails clearly when PyMuPDF is unavailable", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedPdfInput();
    const outDir = path.join(root.dir, "pdf-output");

    if (!(await hasPyMuPDF())) {
      await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
        /One or more files failed/,
      );
      expect(existsSync(outDir)).toBe(false);
      return;
    }

    const summary = await convertCommand(inputDir, { out: outDir });
    const body = await readSingleOutput(outDir);

    expect(summary.written).toBe(1);
    expect(body).toContain("sourceType: pdf");
    expect(body).toContain("pdfEngine: pymupdf");
    expect(body).toContain("Hello PDF World");
  });
});
