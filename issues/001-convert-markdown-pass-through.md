# 001 - Add `llmwiki convert` With Markdown Pass-Through

Status: Done
Type: AFK
Labels: feature/convert, area/cli

## What to build

Add a new `llmwiki convert <folder> --out <folder>` command that recursively
scans an input folder and writes converted Markdown files into a separate output
folder. The first supported path is Markdown pass-through: `.md` files are
copied into the output folder as Markdown. Output files are flattened into the
top level of the output folder, with collision-safe filenames.

## Acceptance criteria

- [ ] `llmwiki convert <folder> --out <folder>` appears in CLI help and validates both paths.
- [ ] The command recursively finds `.md` files under nested input folders.
- [ ] Converted files are written only to the output folder, never to `sources/`.
- [ ] Output files are flattened into the output folder top level.
- [ ] Filename collisions are resolved deterministically without overwriting files.
- [ ] The command prints a conversion summary with scanned, written, skipped, and failed counts.
- [ ] Tests cover nested input folders, output folder creation, and filename collisions.

## Blocked by

None - can start immediately.

## Implementation notes

Implemented by `src/commands/convert.ts` and `src/convert/*`. Covered by
`test/convert-command.test.ts`.
