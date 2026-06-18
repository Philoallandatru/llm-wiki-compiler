/**
 * Shared assertions for conversion command behavior.
 *
 * These helpers keep tests focused on scenario setup while enforcing the
 * user-facing contract that per-file conversion problems are skipped and do
 * not prevent successful outputs from being published.
 */

import { existsSync } from "fs";
import { expect } from "vitest";
import type { ConvertSummary } from "../../src/convert/types.js";

interface SingleSkipExpectation {
  fileIncludes?: string;
  reasonIncludes: string;
}

/** Assert that conversion published its output folder with one skipped file. */
export function expectPublishedSingleSkip(
  summary: ConvertSummary,
  outDir: string,
  expectation: SingleSkipExpectation,
): void {
  expect(summary.written).toBe(0);
  expect(summary.failed).toBe(0);
  expect(summary.skipped).toBe(1);
  if (expectation.fileIncludes) {
    expect(summary.skippedFiles[0].filePath).toContain(expectation.fileIncludes);
  }
  expect(summary.skippedFiles[0].reason).toContain(expectation.reasonIncludes);
  expect(existsSync(outDir)).toBe(true);
}
