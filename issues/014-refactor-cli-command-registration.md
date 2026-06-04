# 014 - Refactor CLI Command Registration

Status: Done
Type: AFK
Labels: area/cli, area/refactor

## What to build

Refactor the CLI entrypoint so command registration is split into smaller
registrar modules. The behavior and help output should remain unchanged, but
the entrypoint should satisfy the repository's file-size guideline and be
easier to extend.

## Acceptance criteria

- [x] The CLI entrypoint is below the repository file-size guideline.
- [x] Command registration is grouped into focused modules.
- [x] Existing command help output remains stable.
- [x] Provider credential checks keep the same behavior.
- [x] Tests cover top-level help and representative subcommand help.
- [x] No command behavior changes outside the refactor.

## Blocked by

None - can start immediately.
