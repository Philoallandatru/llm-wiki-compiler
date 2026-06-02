/**
 * Failure-path coverage for batch compilation.
 *
 * A compile error after a batch ingest must fail the command immediately.
 * Otherwise later batches keep ingesting files while no wiki pages are
 * produced, leaving users with many imported sources and no compiled output.
 */

import { describe, it, expect, vi } from "vitest";
import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { useTempRoot } from "./fixtures/temp-root.js";

const compileMock = vi.fn();

vi.mock("../src/commands/compile.js", () => ({
  default: compileMock,
}));

const root = useTempRoot(["sources"]);

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

describe("batch-compile failure handling", () => {
  it("fails fast when compile fails after ingesting a batch", async () => {
    compileMock.mockRejectedValueOnce(new Error("provider timeout"));
    const { default: batchCompileCommand } = await import("../src/commands/batch-compile.js");
    const inputDir = await seedBatchInput();

    await expect(batchCompileCommand(inputDir, { batch: 1 })).rejects.toThrow(
      /Batch 1 failed after ingest/,
    );

    expect(compileMock).toHaveBeenCalledTimes(1);
    const sources = await readdir(path.join(root.dir, "sources"));
    expect(sources).toHaveLength(1);
  });
});
