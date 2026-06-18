/**
 * Conversion command coverage for recursive folder-to-Markdown preparation.
 *
 * These tests avoid LLM calls and PDF runtime dependencies while exercising
 * the core user-facing behavior: flattened output, Markdown pass-through,
 * HTML/text conversion, chunking, and file filtering.
 */

import { describe, expect, it, vi } from "vitest";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import convertCommand from "../src/commands/convert.js";
import { expectPublishedSingleSkip } from "./fixtures/convert-assertions.js";
import { useTempRoot } from "./fixtures/temp-root.js";

const root = useTempRoot();

/** Create a nested conversion input folder. */
async function seedMixedInput(): Promise<string> {
  const inputDir = path.join(root.dir, "input");
  await mkdir(path.join(inputDir, "nested"), { recursive: true });
  await writeFile(path.join(inputDir, "nested", "notes.md"), "# Notes\n\nAlready markdown.", "utf-8");
  await writeFile(path.join(inputDir, "plain.txt"), "Alpha paragraph\n\nBeta paragraph", "utf-8");
  await writeFile(path.join(inputDir, "page.html"), htmlFixture(), "utf-8");
  await writeFile(path.join(inputDir, "ignored.bin"), "binary-ish", "utf-8");
  return inputDir;
}

/** Create a single-file conversion input folder. */
async function seedSingleFileInput(folderName: string, fileName: string, content: string): Promise<string> {
  const inputDir = path.join(root.dir, folderName);
  await mkdir(inputDir, { recursive: true });
  await writeFile(path.join(inputDir, fileName), content, "utf-8");
  return inputDir;
}

/** HTML fixture with readable article content. */
function htmlFixture(): string {
  return [
    "<html><head><title>Demo HTML</title></head><body>",
    "<article><h1>Demo</h1><p>Hello <strong>world</strong>.</p></article>",
    "</body></html>",
  ].join("");
}

