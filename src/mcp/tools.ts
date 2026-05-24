/**
 * MCP tool registrations for llmwiki.
 *
 * Each tool wraps an existing pipeline function (ingest, compile, query,
 * search, read, lint, status) and converts its structured result into
 * an MCP CallToolResult. Tools that need an LLM provider validate the
 * provider lazily — the server itself starts without credentials so
 * read-only tools always work.
 */

import path from "path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ingestSource } from "../commands/ingest.js";
import { compileAndReport } from "../compiler/index.js";
import { generateAnswer, selectPages } from "../commands/query.js";
import { lint } from "../linter/index.js";
import { collectPageSummaries, scanWikiPages } from "../compiler/indexgen.js";
import { detectChanges } from "../compiler/hasher.js";
import { countCandidates } from "../compiler/candidates.js";
import { readState } from "../utils/state.js";
import { safeReadFile, parseFrontmatter } from "../utils/markdown.js";
import { findRelevantChunks, findRelevantPages } from "../utils/embeddings.js";
import {
  CONCEPTS_DIR,
  INDEX_FILE,
  QUERIES_DIR,
  CHUNK_TOP_K,
} from "../utils/constants.js";
import { ensureProviderAvailable } from "./provider-check.js";

/** Directories searched (in priority order) when resolving a page slug. */
const PAGE_DIRS = [CONCEPTS_DIR, QUERIES_DIR];

/** Shape returned by search_pages for each matching page. */
interface PageRecord {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

/**
 * Wrap an arbitrary JSON value as the standard MCP CallToolResult.
 * MCP requires content blocks even for structured payloads, so we mirror
 * the JSON in a text block for clients that don't read structuredContent.
 */
function jsonResult(payload: unknown): {
  content: Array<{ type: "text"; text: string }>;
  structuredContent: { result: unknown };
} {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    structuredContent: { result: payload },
  };
}

/** Register all 7 wiki tools on the given MCP server instance. */
export function registerWikiTools(server: McpServer, root: string, projectId?: string): void {
  registerIngestTool(server, root, projectId);
  registerCompileTool(server, root, projectId);
  registerQueryTool(server, root, projectId);
  registerSearchTool(server, root, projectId);
  registerReadTool(server, root, projectId);
  registerLintTool(server, root, projectId);
  registerStatusTool(server, root, projectId);
}

function registerIngestTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "ingest_source",
    {
      title: "Ingest Source",
      description:
        "Fetch a URL or copy a local file into sources/. Returns the saved filename, " +
        "character count, and whether content was truncated to fit the size limit.",
      inputSchema: {
        source: z
          .string()
          .describe("URL (http/https) or absolute path to a .md/.txt file"),
      },
    },
    async ({ source }) => {
      const previousCwd = process.cwd();
      try {
        process.chdir(root);
        const { paths } = await getProjectPaths(root, projectId);
        const result = await ingestSource(source, paths.sourcesDir);
        return jsonResult(result);
      } finally {
        process.chdir(previousCwd);
      }
    },
  );
}

function registerCompileTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "compile_wiki",
    {
      title: "Compile Wiki",
      description:
        "Run the incremental compile pipeline: extract concepts from new/changed " +
        "sources, generate wiki pages, resolve interlinks, and rebuild the index. " +
        "Requires an LLM provider with credentials.",
      inputSchema: {},
    },
    async () => {
      ensureProviderAvailable();
      // Get project ID to pass to compile (use specified project or active project)
      const { getActiveProject } = await import("../utils/project-config.js");
      const effectiveProjectId = projectId || (await getActiveProject(root)).id;
      const result = await compileAndReport(root, { projectId: effectiveProjectId });
      return jsonResult(result);
    },
  );
}

function registerQueryTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "query_wiki",
    {
      title: "Query Wiki",
      description:
        "Ask a natural-language question. Selects relevant pages with the LLM, " +
        "loads them, and returns a grounded answer with citations. Set save=true " +
        "to persist the answer as a wiki page. Set debug=true to include the " +
        "selected chunks and their scores. Requires an LLM provider.",
      inputSchema: {
        question: z.string().describe("The natural-language question to answer."),
        save: z
          .boolean()
          .optional()
          .describe("Persist the answer as a wiki/queries/ page when true."),
        debug: z
          .boolean()
          .optional()
          .describe("Include retrieval debug info (selected chunks/pages + scores)."),
      },
    },
    async ({ question, save, debug }) => {
      ensureProviderAvailable();
      const result = await generateAnswer(root, question, { save, debug });
      return jsonResult(result);
    },
  );
}

/**
 * Helper function to resolve project paths.
 * Returns the project configuration and resolved paths.
 */
async function getProjectPaths(root: string, projectId?: string) {
  const { getActiveProject, getProjectById, resolveProjectPaths } = await import("../utils/project-config.js");
  const project = projectId
    ? await getProjectById(root, projectId)
    : await getActiveProject(root);
  const paths = resolveProjectPaths(root, project);
  return { project, paths };
}

function registerSearchTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "search_pages",
    {
      title: "Search Pages",
      description:
        "Select pages relevant to a question and return their full content. " +
        "Uses semantic embeddings when available, falling back to LLM-based " +
        "selection over the wiki index. Requires an LLM provider.",
      inputSchema: {
        question: z.string().describe("The query used to rank pages."),
      },
    },
    async ({ question }) => {
      ensureProviderAvailable();
      const slugs = await pickSearchSlugs(root, question, projectId);
      const records = await loadPageRecords(root, slugs, projectId);
      return jsonResult({ pages: records });
    },
  );
}

