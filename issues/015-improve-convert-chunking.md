# 015 - Improve Convert Chunking

Status: Done
Type: AFK
Labels: feature/convert, area/chunking

## What to build

Improve `llmwiki convert` chunking so long Markdown and converted documents split
on semantic boundaries before falling back to paragraph or hard character cuts.
The goal is to make chunks more useful for later `batch-compile` and retrieval.

## Acceptance criteria

- [x] Chunking prefers heading sections before paragraph boundaries.
- [x] Existing frontmatter handling remains safe and does not duplicate metadata.
- [x] Chunk metadata records part numbers and total parts.
- [x] Oversized single sections still split safely.
- [x] Tests cover heading-aware chunking, paragraph fallback, and hard-split fallback.
- [x] Documentation describes the chunking behavior at a user level.

## Blocked by

None - can start immediately.
