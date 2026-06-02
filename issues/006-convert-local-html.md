# 006 - Convert Local HTML Files To Markdown

Status: Done
Type: AFK
Labels: feature/convert, area/html

## What to build

Extend `llmwiki convert` to process local `.html` and `.htm` files into
Markdown. The conversion should reuse the project's existing HTML-to-Markdown
approach where practical, while keeping local-file behavior independent from
remote URL ingestion.

## Acceptance criteria

- [ ] `.html` and `.htm` files are discovered recursively by `llmwiki convert`.
- [ ] Local HTML files are converted into readable Markdown in the flattened output folder.
- [ ] Output includes source metadata for the original local path.
- [ ] Invalid or unreadable HTML is reported as a failed conversion.
- [ ] Tests cover local HTML conversion and invalid HTML handling.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through

## Implementation notes

Local `.html` and `.htm` files are converted with Readability and Turndown.
Automated tests cover local HTML conversion.
