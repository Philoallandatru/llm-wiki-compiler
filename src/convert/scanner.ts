/**
 * Recursive scanner for folder conversion.
 *
 * It collects supported files, skips known generated/dependency folders, and
 * protects the output directory from being read while it is being written.
 */

import { readdir, stat } from "fs/promises";
import path from "path";
import {
  DEFAULT_EXCLUDED_DIRS,
  SUPPORTED_EXTENSIONS,
  type ConvertSkipped,
  type NormalizedConvertOptions,
  type ScanResult,
} from "./types.js";
import { isPathInside } from "./path-utils.js";
import { fileLooksLikeText, textLikeExtensions } from "./text-like.js";

const supportedExtensions = new Set<string>([...SUPPORTED_EXTENSIONS, ...textLikeExtensions()]);
const defaultExcludedDirs = new Set<string>(DEFAULT_EXCLUDED_DIRS);

/** Recursively scan inputRoot for files that can be converted to Markdown. */
export async function scanConvertInput(
  inputRoot: string,
  options: NormalizedConvertOptions,
): Promise<ScanResult> {
  const root = path.resolve(inputRoot);
  const rootStat = await stat(root);
  if (!rootStat.isDirectory()) throw new Error(`Input path is not a directory: ${root}`);

  const result: ScanResult = { candidates: [], skipped: [] };
  await scanDirectory(root, root, options, result);
  result.candidates.sort((a, b) => a.localeCompare(b));
  return result;
}

/** Visit one directory and recurse into child directories. */
async function scanDirectory(
  root: string,
  currentDir: string,
  options: NormalizedConvertOptions,
  result: ScanResult,
): Promise<void> {
  if (shouldSkipDirectory(currentDir, root, options)) return;
  const entries = await readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      await scanDirectory(root, entryPath, options, result);
    } else if (entry.isFile()) {
      await addFileCandidate(entryPath, options, result);
    }
  }
}

/** Decide whether a directory should be skipped. */
function shouldSkipDirectory(
  dirPath: string,
  root: string,
  options: NormalizedConvertOptions,
): boolean {
  if (isPathInside(dirPath, options.outDir)) return true;
  const name = path.basename(dirPath).toLowerCase();
  if (dirPath !== root && defaultExcludedDirs.has(name)) return true;
  if (matchesExcludeDirPattern(name, options.excludeDirPatterns)) return true;
  return matchesExcludePattern(dirPath, options.excludePatterns);
}

/** Add a file to the conversion list or record why it was skipped. */
async function addFileCandidate(
  filePath: string,
  options: NormalizedConvertOptions,
  result: ScanResult,
): Promise<void> {
  const extension = path.extname(filePath).toLowerCase();
  if (matchesExcludePattern(filePath, options.excludePatterns)) {
    result.skipped.push({ filePath, reason: "matched --exclude" });
    return;
  }
  if (!supportedExtensions.has(extension) && extension !== "") {
    result.skipped.push({ filePath, reason: `unsupported extension ${extension || "(none)"}` });
    return;
  }
  if (options.includeExtensions && !options.includeExtensions.has(extension)) {
    result.skipped.push({ filePath, reason: "not matched by --include" });
    return;
  }
  if (extension === "" && !(await fileLooksLikeText(filePath))) {
    result.skipped.push({ filePath, reason: "binary-looking extensionless file" });
    return;
  }
  result.candidates.push(filePath);
}

/** Return true when a path contains one of the user-provided skip patterns. */
function matchesExcludePattern(filePath: string, patterns: string[]): boolean {
  const normalized = filePath.toLowerCase();
  return patterns.some((pattern) => pattern.length > 0 && normalized.includes(pattern));
}

/** Return true when a directory name matches one of the exclusion patterns. */
function matchesExcludeDirPattern(dirName: string, patterns: string[]): boolean {
  return patterns.some((pattern) => pattern.length > 0 && dirName === pattern);
}
