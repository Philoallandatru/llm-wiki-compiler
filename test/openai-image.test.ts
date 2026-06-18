/**
 * OpenAI-compatible image helper tests.
 *
 * These tests mock the OpenAI SDK so image OCR support can verify request
 * shape, endpoint configuration, and credential validation without touching a
 * real custom gateway.
 */

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTempRoot } from "./fixtures/temp-root.js";

const openAIMock = vi.hoisted(() => {
  const create = vi.fn();
  const constructor = vi.fn(() => ({
    chat: { completions: { create } },
  }));
  return { create, constructor };
});

vi.mock("openai", () => ({
  default: openAIMock.constructor,
}));

const { runOpenAICompatibleImagePrompt } = await import("../src/vision/openai-image.js");

const root = useTempRoot();
const originalEnv = { ...process.env };

describe("OpenAI-compatible image helper", () => {
  beforeEach(() => {
    openAIMock.create.mockReset();
    openAIMock.constructor.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("sends image OCR requests to a custom OpenAI-compatible endpoint", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_BASE_URL = "http://localhost:8080/v1";
    process.env.LLMWIKI_MODEL = "vision-model";
    openAIMock.create.mockResolvedValue({
      choices: [{ message: { content: "Detected text" } }],
    });
    const imagePath = await seedImage("openai-compatible.png");

    const text = await runOpenAICompatibleImagePrompt(imagePath, "Read this image");

    expect(text).toBe("Detected text");
    expect(openAIMock.constructor).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "test-key",
        baseURL: "http://localhost:8080/v1",
      }),
    );
    expect(openAIMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "vision-model",
        messages: [
          expect.objectContaining({
            content: [
              { type: "text", text: "Read this image" },
              {
                type: "image_url",
                image_url: { url: expect.stringMatching(/^data:image\/png;base64,/) },
              },
            ],
          }),
        ],
      }),
    );
  });

  it("fails clearly when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const imagePath = await seedImage("missing-key.png");

    await expect(runOpenAICompatibleImagePrompt(imagePath, "Read this image")).rejects.toThrow(
      /OPENAI_API_KEY/,
    );
  });
});

/** Seed a minimal local PNG path for base64 request construction. */
async function seedImage(fileName: string): Promise<string> {
  const inputDir = path.join(root.dir, "openai-image");
  await mkdir(inputDir, { recursive: true });
  const imagePath = path.join(inputDir, fileName);
  await writeFile(imagePath, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  return imagePath;
}
