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

/** Seed an input directory with two source files that become separate batches. */
async function seedBatchInput(): Promise<string> {
  const inputDir = path.join(root.dir, "input");
  await mkdir(inputDir, { recursive: true });
  await writeFile(
    path.join(inputDir, "a.md"),
    "# A\n\nA long enough source body to be accepted by ingest during batch tests.",
    "utf-8",
  );
  await writeFile(
    path.join(inputDir, "b.md"),
    "# B\n\nAnother long enough source body that should not be ingested after failure.",
    "utf-8",
  );
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
