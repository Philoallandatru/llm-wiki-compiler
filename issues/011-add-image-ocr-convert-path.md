# 011 - Add Image OCR Conversion Path

Status: Done
Type: HITL
Labels: feature/convert, area/ocr

## What to build

Decide and implement an OCR path for image files in `llmwiki convert`, covering
formats such as `.png`, `.jpg`, `.jpeg`, and `.webp`. The output should be
Markdown with source metadata and clear failure reporting when no text can be
extracted.

## Acceptance criteria

- [x] The OCR backend decision is documented: local OCR, LLM vision, or both.
- [x] Supported image extensions are discovered recursively.
- [x] OCR text is written as Markdown in the flattened output folder.
- [x] No-text and unreadable image cases are reported as failures.
- [x] Credential or runtime requirements are documented in the user guide.
- [x] Tests cover success, no-text image, and missing-backend failure behavior.

## Blocked by

- 008 - Add Text-Like File Coverage To `llmwiki convert`
