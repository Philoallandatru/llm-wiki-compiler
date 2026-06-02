# 014 - Refactor CLI Command Registration

Status: Open
Type: AFK
Labels: area/cli, area/refactor

## What to build

Refactor the CLI entrypoint so command registration is split into smaller
registrar modules. The behavior and help output should remain unchanged, but
the entrypoint should satisfy the repository's file-size guideline and be
easier to extend.

## Acceptance criteria

- [ ] The CLI entrypoint is below the repository file-size guideline.
- [ ] Command registration is grouped into focused modules.
- [ ] Existing command help output remains stable.
- [ ] Provider credential checks keep the same behavior.
- [ ] Tests cover top-level help and representative subcommand help.
- [ ] No command behavior changes outside the refactor.

## Blocked by

None - can start immediately.
