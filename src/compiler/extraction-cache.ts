/**
 * Persistent cache for concept extraction results.
 *
 * The compile pipeline has two expensive LLM phases: extracting concepts from
 * source files and generating wiki pages from merged concepts. This module
 * caches the first phase under `.llmwiki/extractions/` as soon as a source is
 * successfully extracted, so an interrupted compile can resume without paying
 * for the same extraction again. Entries are deliberately conservative: they
 * are reused only when the source hash, active provider/model, output language,
 * extraction prompt version, and current index hash all match.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { EXTRACTIONS_DIR } from "../utils/constants.js";
import { atomicWrite } from "../utils/markdown.js";
import { getActiveModelName, getActiveProviderName } from "../utils/provider.js";
import type { ExtractedConcept } from "../utils/types.js";
import { hashFile } from "./hasher.js";

/** Version for the extraction prompt and cache semantics. */
const EXTRACTION_PROMPT_VERSION = "extract-concepts-v1";

/** All context that must match before an extraction cache entry can be reused. */
export interface ExtractionCacheContext {
  sourceFile: string;
  sourceHash: string;
  provider: string;
  model: string;
  promptVersion: string;
  indexHash: string;
  outputLang: string;
}

/** JSON payload stored under `.llmwiki/extractions/`. */
interface ExtractionCacheEntry extends ExtractionCacheContext {
  version: 1;
  concepts: ExtractedConcept[];
  createdAt: string;
}

/** Build the cache context for one source extraction attempt. */
export async function buildExtractionCacheContext(
  sourceFile: string,
  sourcePath: string,
  existingIndex: string,
): Promise<ExtractionCacheContext> {
  return {
    sourceFile,
    sourceHash: await hashFile(sourcePath),
    provider: getActiveProviderName(),
    model: getActiveModelName(),
    promptVersion: EXTRACTION_PROMPT_VERSION,
    indexHash: hashText(existingIndex),
    outputLang: process.env.LLMWIKI_OUTPUT_LANG?.trim() ?? "",
  };
}

/** Read cached concepts when the entry exactly matches the current context. */
export async function readCachedExtraction(
  root: string,
  context: ExtractionCacheContext,
): Promise<ExtractedConcept[] | null> {
  const entry = await readCacheEntry(cachePath(root, context));
  if (!entry || !matchesContext(entry, context)) return null;
  return entry.concepts;
}

/** Persist extracted concepts for later interrupted-compile recovery. */
export async function writeCachedExtraction(
  root: string,
  context: ExtractionCacheContext,
  concepts: ExtractedConcept[],
): Promise<void> {
  const entry: ExtractionCacheEntry = {
    version: 1,
    ...context,
    concepts,
    createdAt: new Date().toISOString(),
  };
  await atomicWrite(cachePath(root, context), JSON.stringify(entry, null, 2));
}

/** Return the absolute cache path for a source/context pair. */
function cachePath(root: string, context: ExtractionCacheContext): string {
  return path.join(root, EXTRACTIONS_DIR, `${cacheId(context)}.json`);
}

/** Stable filename that avoids leaking raw paths or needing sanitisation. */
function cacheId(context: ExtractionCacheContext): string {
  return hashText(`${context.sourceFile}\0${context.sourceHash}`);
}

/** Parse one cache file, ignoring missing or malformed entries. */
async function readCacheEntry(filePath: string): Promise<ExtractionCacheEntry | null> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return isCacheEntry(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Check every invalidation field before reusing a cached extraction. */
function matchesContext(
  entry: ExtractionCacheEntry,
  context: ExtractionCacheContext,
): boolean {
  return Object.entries(context).every(([key, value]) => {
    const entryValue = entry[key as keyof ExtractionCacheContext];
    return entryValue === value;
  });
}

/** Defensive validation for untrusted cache JSON. */
function isCacheEntry(value: unknown): value is ExtractionCacheEntry {
  const entry = value as Partial<ExtractionCacheEntry>;
  return (
    Boolean(entry) &&
    entry.version === 1 &&
    typeof entry.sourceFile === "string" &&
    typeof entry.sourceHash === "string" &&
    Array.isArray(entry.concepts) &&
    entry.concepts.every(isExtractedConcept)
  );
}

/** Validate the minimal concept shape needed by the compiler. */
function isExtractedConcept(value: unknown): value is ExtractedConcept {
  const concept = value as Partial<ExtractedConcept>;
  return (
    Boolean(concept) &&
    typeof concept.concept === "string" &&
    typeof concept.summary === "string" &&
    typeof concept.is_new === "boolean"
  );
}

/** SHA-256 helper for context fields and cache filenames. */
function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
