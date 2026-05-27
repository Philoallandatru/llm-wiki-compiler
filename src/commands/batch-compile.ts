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

/**
 * Ingest a single file, returning success/failure result.
 * Catches errors so individual file failures don't abort the batch.
 */
async function ingestFileForBatch(
  filePath: string,
  sourcesDir?: string
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
  sourcesDir?: string
): Promise<{ succeeded: number; failed: number; results: BatchIngestResult[] }> {
  const results = await Promise.all(
    files.map((file) => ingestFileForBatch(file, sourcesDir))
  );

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { succeeded, failed, results };
}

/** Report ingest results for a batch. */
function reportIngestResults(results: BatchIngestResult[]): void {
  for (const result of results) {
    if (result.success) {
      output.status(
        "+",
        output.success(
          `Ingested ${output.bold(result.filename)} (${result.charCount?.toLocaleString()} chars)`
        )
      );
    } else {
      output.status(
        "!",
        output.warn(`Skipped ${result.filename}: ${result.error}`)
      );
    }
  }
}

/** Process a single batch: ingest files and compile. */
async function processBatch(
  batch: string[],
  batchNum: number,
  totalBatches: number,
  sourcesDir: string,
  projectId: string
): Promise<{ ingested: number; failed: number }> {
  output.header(`Batch ${batchNum}/${totalBatches}`);
  output.status("*", output.info(`Ingesting ${batch.length} file(s)...`));

  const ingestResult = await ingestBatch(batch, sourcesDir);
  reportIngestResults(ingestResult.results);

  if (ingestResult.succeeded === 0) {
    output.status(
      "!",
      output.warn(
        `Batch ${batchNum}: No files ingested successfully. Skipping compile.`
      )
    );
    return { ingested: 0, failed: ingestResult.failed };
  }

  output.status(
    "→",
    output.dim(
      `Batch ${batchNum}: Ingested ${ingestResult.succeeded}, skipped ${ingestResult.failed}`
    )
  );

  output.status("*", output.info("Compiling..."));

  try {
    await compileCommand({}, projectId);
    output.status(
      "✓",
      output.success(`Batch ${batchNum} compiled successfully`)
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    output.status(
      "!",
      output.error(`Batch ${batchNum} compile failed: ${message}`)
    );
  }

  return { ingested: ingestResult.succeeded, failed: ingestResult.failed };
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

/**
 * Process files from a directory in batches, compiling after each batch.
 * @param folderPath - Path to directory containing files to ingest.
 * @param options - Batch size and optional project ID.
 */
export default async function batchCompileCommand(
  folderPath: string,
  options: {
    batch?: number;
    project?: string;
  }
): Promise<void> {
  const batchSize = options.batch ?? 5;
  const files = await validateAndListFiles(folderPath);

  output.status(
    "*",
    output.info(`Found ${files.length} file(s) in: ${folderPath}`)
  );
  output.status("→", output.dim(`Processing in batches of ${batchSize}`));

  const { paths, project } = await createProjectContext(
    process.cwd(),
    options.project
  );

  const batches = chunkArray(files, batchSize);
  let totalIngested = 0;
  let totalFailed = 0;

  for (let i = 0; i < batches.length; i++) {
    const result = await processBatch(
      batches[i],
      i + 1,
      batches.length,
      paths.sourcesDir,
      project.id
    );
    totalIngested += result.ingested;
    totalFailed += result.failed;

    if (i < batches.length - 1) {
      console.log("");
    }
  }

  output.header("Summary");
  output.status(
    "→",
    output.dim(
      `Total: ${totalIngested} ingested, ${totalFailed} failed, ${batches.length} batch(es) processed`
    )
  );

  if (totalIngested === 0) {
    throw new Error(
      `No files ingested successfully from ${folderPath}. ` +
        `Check that at least one file is in a supported format.`
    );
  }
}
