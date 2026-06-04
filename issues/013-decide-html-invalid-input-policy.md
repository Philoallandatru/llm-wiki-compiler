# 013 - Decide And Enforce HTML Invalid-Input Policy

Status: Done
Type: HITL
Labels: feature/convert, area/html

## What to build

Decide whether local HTML conversion should remain permissive, accepting
malformed HTML that JSDOM can parse, or become strict and fail malformed or
low-signal HTML. Once decided, align implementation, documentation, and tests.

## Acceptance criteria

- [ ] The policy is documented: permissive parsing or strict validation.
- [ ] The implementation matches the documented policy.
- [ ] Empty HTML and no-readable-content HTML are covered by tests.
- [ ] Malformed-but-readable HTML behavior is covered by tests.
- [ ] User-facing docs explain when HTML conversion fails.
- [ ] Existing local HTML success behavior remains covered.

## Blocked by

None - can start immediately.
