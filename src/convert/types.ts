/**
 * Shared types and defaults for folder-to-Markdown conversion.
 *
 * The convert command intentionally writes only to a standalone output
 * directory. It prepares Markdown sources for later ingest/compile without
 * mutating the active llmwiki project.
 */

/** Default character limit before converted Markdown is split into parts. */
export const DEFAULT_CHUNK_SIZE = 100_000;

/** Built-in document extensions that the convert command can turn into Markdown. */
export const SUPPORTED_EXTENSIONS = [".md", ".txt", ".pdf", ".html", ".htm"] as const;

/** Directories skipped by the recursive scanner unless files are addressed elsewhere. */
export const DEFAULT_EXCLUDED_DIRS = [".git", "node_modules", "dist"] as const;

/** Supported PDF extraction engine names. */
export const SUPPORTED_PDF_ENGINES = ["pymupdf"] as const;

export type ConvertSourceType = "markdown" | "text" | "pdf" | "html" | "code" | "config" | "log";

export type PdfEngine = (typeof SUPPORTED_PDF_ENGINES)[number];

export interface ConvertOptions {
  /** Required output directory. All generated Markdown files are placed here. */
  out: string;
  /** PDF extraction engine. Only PyMuPDF is currently supported. */
  pdfEngine?: string;
  /** Maximum body characters per Markdown output file. */
  chunkSize?: number;
  /** Comma-separated extension allow-list, for example ".txt,.pdf". */
  include?: string;
  /** Comma-separated path substrings to skip during recursive scanning. */
  exclude?: string;
}

export interface NormalizedConvertOptions {
  outDir: string;
  pdfEngine: PdfEngine;
  chunkSize: number;
  includeExtensions: Set<string> | null;
  excludePatterns: string[];
}

export interface ScanResult {
  candidates: string[];
  skipped: ConvertSkipped[];
}

export interface ConvertSkipped {
  filePath: string;
  reason: string;
}

export interface ConvertedFile {
  title: string;
  body: string;
  sourceType: ConvertSourceType;
}

export interface ConvertOutput {
  sourcePath: string;
  outputPath: string;
  part?: number;
  totalParts?: number;
}

export interface ConvertFailure {
  filePath: string;
  error: string;
}

export interface ConvertSummary {
  scanned: number;
  written: number;
  skipped: number;
  failed: number;
  outputs: ConvertOutput[];
  skippedFiles: ConvertSkipped[];
  failures: ConvertFailure[];
}
