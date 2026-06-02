/**
 * Commander action for `llmwiki batch-compile <folder>`.
 *
 * Ingests files from a directory in batches, compiling after each batch.
 * This allows incremental knowledge building where each batch can reference
 * concepts extracted from previous batches.
 */

import path from "path";
import { stat } from "fs/promises";
import { ingestSource } from "./ingest.js";
import compileCommand from "./compile.js";
import * as output from "../utils/output.js";
import { createProjectContext } from "../utils/project-resolver.js";
import { listDirectoryFiles, chunkArray } from "../utils/fs-helpers.js";

/** Result of ingesting a single file in a batch. */
interface BatchIngestResult {
  filename: string;
  success: boolean;
  error?: string;
  charCount?: number;
}

/** Command-line options accepted by `batch-compile`. */
interface BatchCompileOptions {
  batch?: number;
  project?: string;
}

/** Data needed to run all batches after input and project resolution. */
interface BatchCompileSetup {
  batchSize: number;
  batches: string[][];
  sourcesDir: string;
  projectId: string;
  folderPath: string;
}

/** Aggregate result across all processed batches. */
interface BatchTotals {
  ingested: number;
  failed: number;
  compiled: number;
}

/**
 * Ingest a single file, returning success/failure result.
 * Catches errors so individual file failures do not abort the batch.
 */
async function ingestFileForBatch(
  filePath: string,
  sourcesDir?: string,
): Promise<BatchIngestResult> {
  try {
    const result = await ingestSource(filePath, sourcesDir);
    return {
      filename: path.basename(filePath),
      success: true,
      charCount: result.charCount,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      filename: path.basename(filePath),
      success: false,
      error: message,
    };
  }
}

/**
 * Ingest all files in a batch, continuing on individual failures.
 * Uses Promise.all for parallel processing.
 */
async function ingestBatch(
  files: string[],
  sourcesDir?: string,
): Promise<{ succeeded: number; failed: number; results: BatchIngestResult[] }> {
  const results = await Promise.all(
    files.map((file) => ingestFileForBatch(file, sourcesDir)),
  );

  const succeeded = results.filter((result) => result.success).length;
  const failed = results.filter((result) => !result.success).length;

  return { succeeded, failed, results };
}

/** Report ingest results for a batch. */
function reportIngestResults(results: BatchIngestResult[]): void {
  for (const result of results) {
    reportIngestResult(result);
  }
}

/** Report a single file ingest result. */
function reportIngestResult(result: BatchIngestResult): void {
  if (result.success) {
    output.status(
      "+",
      output.success(
        `Ingested ${output.bold(result.filename)} (${result.charCount?.toLocaleString()} chars)`,
      ),
    );
    return;
  }

  output.status("!", output.warn(`Skipped ${result.filename}: ${result.error}`));
}

/** Process a single batch: ingest files and compile. */
async function processBatch(
  batch: string[],
  batchNum: number,
  totalBatches: number,
  sourcesDir: string,
  projectId: string,
): Promise<BatchTotals> {
  output.header(`Batch ${batchNum}/${totalBatches}`);
  output.status("*", output.info(`Ingesting ${batch.length} file(s)...`));

  const ingestResult = await ingestBatch(batch, sourcesDir);
  reportIngestResults(ingestResult.results);

  if (ingestResult.succeeded === 0) {
    reportSkippedCompile(batchNum, ingestResult.failed);
    return { ingested: 0, failed: ingestResult.failed, compiled: 0 };
  }

  output.status(
    ">",
    output.dim(
      `Batch ${batchNum}: Ingested ${ingestResult.succeeded}, skipped ${ingestResult.failed}`,
    ),
  );
  await compileBatch(batchNum, projectId);

  return { ingested: ingestResult.succeeded, failed: ingestResult.failed, compiled: 1 };
}

/** Report when a batch has no successfully imported files. */
function reportSkippedCompile(batchNum: number, failed: number): void {
  output.status(
    "!",
    output.warn(`Batch ${batchNum}: No files ingested successfully. Skipping compile.`),
  );
}

