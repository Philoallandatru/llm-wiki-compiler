# 008 - Add Text-Like File Coverage To `llmwiki convert`

Status: Done
Type: AFK
Labels: feature/convert, area/file-types

## What to build

Expand `llmwiki convert` beyond the current `.md`, `.txt`, `.pdf`, `.html`, and
`.htm` coverage by adding a complete path for common text-like local files such
as source code, config files, JSON, YAML, XML, and log files. Output should be
Markdown-safe and preserve the original content in a readable form.

## Acceptance criteria

- [x] Common source/config/log extensions are discovered recursively.
- [x] Converted output is written as flattened Markdown files in the output folder.
- [x] Source metadata records the original local path and source type.
- [x] Code-like content is wrapped or escaped so Markdown rendering does not alter it.
- [x] Unsupported binary-looking files are skipped or failed with clear reporting.
- [x] Tests cover at least source code, JSON/YAML, and extensionless text-like files.

## Blocked by

None - can start immediately.
