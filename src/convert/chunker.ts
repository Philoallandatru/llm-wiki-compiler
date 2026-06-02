/**
 * Markdown chunking for long converted documents.
 *
 * The splitter prefers paragraph boundaries, then falls back to hard slices
 * only when a single paragraph is longer than the configured limit.
 */

/** Split a Markdown body into chunks no longer than chunkSize when possible. */
export function chunkMarkdown(body: string, chunkSize: number): string[] {
  const trimmed = body.trim();
  if (trimmed.length <= chunkSize) return [trimmed];

  const chunks: string[] = [];
  let current = "";
  for (const block of splitParagraphs(trimmed)) {
    current = appendBlockOrFlush(block, current, chunkSize, chunks);
  }
  if (current.trim().length > 0) chunks.push(current.trim());
  return chunks.flatMap((chunk) => splitOversizedChunk(chunk, chunkSize));
}

/** Split text into paragraph-like blocks while preserving readable spacing. */
function splitParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

/** Append a block to the current chunk, flushing when it would exceed the limit. */
function appendBlockOrFlush(
  block: string,
  current: string,
  chunkSize: number,
  chunks: string[],
): string {
  if (current.length === 0) return block;
  const next = `${current}\n\n${block}`;
  if (next.length <= chunkSize) return next;
  chunks.push(current.trim());
  return block;
}

/** Hard-split any single block that still exceeds the configured size. */
function splitOversizedChunk(chunk: string, chunkSize: number): string[] {
  if (chunk.length <= chunkSize) return [chunk];
  const pieces: string[] = [];
  for (let offset = 0; offset < chunk.length; offset += chunkSize) {
    pieces.push(chunk.slice(offset, offset + chunkSize).trim());
  }
  return pieces.filter((piece) => piece.length > 0);
}