/** Compile after a successful batch and fail fast if compilation fails. */
async function compileBatch(batchNum: number, projectId: string): Promise<void> {
  output.status("*", output.info("Compiling..."));

  try {
    await compileCommand({}, projectId);
    output.status("+", output.success(`Batch ${batchNum} compiled successfully`));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    output.status("!", output.error(`Batch ${batchNum} compile failed: ${message}`));
    throw new Error(
      `Batch ${batchNum} failed after ingest. ` +
        `Fix the compile error, then run \`llmwiki compile\` to process already-ingested files.`,
    );
  }
}

/** Validate folder path and return file list. */
async function validateAndListFiles(folderPath: string): Promise<string[]> {
  const folderStat = await stat(folderPath).catch(() => {
    throw new Error(`Path not found: ${folderPath}`);
  });

  if (!folderStat.isDirectory()) {
    throw new Error(`Path is not a directory: ${folderPath}`);
  }

  const files = await listDirectoryFiles(folderPath);

  if (files.length === 0) {
    throw new Error(`No files found in directory: ${folderPath}`);
  }

  return files;
}

/** Resolve files, batch chunks, and the target project for a command run. */
async function prepareBatchCompile(
  folderPath: string,
  options: BatchCompileOptions,
): Promise<BatchCompileSetup> {
  const batchSize = options.batch ?? 5;
  const files = await validateAndListFiles(folderPath);
  const { paths, project } = await createProjectContext(
    process.cwd(),
    options.project,
  );

  return {
    batchSize,
    batches: chunkArray(files, batchSize),
    sourcesDir: paths.sourcesDir,
    projectId: project.id,
    folderPath,
  };
}

/** Print the initial command summary before processing begins. */
function reportBatchPlan(setup: BatchCompileSetup): void {
  const fileCount = setup.batches.reduce((sum, batch) => sum + batch.length, 0);

  output.status(
    "*",
    output.info(`Found ${fileCount} file(s) in: ${setup.folderPath}`),
  );
  output.status(">", output.dim(`Processing in batches of ${setup.batchSize}`));
}

/** Process every batch and return aggregate ingest totals. */
async function processBatches(setup: BatchCompileSetup): Promise<BatchTotals> {
  const totals: BatchTotals = { ingested: 0, failed: 0, compiled: 0 };

  for (let i = 0; i < setup.batches.length; i++) {
    const result = await processBatch(
      setup.batches[i],
      i + 1,
      setup.batches.length,
      setup.sourcesDir,
      setup.projectId,
    );
    totals.ingested += result.ingested;
    totals.failed += result.failed;
    totals.compiled += result.compiled;
    printBatchGap(i, setup.batches.length);
  }

  return totals;
}

/** Add a blank line between batches, but not after the last one. */
function printBatchGap(batchIndex: number, batchCount: number): void {
  if (batchIndex < batchCount - 1) {
    console.log("");
  }
}

/** Report aggregate results and fail the command if no files were usable. */
function reportBatchSummary(setup: BatchCompileSetup, totals: BatchTotals): void {
  output.header("Summary");
  output.status(
    ">",
    output.dim(
      `Total: ${totals.ingested} ingested, ${totals.failed} failed, ${totals.compiled}/${setup.batches.length} batch(es) compiled`,
    ),
  );

  if (totals.ingested === 0) {
    throw new Error(
      `No files ingested successfully from ${setup.folderPath}. ` +
        `Check that at least one file is in a supported format.`,
    );
  }
}

/**
 * Process files from a directory in batches, compiling after each batch.
 * @param folderPath - Path to directory containing files to ingest.
 * @param options - Batch size and optional project ID.
 */
export default async function batchCompileCommand(
  folderPath: string,
  options: BatchCompileOptions,
): Promise<void> {
  const setup = await prepareBatchCompile(folderPath, options);
  reportBatchPlan(setup);
  const totals = await processBatches(setup);
  reportBatchSummary(setup, totals);
}
