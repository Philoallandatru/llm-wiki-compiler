/**
 * Failure-path coverage for batch compilation.
 *
 * A compile error after a batch ingest must fail the command immediately.
 * Otherwise later batches keep ingesting files while no wiki pages are
 * produced, leaving users with many imported sources and no compiled output.
 */

import { beforeEach, describe, it, expect, vi } from "vitest";
import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { useTempRoot } from "./fixtures/temp-root.js";

const compileMock = vi.fn();

vi.mock("../src/commands/compile.js", () => ({
  default: compileMock,
}));

const root = useTempRoot(["sources"]);

beforeEach(() => {
  compileMock.mockReset();
});

/** Seed an input directory with source files that can become separate batches. */
async function seedBatchInput(fileCount = 2): Promise<string> {
  const inputDir = path.join(root.dir, "input");
  await mkdir(inputDir, { recursive: true });

  for (let index = 0; index < fileCount; index++) {
    await writeFile(
      path.join(inputDir, `${String.fromCharCode(97 + index)}.md`),
      `# File ${index + 1}\n\nA long enough source body for batch ingest tests.`,
      "utf-8",
    );
  }

  return inputDir;
}

/** Run one single-file batch and assert the compile phase fails as expected. */
async function expectBatchCompileFailure(pattern: RegExp): Promise<void> {
  const { default: batchCompileCommand } = await import(
    "../src/commands/batch-compile.js"
  );
  const inputDir = await seedBatchInput();

  await expect(batchCompileCommand(inputDir, { batch: 1 })).rejects.toThrow(pattern);
  expect(compileMock).toHaveBeenCalledTimes(1);
}

describe("batch-compile failure handling", () => {
  it("rejects non-positive batch sizes before chunking", async () => {
    const { default: batchCompileCommand } = await import(
      "../src/commands/batch-compile.js"
    );
    const inputDir = await seedBatchInput(1);

    await expect(batchCompileCommand(inputDir, { batch: 0 })).rejects.toThrow(
      /Invalid batch size: 0/,
    );
    expect(compileMock).not.toHaveBeenCalled();
  });

  it("rejects invalid batch sizes before chunking", async () => {
    const { default: batchCompileCommand } = await import(
      "../src/commands/batch-compile.js"
    );
    const inputDir = await seedBatchInput(1);

    await expect(batchCompileCommand(inputDir, { batch: NaN })).rejects.toThrow(
      /Invalid batch size: NaN/,
    );
    expect(compileMock).not.toHaveBeenCalled();
  });

  it("uses two files as the default batch size", async () => {
    compileMock.mockRejectedValueOnce(new Error("provider timeout"));

    const { default: batchCompileCommand } = await import(
      "../src/commands/batch-compile.js"
    );
    const inputDir = await seedBatchInput(3);

    await expect(batchCompileCommand(inputDir, {})).rejects.toThrow(
      /Batch 1 failed after ingest/,
    );

    const sources = await readdir(path.join(root.dir, "sources"));
    expect(sources).toHaveLength(2);
  });

  it("continues after page validation errors from a compiled batch", async () => {
    compileMock
      .mockResolvedValueOnce({
        compiled: 1,
        skipped: 0,
        deleted: 0,
        concepts: ["Bad Page"],
        pages: ["bad-page"],
        errors: ['Invalid page for "Bad Page" — failed validation'],
      })
      .mockResolvedValueOnce({
        compiled: 1,
        skipped: 1,
        deleted: 0,
        concepts: ["Good Page"],
        pages: ["good-page"],
        errors: [],
      });

    const { default: batchCompileCommand } = await import(
      "../src/commands/batch-compile.js"
    );
    const inputDir = await seedBatchInput(2);

    await batchCompileCommand(inputDir, { batch: 1 });

    const sources = await readdir(path.join(root.dir, "sources"));
    expect(sources).toHaveLength(2);
    expect(compileMock).toHaveBeenCalledTimes(2);
  });

  it("fails fast when compile fails after ingesting a batch", async () => {
    compileMock.mockRejectedValueOnce(new Error("provider timeout"));

    await expectBatchCompileFailure(/Batch 1 failed after ingest/);

    const sources = await readdir(path.join(root.dir, "sources"));
    expect(sources).toHaveLength(1);
  });

  it("fails fast when compile returns no generated pages for an ingested batch", async () => {
    compileMock.mockResolvedValueOnce({
      compiled: 1,
      skipped: 0,
      deleted: 0,
      concepts: [],
      pages: [],
      errors: ["No concepts extracted from a.md"],
    });

    await expectBatchCompileFailure(/No concepts extracted from a\.md/);
  });
});
