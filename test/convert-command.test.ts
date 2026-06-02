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

  it("reports empty supported files as failed conversions", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "empty-input");
    const outDir = path.join(root.dir, "empty-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "empty.txt"), "", "utf-8");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /One or more files failed/,
    );
  });

  it("exits non-zero after partial failures while preserving successful outputs", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "partial-failure-input");
    const outDir = path.join(root.dir, "partial-failure-output");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep me", "utf-8");
    await writeFile(path.join(inputDir, "empty.txt"), "", "utf-8");

    await expect(convertCommand(inputDir, { out: outDir })).rejects.toThrow(
      /One or more files failed/,
    );

    const bodies = await readOutputBodies(outDir);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toContain("Keep me");
  });

  it("rejects output folders that are the input folder or its parent", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const inputDir = path.join(root.dir, "bad-out-input");
    await mkdir(inputDir, { recursive: true });
    await writeFile(path.join(inputDir, "keep.txt"), "Keep me", "utf-8");

    await expect(convertCommand(inputDir, { out: inputDir })).rejects.toThrow(
      /separate folder/,
    );
    await expect(convertCommand(inputDir, { out: root.dir })).rejects.toThrow(/separate folder/);
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
});
