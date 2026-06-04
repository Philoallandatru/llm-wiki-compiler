/**
 * Unit coverage for convert-time Markdown chunking.
 *
 * The convert command depends on this splitter to keep generated Markdown
 * useful for later ingest, batch-compile, and retrieval. These tests exercise
 * the semantic boundary order directly: headings, paragraphs, then hard cuts.
 */

import { describe, expect, it } from "vitest";
import { chunkMarkdown } from "../src/convert/chunker.js";

describe("convert Markdown chunker", () => {
  it("prefers heading sections before paragraph boundaries", () => {
    const body = [
      "# Intro",
      "",
      "Short opening.",
      "",
      "## Alpha",
      "",
      "Alpha details stay together.",
      "",
      "## Beta",
      "",
      "Beta details stay together.",
    ].join("\n");

    const chunks = chunkMarkdown(body, 50);

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toContain("# Intro");
    expect(chunks[1]).toContain("## Alpha");
    expect(chunks[1]).toContain("Alpha details stay together.");
    expect(chunks[2]).toContain("## Beta");
  });

  it("falls back to paragraph boundaries for oversized heading sections", () => {
    const body = ["# One Topic", "", "First paragraph is useful.", "", "Second paragraph is useful."].join(
      "\n",
    );

    const chunks = chunkMarkdown(body, 45);

    expect(chunks).toEqual(["# One Topic\n\nFirst paragraph is useful.", "Second paragraph is useful."]);
  });

  it("hard-splits oversized blocks when no semantic boundary fits", () => {
    const chunks = chunkMarkdown("x".repeat(95), 40);

    expect(chunks).toHaveLength(3);
    expect(chunks.every((chunk) => chunk.length <= 40)).toBe(true);
    expect(chunks.join("")).toHaveLength(95);
  });

  it("does not treat headings inside fenced code as section boundaries", () => {
    const body = ["# Real", "", "```", "# Not a heading", "```", "", "## Next", "", "Next text."].join(
      "\n",
    );

    const chunks = chunkMarkdown(body, 45);

    expect(chunks[0]).toContain("# Not a heading");
    expect(chunks[1]).toContain("## Next");
  });
});
