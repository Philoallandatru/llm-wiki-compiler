/**
 * Option parsing and validation for the convert command.
 *
 * Keeps Commander-facing string parsing out of the conversion pipeline so
 * tests can exercise normalized behavior directly.
 */

import path from "path";
import {
  DEFAULT_CHUNK_SIZE,
  type ConvertOptions,
  type NormalizedConvertOptions,
  type PdfEngine,
  SUPPORTED_PDF_ENGINES,
} from "./types.js";

/** Normalize user-facing CLI options into strongly typed conversion settings. */
export function normalizeConvertOptions(options: ConvertOptions): NormalizedConvertOptions {
  if (!options.out || options.out.trim().length === 0) {
    throw new Error("Missing required --out <folder> option.");
  }
  return {
    outDir: path.resolve(options.out),
    pdfEngine: normalizePdfEngine(options.pdfEngine),
    chunkSize: normalizeChunkSize(options.chunkSize),
    includeExtensions: normalizeIncludeExtensions(options.include),
    excludePatterns: normalizeExcludePatterns(options.exclude),
  };
}

/** Return the supported PDF engine, failing loudly for future/unknown names. */
function normalizePdfEngine(rawEngine: string | undefined): PdfEngine {
  const engine = (rawEngine ?? "pymupdf").trim().toLowerCase();
  if (SUPPORTED_PDF_ENGINES.includes(engine as PdfEngine)) return engine as PdfEngine;
  throw new Error("Unsupported PDF engine. Currently supported: pymupdf.");
}

/** Parse and validate the chunk size option. */
function normalizeChunkSize(rawSize: number | undefined): number {
  if (rawSize === undefined) return DEFAULT_CHUNK_SIZE;
  if (Number.isInteger(rawSize) && rawSize > 0) return rawSize;
  throw new Error("--chunk-size must be a positive integer.");
}

/** Parse a comma-separated extension allow-list. */
function normalizeIncludeExtensions(rawInclude: string | undefined): Set<string> | null {
  if (!rawInclude || rawInclude.trim().length === 0) return null;
  const extensions = rawInclude
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
    .map((item) => (item.startsWith(".") ? item : `.${item}`));
  return extensions.length > 0 ? new Set(extensions) : null;
}

/** Parse custom scanner skip patterns. */
function normalizeExcludePatterns(rawExclude: string | undefined): string[] {
  return (rawExclude ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
}
