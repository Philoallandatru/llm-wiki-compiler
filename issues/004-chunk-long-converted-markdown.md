# 004 - Chunk Long Converted Markdown Files

Status: Done
Type: AFK
Labels: feature/convert, area/chunking

## What to build

Add automatic chunking for converted Markdown files that exceed a configurable
character budget. Chunking should apply to both original long Markdown files and
Markdown produced from converted non-Markdown inputs such as PDFs. Chunks are
written into the same flattened output folder as `name.part-001.md`,
`name.part-002.md`, and so on.

## Acceptance criteria

- [ ] `llmwiki convert` supports `--chunk-size <chars>`.
- [ ] Files longer than the chunk size are split into multiple `.part-NNN.md` files.
- [ ] Chunking prefers heading and paragraph boundaries before hard character cuts.
- [ ] Each chunk retains source metadata and part metadata.
- [ ] Files shorter than the chunk size are not split.
- [ ] Tests cover Markdown chunking, PDF-produced Markdown chunking, and boundary behavior.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through
- 003 - Convert PDFs With PyMuPDF

## Implementation notes

Long converted bodies are split into `.part-NNN.md` files with part metadata.
Automated tests cover long text chunking.
