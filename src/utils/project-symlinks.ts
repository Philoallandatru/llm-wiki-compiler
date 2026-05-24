/**
 * Project symlink management for compile command.
 *
 * Creates temporary symlinks to make the active project's directories
 * appear as the default sources/ and wiki/ directories, allowing the
 * existing compile pipeline to work without modification.
 */

import { symlink, unlink, rename } from "fs/promises";
import { existsSync, lstatSync } from "fs";
import path from "path";
import { getActiveProject, resolveProjectPaths } from "./project-config.js";

/**
 * Setup symlinks for the active project.
 * Creates sources -> projects/{id}/sources and wiki -> projects/{id}/wiki
 *
 * @param root - Project root directory
 * @returns Cleanup function to remove symlinks and restore originals
 */
export async function setupProjectSymlinks(root: string): Promise<() => Promise<void>> {
  const project = await getActiveProject(root);

  // Skip symlinks for default project (already uses sources/ and wiki/)
  if (project.id === "default") {
    return async () => {}; // No-op cleanup
  }

  const paths = resolveProjectPaths(root, project);
  const sourcesLink = path.join(root, "sources");
  const wikiLink = path.join(root, "wiki");
  const sourcesBackup = path.join(root, ".sources.backup");
  const wikiBackup = path.join(root, ".wiki.backup");

  // Backup existing directories
  const needsSourcesRestore = await backupIfExists(sourcesLink, sourcesBackup);
  const needsWikiRestore = await backupIfExists(wikiLink, wikiBackup);

  // Remove any existing symlinks before creating new ones
  await removeIfSymlink(sourcesLink);
  await removeIfSymlink(wikiLink);

  // Create new symlinks
  const sourcesTarget = path.relative(root, paths.sourcesDir);
  const wikiTarget = path.relative(root, paths.wikiDir);

  try {
    await symlink(sourcesTarget, sourcesLink, "junction");
    await symlink(wikiTarget, wikiLink, "junction");
  } catch (err) {
    // If symlink creation fails, restore both backups
    if (needsSourcesRestore) await rename(sourcesBackup, sourcesLink);
    if (needsWikiRestore) await rename(wikiBackup, wikiLink);
    throw err;
  }

  // Return cleanup function
  return async () => {
    await removeIfSymlink(sourcesLink);
    await removeIfSymlink(wikiLink);

    // Restore backups
    if (needsSourcesRestore && existsSync(sourcesBackup)) {
      await rename(sourcesBackup, sourcesLink);
    }
    if (needsWikiRestore && existsSync(wikiBackup)) {
      await rename(wikiBackup, wikiLink);
    }
  };
}

/**
 * Backup a path if it exists and is not a symlink.
 * If the path is already a symlink, it's preserved (not removed).
 * @returns true if backup was created
 */
async function backupIfExists(originalPath: string, backupPath: string): Promise<boolean> {
  if (!existsSync(originalPath)) return false;

  try {
    const stats = lstatSync(originalPath);
    // If it's already a symlink, leave it alone - the caller will handle it
    if (stats.isSymbolicLink()) {
      return false;
    }

    // Backup the directory
    await rename(originalPath, backupPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a path if it's a symlink.
 */
async function removeIfSymlink(linkPath: string): Promise<void> {
  if (!existsSync(linkPath)) return;

  try {
    const stats = lstatSync(linkPath);
    if (stats.isSymbolicLink()) {
      await unlink(linkPath);
    }
  } catch {
    // Ignore errors
  }
}
