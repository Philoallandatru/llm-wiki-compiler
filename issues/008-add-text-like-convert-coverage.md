# 008 - Add Text-Like File Coverage To `llmwiki convert`

Status: Open
Type: AFK
Labels: feature/convert, area/file-types

## What to build

Expand `llmwiki convert` beyond the current `.md`, `.txt`, `.pdf`, `.html`, and
`.htm` coverage by adding a complete path for common text-like local files such
as source code, config files, JSON, YAML, XML, and log files. Output should be
Markdown-safe and preserve the original content in a readable form.

## Acceptance criteria

- [ ] Common source/config/log extensions are discovered recursively.
- [ ] Converted output is written as flattened Markdown files in the output folder.
- [ ] Source metadata records the original local path and source type.
- [ ] Code-like content is wrapped or escaped so Markdown rendering does not alter it.
- [ ] Unsupported binary-looking files are skipped or failed with clear reporting.
- [ ] Tests cover at least source code, JSON/YAML, and extensionless text-like files.

## Blocked by

None - can start immediately.