/**
 * Resolve search candidates. Tries chunk-level retrieval first (highest
 * precision), then falls back to page-level embeddings, then to LLM-driven
 * selection over the wiki index.
 */
async function pickSearchSlugs(root: string, question: string, projectId?: string): Promise<string[]> {
  const { paths } = await getProjectPaths(root, projectId);
  const wikiDir = path.join(root, paths.wikiDir);

  try {
    const chunks = await findRelevantChunks(root, question, CHUNK_TOP_K);
    if (chunks.length > 0) return dedupePreservingOrder(chunks.map((c) => c.chunk.slug));
  } catch {
    // Chunk store unavailable — fall through to page-level embeddings.
  }

  try {
    const candidates = await findRelevantPages(root, question);
    if (candidates.length > 0) return candidates.map((c) => c.slug);
  } catch {
    // Embeddings unavailable — fall through to index-based selection.
  }

  const indexContent = await safeReadFile(path.join(wikiDir, "index.md"));
  const { pages } = await selectPages(question, indexContent);
  return pages;
}

/** Deduplicate slugs while preserving the first-seen ordering. */
function dedupePreservingOrder(slugs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
  }
  return out;
}

function registerReadTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "read_page",
    {
      title: "Read Page",
      description:
        "Read a single wiki page by slug. Searches concepts/ first, then queries/. " +
        "Returns the parsed frontmatter and body. No LLM call required.",
      inputSchema: {
        slug: z.string().describe("Page slug, without .md extension."),
      },
    },
    async ({ slug }) => {
      const page = await readPage(root, slug, projectId);
      if (!page) {
        throw new Error(`Page not found: ${slug}`);
      }
      return jsonResult(page);
    },
  );
}

function registerLintTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "lint_wiki",
    {
      title: "Lint Wiki",
      description:
        "Run rule-based quality checks (broken wikilinks, orphans, duplicates, " +
        "empty pages, broken citations). Returns structured diagnostics. No LLM call.",
      inputSchema: {},
    },
    async () => {
      const summary = await lint(root);
      return jsonResult(summary);
    },
  );
}

function registerStatusTool(server: McpServer, root: string, projectId?: string): void {
  server.registerTool(
    "wiki_status",
    {
      title: "Wiki Status",
      description:
        "Summarize the wiki: page count, source count, last compile time, " +
        "orphaned pages, and pending source changes. Read-only — never " +
        "modifies the workspace.",
      inputSchema: {},
    },
    async () => jsonResult(await collectStatus(root, projectId)),
  );
}

/** Read-only status snapshot used by the wiki_status tool. */
async function collectStatus(root: string, projectId?: string): Promise<WikiStatus> {
  const { paths } = await getProjectPaths(root, projectId);

  const conceptsDir = path.join(root, paths.conceptsDir);
  const queriesDir = path.join(root, paths.queriesDir);
  const sourcesDir = path.join(root, paths.sourcesDir);

  const concepts = await collectPageSummaries(conceptsDir);
  const queries = await collectPageSummaries(queriesDir);
  const state = await readState(root);
  const changes = await detectChanges(root, state, sourcesDir);
  const orphans = await findOrphanedSlugs(root, projectId);
  const pendingCandidates = await countCandidates(root);
  const compileTimes = Object.values(state.sources).map((s) => s.compiledAt);
  const lastCompile = compileTimes.length > 0
    ? compileTimes.sort().slice(-1)[0]
    : null;

  return {
    pages: { concepts: concepts.length, queries: queries.length, total: concepts.length + queries.length },
    sources: Object.keys(state.sources).length,
    lastCompiledAt: lastCompile,
    orphanedPages: orphans,
    pendingCandidates,
    pendingChanges: changes
      .filter((c) => c.status !== "unchanged")
      .map((c) => ({ file: c.file, status: c.status })),
  };
}

interface WikiStatus {
  pages: { concepts: number; queries: number; total: number };
  sources: number;
  lastCompiledAt: string | null;
  orphanedPages: string[];
  /** Number of compile candidates awaiting human review. */
  pendingCandidates: number;
  pendingChanges: Array<{ file: string; status: string }>;
}

/** Find concept slugs whose pages are flagged as orphaned. */
async function findOrphanedSlugs(root: string, projectId?: string): Promise<string[]> {
  const { paths } = await getProjectPaths(root, projectId);
  const conceptsDir = path.join(root, paths.conceptsDir);
  const scanned = await scanWikiPages(conceptsDir);
  return scanned.filter(({ meta }) => meta.orphaned).map(({ slug }) => slug);
}

/** Load full content for a list of slugs, skipping missing/orphaned pages. */
async function loadPageRecords(root: string, slugs: string[], projectId?: string): Promise<PageRecord[]> {
  const records: PageRecord[] = [];
  for (const slug of slugs) {
    const page = await readPage(root, slug, projectId);
    if (page) records.push(page);
  }
  return records;
}

/**
 * Locate a page by slug across the priority-ordered page directories,
 * skipping orphaned entries to match the query pipeline's behaviour.
 */
export async function readPage(root: string, slug: string, projectId?: string): Promise<PageRecord | null> {
  const { paths } = await getProjectPaths(root, projectId);

  const pageDirs = [
    path.join(root, paths.conceptsDir),
    path.join(root, paths.queriesDir),
  ];

  for (const dir of pageDirs) {
    const content = await safeReadFile(path.join(dir, `${slug}.md`));
    if (!content) continue;

    const { meta, body } = parseFrontmatter(content);
    if (meta.orphaned) continue;

    return {
      slug,
      title: typeof meta.title === "string" ? meta.title : slug,
      summary: typeof meta.summary === "string" ? meta.summary : "",
      body: body.trim(),
    };
  }
  return null;
}

