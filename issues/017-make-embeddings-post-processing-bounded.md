# 017 - Make Embeddings Post-Processing Bounded

Status: Done
Type: AFK
Labels: area/compile, area/batch-compile, area/embeddings, area/reliability

## What to build

Make the embeddings refresh step after `compile` and `batch-compile` bounded
and user-controllable. Wiki pages can already be generated successfully before
embeddings update runs, but a slow or hanging embeddings endpoint can make the
overall command appear stuck after the important compile output has landed.

The command should still treat embeddings as a non-critical enhancement, while
giving users a clear way to skip it or fail it quickly.

## Acceptance criteria

- [ ] Add a CLI option or environment variable to skip embeddings refresh during `compile`.
- [ ] Ensure `batch-compile` forwards the skip option to each compile step.
- [ ] Add an embeddings-specific timeout that can be shorter than the main LLM generation timeout.
- [ ] When embeddings are skipped or time out, the command reports a clear non-fatal warning.
- [ ] Successful page generation, index generation, state updates, and extraction cache writes are not blocked by slow embeddings.
- [ ] Tests cover skipped embeddings, embeddings timeout/failure, and normal embeddings success.
- [ ] User documentation explains when and why to disable embeddings.

## Blocked by

None - can start immediately.
