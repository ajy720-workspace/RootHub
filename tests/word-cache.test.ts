import { describe, expect, it, vi } from "vitest";
import { cacheWord, readCachedWord } from "@/lib/word-cache";
import type { WordAnalysis } from "@/types/word";

const cachedWord = {
  id: "word-id",
  targetWord: "reinforce",
  totalMeaning: "make stronger",
  etymologyStory: "re + force",
  relatedWords: ["fortify"],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  segments: [
    {
      id: "segment-id",
      wordId: "word-id",
      etymologyId: "ety-id",
      sequence: 0,
      customText: "re-",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      etymology: {
        id: "ety-id",
        type: "prefix",
        text: "re",
        meaning: "again",
        origin: "Latin re-",
        role: "adds repetition",
        family: ["return", "review"],
        createdAt: new Date("2026-01-01T00:00:00.000Z")
      }
    }
  ]
};

const analysis: WordAnalysis = {
  word: "reinforce",
  total_meaning: "make stronger",
  etymology_story: "re + force",
  analysis: [
    {
      type: "prefix",
      text: "re-",
      meaning: "again",
      origin: "Latin re-",
      role: "adds repetition",
      family: ["return", "review"]
    }
  ],
  related_words: ["fortify"]
};

describe("word cache repository", () => {
  it("returns cached word analysis in API shape when PostgreSQL has a match", async () => {
    const client = {
      word: {
        findUnique: vi.fn().mockResolvedValue(cachedWord)
      }
    };

    const result = await readCachedWord("reinforce", client);

    expect(client.word.findUnique).toHaveBeenCalledWith({
      where: { targetWord: "reinforce" },
      include: {
        segments: {
          orderBy: { sequence: "asc" },
          include: { etymology: true }
        }
      }
    });
    expect(result).toEqual({
      word: "reinforce",
      total_meaning: "make stronger",
      etymology_story: "re + force",
      analysis: [
        {
          type: "prefix",
          text: "re-",
          meaning: "again",
          origin: "Latin re-",
          role: "adds repetition",
          family: ["return", "review"]
        }
      ],
      related_words: ["return", "review"],
      cached: true
    });
  });

  it("upserts word, etymology, and ordered segment records for an uncached analysis", async () => {
    const client = {
      word: {
        upsert: vi.fn().mockResolvedValue({ id: "word-id" })
      },
      etymology: {
        upsert: vi.fn().mockResolvedValue({ id: "ety-id" })
      },
      wordSegment: {
        upsert: vi.fn().mockResolvedValue({ id: "segment-id" })
      }
    };

    await cacheWord(analysis, client);

    expect(client.word.upsert).toHaveBeenCalledWith({
      where: { targetWord: "reinforce" },
      create: {
        targetWord: "reinforce",
        totalMeaning: "make stronger",
        etymologyStory: "re + force",
        relatedWords: ["fortify"]
      },
      update: {
        totalMeaning: "make stronger",
        etymologyStory: "re + force",
        relatedWords: ["fortify"]
      },
      select: { id: true }
    });
    expect(client.etymology.upsert).toHaveBeenCalledWith({
      where: { type_text: { type: "prefix", text: "re-" } },
      create: {
        type: "prefix",
        text: "re-",
        meaning: "again",
        origin: "Latin re-",
        role: "adds repetition",
        family: ["return", "review"]
      },
      update: {
        meaning: "again",
        origin: "Latin re-",
        role: "adds repetition",
        family: ["return", "review"]
      },
      select: { id: true }
    });
    expect(client.wordSegment.upsert).toHaveBeenCalledWith({
      where: { wordId_sequence: { wordId: "word-id", sequence: 0 } },
      create: {
        wordId: "word-id",
        etymologyId: "ety-id",
        sequence: 0,
        customText: "re-"
      },
      update: {
        etymologyId: "ety-id",
        customText: "re-"
      }
    });
  });
});
