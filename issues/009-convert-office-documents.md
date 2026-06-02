# 009 - Convert Office Documents To Markdown

Status: Open
Type: AFK
Labels: feature/convert, area/file-types

## What to build

Add a complete `llmwiki convert` path for common document files such as `.docx`
and `.pptx`. The converted Markdown should preserve readable text, headings
where possible, slide/page boundaries where useful, and source metadata.

## Acceptance criteria

- [ ] `.docx` files are discovered and converted to Markdown.
- [ ] `.pptx` files are discovered and converted to Markdown.
- [ ] Output files remain flattened into the configured output folder.
- [ ] Empty or unreadable documents are reported as failures.
- [ ] Conversion failures make the command exit non-zero while preserving successful outputs.
- [ ] Tests cover successful `.docx`, successful `.pptx`, and unreadable document failures.

## Blocked by

- 008 - Add Text-Like File Coverage To `llmwiki convert`
