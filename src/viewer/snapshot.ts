/**
 * Build the frozen-at-startup `ViewerSnapshot` consumed by every viewer
 * endpoint. Every count, page list, and index payload that the HTTP
 * layer needs is captured here exactly once — v1 deliberately does not
 * live-watch the filesystem, so post-startup mutations are intentionally
 * invisible to the running viewer until it restarts.
 *
 * The snapshot consolidates four data sources:
 *   - `collectViewerPages` for the decorated page list AND the
 *     concept/query counts (deriving counts from the already-confined
 *     page list means symlinked entries dropped by the collector
 *     cannot quietly inflate the counts via a second unconfined scan)
 *   - `readState` for the compiled-source count
 *   - `countCandidates` for the pending-reviews count
 *   - `readdir(sources/)` for the cheap source-file count
 */

import { lstat, readdir, readFile } from "fs/promises";
import path from "path";
import { SOURCES_DIR } from "../utils/constants.js";
import { countCandidates } from "../compiler/candidates.js";
import { readState } from "../utils/state.js";
import { collectViewerPages, resolveBareSlugList } from "./collect.js";
import { extractWikilinkSlugs } from "../wiki/collect.js";
import { isMalformedCitationEntry } from "../utils/markdown.js";
import { buildGraphData } from "./graph.js";
import type {
  ViewerCounts,
  ViewerIndex,
  ViewerPage,
  ViewerProject,
  ViewerRecentPage,
  ViewerSnapshot,
  ViewerWarning,
} from "./types.js";

const RECENT_PAGES_LIMIT = 8;
const INDEX_HREF = "/#/index";

/** Inputs that are already collected and ready to become a viewer snapshot. */
interface SnapshotParts {
  root: string;
  project: ViewerProject;
  pages: ViewerPage[];
  stateSources: Record<string, unknown>;
  pendingReviews: number;
  sourceFilenames: string[];
  index: { available: boolean; body: string };
}

/**
 * Build the immutable startup snapshot for a project root. Reads pages,
 * counts, source state, candidates, and the optional `wiki/index.md`
 * exactly once and returns a fully populated `ViewerSnapshot`. Callers
 * must NOT re-derive any of these from disk on a per-request path —
 * `readLintCache` in `src/viewer/health.ts` is the sole exception.
 */
export async function buildViewerSnapshot(root: string): Promise<ViewerSnapshot> {
  const sourcesDir = path.join(root, SOURCES_DIR);
  const wikiDir = path.join(root, "wiki");

  const [pages, state, pendingReviews, sourceFilenames, index] = await Promise.all([
    collectViewerPages(root),
    readState(root),
    countCandidates(root),
    listSourceFiles(sourcesDir),
    readIndexFile(wikiDir),
  ]);
  return assembleSnapshot({
    root,
    project: buildProject(root),
    pages,
    stateSources: state.sources,
    pendingReviews,
    sourceFilenames,
    index,
  });
}

/** Assemble collected page, state, and index records into a snapshot. */
function assembleSnapshot(parts: SnapshotParts): ViewerSnapshot {
  // Concept/query counts are derived from `pages`, the already-confined
  // viewer page list, NOT from a second unconfined directory scan.
  // Anything the collector dropped for path-safety reasons (symlinked
  // file or directory) is therefore also excluded from the counts.
  const counts: ViewerCounts = {
    concepts: parts.pages.filter((p) => p.pageDirectory === "concepts").length,
    queries: parts.pages.filter((p) => p.pageDirectory === "queries").length,
    sourceFiles: parts.sourceFilenames.length,
    pendingReviews: parts.pendingReviews,
    compiledSources: Object.keys(parts.stateSources).length,
  };
  const fullIndex: ViewerIndex = {
    available: parts.index.available,
    href: INDEX_HREF,
    body: parts.index.body,
    outgoingLinks: resolveBareSlugList(extractWikilinkSlugs(parts.index.body), parts.pages),
  };
  const sourceFileSet = new Set(parts.sourceFilenames);
  const annotatedPages = parts.pages.map((page) => annotateCitationWarnings(page, sourceFileSet));
  const graph = buildGraphData(annotatedPages);
  return {
    root: parts.root,
    generatedAt: new Date().toISOString(),
    project: parts.project,
    counts,
    index: fullIndex,
    recentPages: buildRecentPages(annotatedPages),
    pages: annotatedPages,
    sourceFilenames: parts.sourceFilenames,
    graph,
  };
}

