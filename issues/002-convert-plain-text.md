# 002 - Convert Plain Text Files To Markdown

Status: Done
Type: AFK
Labels: feature/convert, area/ingest

## What to build

Extend `llmwiki convert` so local `.txt` files are converted to Markdown in the
same flattened output folder as Markdown pass-through files. Plain text output
should be readable as Markdown and include enough source metadata to trace it
back to the original file.

## Acceptance criteria

- [ ] `.txt` files are discovered recursively by `llmwiki convert`.
- [ ] Each `.txt` file is written as a `.md` file in the output folder top level.
- [ ] Converted Markdown includes source metadata for the original path.
- [ ] Empty or unreadable text files are reported as failures without stopping other files.
- [ ] The conversion summary reports text conversions separately from skipped files.
- [ ] Tests cover plain text conversion, nested text files, and unreadable/empty text handling.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through

## Implementation notes

Plain text conversion now writes Markdown with source metadata and empty text
files are reported as failed conversions.
