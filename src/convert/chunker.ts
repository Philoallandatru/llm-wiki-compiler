/**
 * Markdown chunking for long converted documents.
 *
 * The splitter keeps Markdown heading sections together when possible, falls
 * back to paragraph and line boundaries for oversized sections, and only uses
 * hard slices when a single block is longer than the configured limit.
 */

/** Split a Markdown body into chunks no longer than chunkSize when possible. */
export function chunkMarkdown(body: string, chunkSize: number): string[] {
  const trimmed = body.trim();
  if (trimmed.length <= chunkSize) return [trimmed];

  const chunks = packBlocks(splitHeadingSections(trimmed), chunkSize);
  return chunks.flatMap((chunk) => splitOversizedChunk(chunk, chunkSize));
}

/** Split Markdown into top-level-ish sections starting at ATX headings. */
function splitHeadingSections(body: string): string[] {
  const sections: string[] = [];
  let current: string[] = [];
  let insideFence = false;
  for (const line of body.split(/\r?\n/)) {
    const startsHeadingSection = !insideFence && isHeading(line) && current.length > 0;
    if (startsHeadingSection) {
      sections.push(current.join("\n").trim());
      current = [];
    }
    current.push(line);
    if (isFence(line)) insideFence = !insideFence;
  }
  if (current.length > 0) sections.push(current.join("\n").trim());
  return sections.filter((section) => section.length > 0);
}

/** Group blocks into chunks without splitting any individual block. */
function packBlocks(blocks: string[], chunkSize: number, separator = "\n\n"): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const block of blocks) {
    current = appendBlockOrFlush(block, current, chunkSize, chunks, separator);
  }
  if (current.trim().length > 0) chunks.push(current.trim());
  return chunks;
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
  separator: string,
): string {
  if (current.length === 0) return block;
  const next = `${current}${separator}${block}`;
  if (next.length <= chunkSize) return next;
  chunks.push(current.trim());
  return block;
}

/** Hard-split any single block that still exceeds the configured size. */
function splitOversizedChunk(chunk: string, chunkSize: number): string[] {
  if (chunk.length <= chunkSize) return [chunk];
  const paragraphChunks = packBlocks(splitParagraphs(chunk), chunkSize);
  return paragraphChunks.flatMap((paragraphChunk) => splitOversizedLines(paragraphChunk, chunkSize));
}

/** Split oversized paragraph chunks by line before hard-splitting. */
function splitOversizedLines(chunk: string, chunkSize: number): string[] {
  if (chunk.length <= chunkSize) return [chunk];
  const lineChunks = packBlocks(splitLines(chunk), chunkSize, "\n");
  return lineChunks.flatMap((lineChunk) => hardSplitChunk(lineChunk, chunkSize));
}

/** Hard-split text that has no usable semantic boundary under the size limit. */
function hardSplitChunk(chunk: string, chunkSize: number): string[] {
  if (chunk.length <= chunkSize) return [chunk];
  const pieces: string[] = [];
  for (let offset = 0; offset < chunk.length; offset += chunkSize) {
    pieces.push(chunk.slice(offset, offset + chunkSize).trim());
  }
  return pieces.filter((piece) => piece.length > 0);
}

/** True for Markdown ATX headings outside fenced code blocks. */
function isHeading(line: string): boolean {
  return /^#{1,6}\s+\S/.test(line);
}

/** True for Markdown fenced-code delimiters. */
function isFence(line: string): boolean {
  return /^\s*(```|~~~)/.test(line);
}

/** Split text into non-empty lines for table/code-friendly fallback chunking. */
function splitLines(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}