/**
 * Append `unresolved_citation` and `malformed_citation` warnings to a
 * page based on its parsed citations and the project's source-file
 * list. Slice 1 only produced parser-level warnings; citation
 * resolvability needs the snapshot's source-file list, so this is the
 * earliest layer that can decide.
 *
 * The body is re-scanned for raw `^[…]` markers (rather than iterating
 * `page.citations`) because `extractClaimCitations` drops citations
 * whose ONLY entry has an invalid line range — but those still need a
 * `malformed_citation` warning. Scanning the body gives every marker a
 * chance to be classified.
 */
function annotateCitationWarnings(page: ViewerPage, sourceFiles: ReadonlySet<string>): ViewerPage {
  const extra: ViewerWarning[] = [];
  const markerPattern = /\^\[([^\]\n]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = markerPattern.exec(page.body)) !== null) {
    appendCitationWarningsForMarker(match[1], sourceFiles, extra);
  }
  if (extra.length === 0) return page;
  return { ...page, warnings: [...page.warnings, ...extra] };
}

/** Classify every comma-separated entry inside one `^[…]` marker. */
function appendCitationWarningsForMarker(
  raw: string,
  sourceFiles: ReadonlySet<string>,
  into: ViewerWarning[],
): void {
  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (trimmed.length === 0) continue;
    if (isMalformedCitationEntry(trimmed)) {
      into.push({
        code: "malformed_citation",
        message: `Malformed citation entry: ${trimmed}`,
      });
      continue;
    }
    const file = trimmed.split(/[:#]/)[0];
    if (file.length > 0 && !sourceFiles.has(file)) {
      into.push({
        code: "unresolved_citation",
        message: `Source not found: ${file}`,
      });
    }
  }
}


/** Project title and bare directory name for the dashboard header. */
function buildProject(root: string): ViewerProject {
  const rootName = path.basename(root);
  return {
    id: "default",
    title: rootName,
    rootName,
    sourcesDir: SOURCES_DIR,
    wikiDir: "wiki",
  };
}

/**
 * List filenames directly under a sources directory. Returns an empty array when
 * the directory is missing. The Slice 4 citation renderer uses this list
 * to mark each chip `data-resolved` without per-request directory scans;
 * `counts.sourceFiles` is the cheap `.length` of the same list.
 *
 * Stricter than "stays under project root": `realpath(sourcesDir)`
 * must equal the literal canonical path. A symlinked sources directory —
 * even pointing in-root — returns an empty list, matching the same
 * containment posture the wiki collector uses for `wiki/concepts/` and
 * `wiki/queries/`. Symlinked entries inside the directory are excluded
 * by `Dirent.isFile()` (which returns false for symlinks since
 * `withFileTypes` does not follow them).
 *
 * @param sourcesDir - Absolute path to sources directory
 */
async function listSourceFiles(sourcesDir: string): Promise<string[]> {
  if (await isSymlink(sourcesDir)) {
    return [];
  }

  try {
    const entries = await readdir(sourcesDir, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch {
    return [];
  }
}

/**
 * Read `wiki/index.md` if present. Missing index is not an error: many
 * projects compile without an index page, and the viewer renders an
 * "index unavailable" placeholder for the `/#/index` route.
 *
 * Stricter than "stays under project root": `realpath(wikiDir/index.md)`
 * must equal the literal canonical path. A symlinked `index.md` is
 * treated as unavailable, even when the link target also lives inside
 * the project — pointing the index at (say) `<root>/README.md` would
 * let the index endpoint render content that has no business being the
 * project's compiled index. A symlinked wiki directory is dropped by
 * the same equality check.
 *
 * @param wikiDir - Absolute path to wiki directory
 */
async function readIndexFile(wikiDir: string): Promise<{ available: boolean; body: string }> {
  const expectedIndex = path.join(wikiDir, "index.md");
  if ((await isSymlink(wikiDir)) || (await isSymlink(expectedIndex))) {
    return { available: false, body: "" };
  }

  try {
    const body = await readFile(expectedIndex, "utf-8");
    return { available: true, body };
  } catch {
    return { available: false, body: "" };
  }
}

/** Return true for symbolic links and false for missing or regular paths. */
async function isSymlink(filePath: string): Promise<boolean> {
  try {
    return (await lstat(filePath)).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Top-N recently updated pages for the dashboard. Pages without an
 * `updatedAt` frontmatter field sort to the end with an empty string so
 * the list remains deterministic.
 */
function buildRecentPages(pages: ViewerPage[]): ViewerRecentPage[] {
  const rows: ViewerRecentPage[] = pages.map((page) => ({
    id: page.id,
    pageDirectory: page.pageDirectory,
    slug: page.slug,
    title: page.title,
    updatedAt:
      typeof page.frontmatter.updatedAt === "string" ? (page.frontmatter.updatedAt as string) : "",
  }));
  rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return rows.slice(0, RECENT_PAGES_LIMIT);
}

/**
 * Build a snapshot for a specific project with custom paths.
 * Used by multi-project viewer to build snapshots for each project.
 */
async function buildProjectSnapshot(
  root: string,
  projectConfig: { id: string; name: string; description?: string; sourcesDir: string; wikiDir: string }
): Promise<ViewerSnapshot> {
  const sourcesDir = path.join(root, projectConfig.sourcesDir);
  const wikiDir = path.join(root, projectConfig.wikiDir);
  const llmwikiDir = path.join(root, ".llmwiki");

  const [pages, state, pendingReviews, sourceFilenames, index] = await Promise.all([
    collectViewerPages(wikiDir),
    readState(llmwikiDir),
    countCandidates(llmwikiDir),
    listSourceFiles(sourcesDir),
    readIndexFile(wikiDir),
  ]);

  const project: ViewerProject = {
    id: projectConfig.id,
    title: projectConfig.name,
    rootName: path.basename(root),
    description: projectConfig.description,
    sourcesDir: projectConfig.sourcesDir,
    wikiDir: projectConfig.wikiDir,
  };

  return assembleSnapshot({
    root,
    project,
    pages,
    stateSources: state.sources,
    pendingReviews,
    sourceFilenames,
    index,
  });
}

/**
 * Build a multi-project snapshot for viewing multiple projects.
 * @param root - Project root directory
 * @param projectIds - Optional array of project IDs to include (undefined = all projects)
 */
export async function buildMultiProjectSnapshot(
  root: string,
  projectIds?: string[]
): Promise<import("./types.js").MultiProjectSnapshot> {
  const { readProjectsConfig } = await import("../utils/project-config.js");
  const config = await readProjectsConfig(root);

  const targetProjects = projectIds
    ? projectIds.map((id) => config.projects[id]).filter(Boolean)
    : Object.values(config.projects);

  if (targetProjects.length === 0) {
    throw new Error("No projects found to display");
  }

  const snapshots: Record<string, ViewerSnapshot> = {};
  await Promise.all(
    targetProjects.map(async (project) => {
      snapshots[project.id] = await buildProjectSnapshot(root, project);
    })
  );

  return {
    root,
    generatedAt: new Date().toISOString(),
    mode: projectIds && projectIds.length === 1 ? "single" : "all",
    activeProjectId: projectIds?.[0],
    projects: targetProjects.map((p) => ({
      id: p.id,
      title: p.name,
      rootName: path.basename(root),
      description: p.description,
      sourcesDir: p.sourcesDir,
      wikiDir: p.wikiDir,
    })),
    snapshots,
  };
}