/** Read all Markdown output file bodies from a folder. */
async function readOutputBodies(outDir: string): Promise<string[]> {
  const files = await readdir(outDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();
  return Promise.all(markdownFiles.map((file) => readFile(path.join(outDir, file), "utf-8")));
}

describe("convert command", () => {
  it("converts supported files into a flattened Markdown output folder", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedMixedInput();
    const outDir = path.join(root.dir, "converted");

    const summary = await convertCommand(inputDir, { out: outDir, chunkSize: 1_000 });
    const files = await readdir(outDir);
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(3);
    expect(summary.skipped).toBe(1);
    expect(files.every((file) => file.endsWith(".md"))).toBe(true);
    expect(bodies).toContain("# Notes\n\nAlready markdown.\n");
    expect(bodies.some((body) => body.includes("sourceType: text"))).toBe(true);
    expect(bodies.some((body) => body.includes("sourceType: html") && body.includes("Hello"))).toBe(
      true,
    );
  });

  it("chunks long converted text into numbered top-level Markdown files", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "long-input");
    const outDir = path.join(root.dir, "long-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "long.txt"), `${"a".repeat(30)}\n\n${"b".repeat(30)}`);

    const summary = await convertCommand(inputDir, { out: outDir, chunkSize: 35 });
    const files = await readdir(outDir);
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(2);
    expect(files).toEqual(expect.arrayContaining([expect.stringContaining(".part-001.md")]));
    expect(bodies[0]).toContain("totalParts: 2");
    expect(bodies[1]).toContain("part: 2");
  });

  it("honors include and exclude filters", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "filtered-input");
    const outDir = path.join(root.dir, "filtered-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep me", "utf-8");
    await writeFile(path.join(inputDir, "skip-this.txt"), "Skip me", "utf-8");
    await writeFile(path.join(inputDir, "notes.md"), "# Skip by include", "utf-8");

    const summary = await convertCommand(inputDir, {
      out: outDir,
      include: ".txt",
      exclude: "skip-this",
    });
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(1);
    expect(summary.skipped).toBe(2);
    expect(bodies[0]).toContain("Keep me");
  });

  it("uses deterministic flattened names without overwriting same-name files", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "collision-input");
    const outDir = path.join(root.dir, "collision-output");
    await mkdir(path.join(inputDir, "a"), { recursive: true });
    await mkdir(path.join(inputDir, "b"), { recursive: true });
    await writeFile(path.join(inputDir, "a", "same.md"), "# First", "utf-8");
    await writeFile(path.join(inputDir, "b", "same.md"), "# Second", "utf-8");

    const summary = await convertCommand(inputDir, { out: outDir });
    const files = await readdir(outDir);
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(2);
    expect(files).toHaveLength(2);
    expect(bodies).toEqual(expect.arrayContaining(["# First\n", "# Second\n"]));
  });

  it("skips empty supported files without failing the whole conversion", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedSingleFileInput("empty-input", "empty.txt", "");
    const outDir = path.join(root.dir, "empty-output");

    const summary = await convertCommand(inputDir, { out: outDir });

    expectPublishedSingleSkip(summary, outDir, {
      reasonIncludes: "No extractable content found",
    });
  });

  it("publishes successful outputs when another file cannot be converted", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "partial-failure-input");
    const outDir = path.join(root.dir, "partial-failure-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep me", "utf-8");
    await writeFile(path.join(inputDir, "empty.txt"), "", "utf-8");

    const summary = await convertCommand(inputDir, { out: outDir });
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(1);
    expect(summary.failed).toBe(0);
    expect(summary.skipped).toBe(1);
    expect(bodies[0]).toContain("Keep me");
  });

  it("rejects output folders that are the input folder or its parent", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedSingleFileInput("bad-out-input", "keep.txt", "Keep me");

    await expect(convertCommand(inputDir, { out: inputDir })).rejects.toThrow(
      /separate folder/,
    );
    await expect(convertCommand(inputDir, { out: root.dir })).rejects.toThrow(/separate folder/);
  });

  it("rejects an existing output folder before conversion starts", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "existing-out-input");
    const outDir = path.join(root.dir, "existing-out");
    await mkdir(inputDir, { recursive: true });
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep me", "utf-8");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /Output folder already exists/,
    );
  });

  it("skips empty or no-readable-content HTML without failing the whole conversion", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedSingleFileInput(
      "empty-html-input",
      "empty.html",
      "<html><body></body></html>",
    );
    const outDir = path.join(root.dir, "empty-html-output");

    const summary = await convertCommand(inputDir, { out: outDir });

    expectPublishedSingleSkip(summary, outDir, {
      reasonIncludes: "No readable HTML content found",
    });
  });

  it("accepts malformed-but-readable HTML", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = await seedSingleFileInput(
      "malformed-html-input",
      "readable.html",
      "<html><body><article><h1>Readable<p>Still useful",
    );
    const outDir = path.join(root.dir, "malformed-html-output");

    const summary = await convertCommand(inputDir, { out: outDir });
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(1);
    expect(bodies[0]).toContain("Readable");
    expect(bodies[0]).toContain("Still useful");
  });

  it("does not duplicate existing Markdown frontmatter when chunking", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "frontmatter-input");
    const outDir = path.join(root.dir, "frontmatter-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(
      path.join(inputDir, "frontmatter.md"),
      "---\ntitle: Original\nlegacy: true\n---\n\nAlpha paragraph.\n\nBeta paragraph.",
      "utf-8",
    );

    const summary = await convertCommand(inputDir, { out: outDir, chunkSize: 20 });
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(2);
    expect(bodies.join("\n")).not.toContain("legacy: true");
    expect(bodies[0]).toContain("sourceType: markdown");
  });

  it("skips common generated directories by default", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "skip-default-input");
    const outDir = path.join(root.dir, "skip-default-output");
    await mkdir(path.join(inputDir, "node_modules"), { recursive: true });
    await mkdir(path.join(inputDir, "dist"), { recursive: true });
    await mkdir(path.join(inputDir, ".git"), { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep", "utf-8");
    await writeFile(path.join(inputDir, "node_modules", "skip.txt"), "Skip", "utf-8");
    await writeFile(path.join(inputDir, "dist", "skip.txt"), "Skip", "utf-8");
    await writeFile(path.join(inputDir, ".git", "skip.txt"), "Skip", "utf-8");

    const summary = await convertCommand(inputDir, { out: outDir });

    expect(summary.scanned).toBe(1);
    expect(summary.written).toBe(1);
  });

  it("converts source code and config files as fenced Markdown", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "text-like-input");
    const outDir = path.join(root.dir, "text-like-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "app.ts"), "\uFEFFexport const value = 1;\n", "utf-8");
    await writeFile(path.join(inputDir, "package.json"), '\uFEFF{ "name": "demo" }\n', "utf-8");
    await writeFile(path.join(inputDir, "settings.yaml"), "enabled: true\n", "utf-8");

    const summary = await convertCommand(inputDir, { out: outDir });
    const bodies = await readOutputBodies(outDir);

    expect(summary.written).toBe(3);
    expect(bodies.some((body) => body.includes("sourceType: code"))).toBe(true);
    expect(bodies.some((body) => body.includes("```typescript\nexport const value"))).toBe(true);
    expect(bodies.some((body) => body.includes("sourceType: config"))).toBe(true);
    expect(bodies.some((body) => body.includes('```json\n{ "name": "demo" }'))).toBe(true);
    expect(bodies.some((body) => body.includes("```yaml\nenabled: true"))).toBe(true);
  });

  it("converts extensionless text-like files and skips binary-looking ones", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "extensionless-input");
    const outDir = path.join(root.dir, "extensionless-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "LICENSE"), "Permission is granted.\n", "utf-8");
    await writeFile(path.join(inputDir, "blob"), Buffer.from([0, 1, 2, 3, 0, 255]));

    const summary = await convertCommand(inputDir, { out: outDir });
    const bodies = await readOutputBodies(outDir);

    expect(summary.scanned).toBe(1);
    expect(summary.written).toBe(1);
    expect(summary.skippedFiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: "binary-looking extensionless file" }),
      ]),
    );
    expect(bodies[0]).toContain("sourceType: text");
    expect(bodies[0]).toContain("Permission is granted.");
  });
});
