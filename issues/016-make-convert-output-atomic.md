# 016 - Make Convert Output Atomic

Status: Open
Type: AFK
Labels: feature/convert, area/reliability

## What to build

Make `llmwiki convert` write to a temporary output location and publish the final
output only after all conversions succeed. This prevents users from accidentally
running `batch-compile` on partial output when they miss a non-zero exit code.

## Acceptance criteria

- [ ] Conversion writes to a temporary folder first.
- [ ] Successful conversions atomically publish the final output folder.
- [ ] Failed conversions do not leave a final output folder that looks complete.
- [ ] Existing successful-output behavior remains easy to inspect.
- [ ] Partial failure behavior is documented.
- [ ] Tests cover success publish, failure cleanup, and existing-output conflict behavior.

## Blocked by

None - can start immediately.
