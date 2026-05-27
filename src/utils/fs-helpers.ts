/**
 * File system helper utilities.
 *
 * Shared functions for directory traversal and file operations.
 */

import path from "path";
import { readdir, stat } from "fs/promises";

/**
 * Collect all files directly inside a directory (non-recursive).
 * @param dirPath - Path to directory to scan.
 * @returns Array of absolute file paths.
 */
export async function listDirectoryFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath);
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dirPath, entry);
    const info = await stat(full);
    if (info.isFile()) files.push(full);
  }

  return files;
}

/**
 * Split an array into chunks of specified size.
 * @param array - Array to split.
 * @param chunkSize - Maximum size of each chunk.
 * @returns Array of chunks.
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
