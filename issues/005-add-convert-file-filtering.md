# 005 - Add Convert File Filtering And Plan Summary

Status: Done
Type: AFK
Labels: feature/convert, area/cli

## What to build

Add file filtering controls and a clear pre-conversion plan summary to
`llmwiki convert`. Users should be able to include or exclude file extensions
and skip noisy directories while seeing exactly what will be converted before
work begins.

## Acceptance criteria

- [ ] `llmwiki convert` supports `--include <extensions>` and `--exclude <patterns>`.
- [ ] Common noisy directories are skipped by default, including `node_modules`, `dist`, `.git`, and output folders.
- [ ] The command prints a plan summary grouped by file type before converting.
- [ ] Unsupported files are reported as skipped rather than silently ignored.
- [ ] Filtering applies before conversion and before chunking.
- [ ] Tests cover include filters, exclude filters, default ignored directories, and unsupported file reporting.

## Blocked by

- 001 - Add `llmwiki convert` With Markdown Pass-Through

## Implementation notes

Implemented `--include`, `--exclude`, default generated-directory skips, skipped
file reporting, and a preflight conversion plan grouped by extension.
