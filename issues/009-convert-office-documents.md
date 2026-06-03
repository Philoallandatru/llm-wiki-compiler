# 009 - Convert Office Documents To Markdown

Status: Done
Type: AFK
Labels: feature/convert, area/file-types

## What to build

Add a complete `llmwiki convert` path for common document files such as `.docx`
and `.pptx`. The converted Markdown should preserve readable text, headings
where possible, slide/page boundaries where useful, and source metadata.

## Acceptance criteria

- [x] `.docx` files are discovered and converted to Markdown.
- [x] `.pptx` files are discovered and converted to Markdown.
- [x] Output files remain flattened into the configured output folder.
- [x] Empty or unreadable documents are reported as failures.
- [x] Conversion failures make the command exit non-zero. Successful temp outputs are not published because issue 016 made convert output atomic.
- [x] Tests cover successful `.docx`, successful `.pptx`, and unreadable document failures.

## Blocked by

- 008 - Add Text-Like File Coverage To `llmwiki convert`
