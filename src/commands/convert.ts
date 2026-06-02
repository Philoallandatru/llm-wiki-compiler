/**
 * CLI command implementation for converting a folder into Markdown files.
 *
 * The command recursively reads supported source files, writes all generated
 * Markdown files into one new top-level output directory, and chunks long
 * converted documents so later ingest/compile runs stay manageable.
 */

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { buildFrontmatter } from "../utils/markdown.js";
import { chunkMarkdown } from "../convert/chunker.js";
import { convertFileToMarkdown } from "../convert/converters.js";
import { normalizeConvertOptions } from "../convert/options.js";
import { buildOutputFilename, buildOutputStem } from "../convert/path-utils.js";
import { scanConvertInput } from "../convert/scanner.js";
import type {
  ConvertedFile,
  ConvertFailure,
  ConvertOptions,
  ConvertOutput,
  ConvertSummary,
  NormalizedConvertOptions,
} from "../convert/types.js";

/** Convert a directory tree into flattened Markdown files under --out. */
export default async function convertCommand(
  folder: string,
  options: ConvertOptions,
): Promise<ConvertSummary> {
  const inputRoot = path.resolve(folder);
  const normalized = normalizeConvertOptions(options);
  const scan = await scanConvertInput(inputRoot, normalized);
  const summary = emptySummary(scan.candidates.length, scan.skipped);

  printPlan(scan.candidates, scan.skipped.length);
  await mkdir(normalized.outDir, { recursive: true });
  for (const sourcePath of scan.candidates) {
    await convertOneFile(inputRoot, sourcePath, normalized, summary);
  }

  printSummary(summary, normalized.outDir);
  if (summary.written === 0 && summary.failed > 0) {
    throw new Error("No Markdown files were written because all conversions failed.");
  }
  return summary;
}

/** Print a short preflight summary before conversion starts. */
function printPlan(candidates: string[], skippedCount: number): void {
  const byExtension = countByExtension(candidates);
  console.log("Conversion plan:");
  for (const [extension, count] of byExtension) {
    console.log(`- ${extension}: ${count}`);
  }
  console.log(`- skipped before conversion: ${skippedCount}`);
}

/** Count candidate files by extension for a readable plan summary. */
function countByExtension(candidates: string[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const candidate of candidates) {
    const extension = path.extname(candidate).toLowerCase() || "(none)";
    counts.set(extension, (counts.get(extension) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
}

/** Build an initial summary object. */
function emptySummary(scanned: number, skippedFiles: ConvertSummary["skippedFiles"]): ConvertSummary {
  return {
    scanned,
    written: 0,
    skipped: skippedFiles.length,
    failed: 0,
    outputs: [],
    skippedFiles,
    failures: [],
  };
}

/** Convert one source file and update the summary. */
async function convertOneFile(
  inputRoot: string,
  sourcePath: string,
  options: NormalizedConvertOptions,
  summary: ConvertSummary,
): Promise<void> {
  try {
    const converted = await convertFileToMarkdown(sourcePath, options.pdfEngine);
    assertHasContent(converted);
    const outputs = await writeConvertedFile(inputRoot, sourcePath, converted, options);
    summary.outputs.push(...outputs);
    summary.written += outputs.length;
  } catch (error) {
    summary.failed += 1;
    summary.failures.push({ filePath: sourcePath, error: errorMessage(error) });
  }
}

/** Write converted content, splitting long bodies into numbered parts. */
async function writeConvertedFile(
  inputRoot: string,
  sourcePath: string,
  converted: ConvertedFile,
  options: NormalizedConvertOptions,
): Promise<ConvertOutput[]> {
  const stem = buildOutputStem(sourcePath, inputRoot);
  const chunks = chunkMarkdown(converted.body, options.chunkSize);
  const outputs: ConvertOutput[] = [];
  for (const [index, chunk] of chunks.entries()) {
    const outputPath = path.join(options.outDir, buildOutputFilename(stem, index + 1, chunks.length));
    const content = buildOutputContent(
      sourcePath,
      converted,
      chunk,
      index + 1,
      chunks.length,
      options,
    );
    await writeFile(outputPath, content, "utf-8");
    outputs.push({ sourcePath, outputPath, part: index + 1, totalParts: chunks.length });
  }
  return outputs;
}

/** Build Markdown output content with conversion provenance frontmatter. */
function buildOutputContent(
  sourcePath: string,
  converted: ConvertedFile,
  body: string,
  part: number,
  totalParts: number,
  options: NormalizedConvertOptions,
): string {
  if (converted.sourceType === "markdown" && totalParts === 1) {
    return ensureTrailingNewline(body);
  }
  const fields: Record<string, unknown> = {
    title: converted.title,
    source: path.resolve(sourcePath),
    sourceType: converted.sourceType,
    convertedBy: "llmwiki convert",
    part,
    totalParts,
  };
  if (converted.sourceType === "pdf") fields.pdfEngine = options.pdfEngine;
  const frontmatter = buildFrontmatter(fields);
  return `${frontmatter}\n\n${body.trim()}\n`;
}

/** Print a concise conversion report for CLI users. */
function printSummary(summary: ConvertSummary, outDir: string): void {
  console.log(`Converted to: ${outDir}`);
  console.log(`Scanned: ${summary.scanned}`);
  console.log(`Written Markdown files: ${summary.written}`);
  console.log(`Skipped files: ${summary.skipped}`);
  console.log(`Failed conversions: ${summary.failed}`);
  printFailures(summary.failures);
}

/** Print failed conversions without overwhelming successful runs. */
function printFailures(failures: ConvertFailure[]): void {
  if (failures.length === 0) return;
  console.log("\nFailures:");
  for (const failure of failures) {
    console.log(`- ${failure.filePath}: ${failure.error}`);
  }
}

/** Coerce unknown caught values into strings. */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Preserve conventional final newlines in copied Markdown files. */
function ensureTrailingNewline(content: string): string {
  return content.endsWith("\n") ? content : `${content}\n`;
}

/** Fail clearly when a supported file produces no useful Markdown body. */
function assertHasContent(converted: ConvertedFile): void {
  if (converted.body.trim().length > 0) return;
  throw new Error("No extractable content found.");
}
