/**
 * Path and filename helpers for flattened Markdown conversion output.
 *
 * Flattening keeps the generated folder easy to inspect while deterministic
 * hashes prevent same-named files from clobbering each other.
 */

import crypto from "crypto";
import path from "path";
import { slugify } from "../utils/markdown.js";

/** Return true when childPath resolves inside parentPath or equals it. */
export function isPathInside(childPath: string, parentPath: string): boolean {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

/** Build a stable flattened Markdown filename from a source path. */
export function buildOutputStem(sourcePath: string, inputRoot: string): string {
  const relativePath = path.relative(inputRoot, sourcePath);
  const parsed = path.parse(sourcePath);
  const slug = slugify(parsed.name) || "document";
  const digest = crypto.createHash("sha1").update(relativePath).digest("hex").slice(0, 8);
  return `${slug}-${digest}`;
}

/** Build the output filename for a single document or numbered chunk. */
export function buildOutputFilename(stem: string, part: number, totalParts: number): string {
  if (totalParts <= 1) return `${stem}.md`;
  return `${stem}.part-${String(part).padStart(3, "0")}.md`;
}

/** Produce a readable title from the source filename. */
export function titleFromPath(filePath: string): string {
  const name = path.parse(filePath).name.replace(/[-_]+/g, " ").trim();
  return name.length > 0 ? name : "Untitled";
}
