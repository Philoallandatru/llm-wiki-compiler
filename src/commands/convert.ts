/**
 * CLI command implementation for converting a folder into Markdown files.
 *
 * The command recursively reads supported source files, writes all generated
 * Markdown files into one new top-level output directory, and chunks long
 * converted documents so later ingest/compile runs stay manageable.
 */

import { mkdir, mkdtemp, rename, rm, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { buildFrontmatter, parseFrontmatterStatus } from "../utils/markdown.js";
import { chunkMarkdown } from "../convert/chunker.js";
import { convertFileToMarkdown } from "../convert/converters.js";
import { normalizeConvertOptions } from "../convert/options.js";
import { buildOutputFilename, buildOutputStem, isPathInside } from "../convert/path-utils.js";
import { scanConvertInput } from "../convert/scanner.js";
import { createProgressTracker } from "../convert/progress.js";
import {
  validateMarkdown,
  generateValidationSummary,
  type ValidationResult,
} from "../convert/validator.js";
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
  assertOutputFolderAllowed(inputRoot, normalized.outDir);
  assertOutputDoesNotExist(normalized.outDir);
  const scan = await scanConvertInput(inputRoot, normalized);
  const summary = emptySummary(scan.candidates.length, scan.skipped);

  printPlan(scan.candidates, scan.skipped.length);
  const tempOutDir = await createTemporaryOutputDir(normalized.outDir);
  const workOptions = { ...normalized, outDir: tempOutDir };

  const progress = createProgressTracker();
  const validations = new Map<string, ValidationResult>();

  try {
    progress.start(scan.candidates.length);

    for (const [index, sourcePath] of scan.candidates.entries()) {
      progress.update(index + 1, sourcePath);
      await convertOneFile(inputRoot, sourcePath, workOptions, summary);
    }

    progress.finish();

    if (normalized.validate) {
      await validateAllOutputs(summary, validations);
      await handleValidationReport(normalized, validations, summary);
    }

    await publishConvertedOutput(summary, tempOutDir, normalized.outDir);
    printSummary(summary, normalized.outDir);
    return summary;
  } catch (error) {
    progress.finish();
    await cleanupTemporaryOutput(tempOutDir);
    printSummary(summary, normalized.outDir);
    throw error;
  }
}

/** Reject output paths that would make the input disappear during scanning. */
function assertOutputFolderAllowed(inputRoot: string, outDir: string): void {
  if (!isPathInside(inputRoot, outDir)) return;
  throw new Error("--out must be a separate folder, not the input folder or one of its parents.");
}

/** Reject ambiguous output targets before doing conversion work. */
function assertOutputDoesNotExist(outDir: string): void {
  if (!existsSync(outDir)) return;
  throw new Error(`Output folder already exists: ${outDir}`);
}

/** Create a sibling temp directory so final rename stays on the same filesystem. */
async function createTemporaryOutputDir(outDir: string): Promise<string> {
  const parent = path.dirname(outDir);
  await mkdir(parent, { recursive: true });
  return await mkdtemp(path.join(parent, `.${path.basename(outDir)}.tmp-`));
}

/** Publish temp outputs and rewrite summary paths to the final directory. */
async function publishConvertedOutput(
  summary: ConvertSummary,
  tempOutDir: string,
  finalOutDir: string,
): Promise<void> {
  if (summary.failed > 0) {
    throw new Error("One or more files failed to convert.");
  }
  await rename(tempOutDir, finalOutDir);
  rewriteOutputPaths(summary, tempOutDir, finalOutDir);
}

/** Remove temp output on failed conversion or failed publish. */
async function cleanupTemporaryOutput(tempOutDir: string): Promise<void> {
  await rm(tempOutDir, { recursive: true, force: true });
}

/** Point summary outputs at the published folder instead of the temp folder. */
function rewriteOutputPaths(
  summary: ConvertSummary,
  tempOutDir: string,
  finalOutDir: string,
): void {
  summary.outputs = summary.outputs.map((item) => ({
    ...item,
    outputPath: path.join(finalOutDir, path.relative(tempOutDir, item.outputPath)),
  }));
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
  const body = bodyForChunking(converted);
  assertHasContent(body);
  const chunks = chunkMarkdown(body, options.chunkSize);
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
  if (converted.contexts && converted.contexts.length > 0) fields.contexts = converted.contexts;
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

  if (summary.validationIssues && summary.validationIssues.length > 0) {
    console.log(`\nValidation issues: ${summary.validationIssues.length}`);
    const bySeverity = groupBySeverity(summary.validationIssues);
    if (bySeverity.error > 0) console.log(`  Errors: ${bySeverity.error}`);
    if (bySeverity.warning > 0) console.log(`  Warnings: ${bySeverity.warning}`);
    if (bySeverity.info > 0) console.log(`  Info: ${bySeverity.info}`);
  }

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

/** Return the body to chunk, stripping valid existing frontmatter from Markdown. */
function bodyForChunking(converted: ConvertedFile): string {
  if (converted.sourceType !== "markdown") return converted.body;
  const parsed = parseFrontmatterStatus(converted.body);
  if (!parsed.hasFrontmatterBlock || parsed.malformedFrontmatter) return converted.body;
  return parsed.body;
}

/** Fail clearly when a supported file produces no useful Markdown body. */
function assertHasContent(body: string): void {
  if (body.trim().length > 0) return;
  throw new Error("No extractable content found.");
}

/** Validate all converted output files in batch. */
async function validateAllOutputs(
  summary: ConvertSummary,
  validations: Map<string, ValidationResult>,
): Promise<void> {
  for (const output of summary.outputs) {
    const content = await readFile(output.outputPath, "utf-8");
    const result = validateMarkdown(content, output.outputPath);
    validations.set(output.outputPath, result);

    if (!result.valid || result.issues.length > 0) {
      summary.validationIssues = [...(summary.validationIssues ?? []), ...result.issues];
    }
  }
}

/** Write validation report and update summary if validation is enabled. */
async function handleValidationReport(
  options: NormalizedConvertOptions,
  validations: Map<string, ValidationResult>,
  summary: ConvertSummary,
): Promise<void> {
  const validationSummary = generateValidationSummary(validations);

  if (options.validationReportPath) {
    const reportContent = JSON.stringify(validationSummary, null, 2);
    await writeFile(options.validationReportPath, reportContent, "utf-8");
    console.log(`\nValidation report written to: ${options.validationReportPath}`);
  }
}

/** Group validation issues by severity for summary display. */
function groupBySeverity(issues: ConvertSummary["validationIssues"]): {
  error: number;
  warning: number;
  info: number;
} {
  if (!issues) return { error: 0, warning: 0, info: 0 };

  const counts = { error: 0, warning: 0, info: 0 };
  for (const issue of issues) {
    counts[issue.severity]++;
  }
  return counts;
}
