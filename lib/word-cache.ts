import type { AnalysisSegment, SegmentType, WordAnalysis } from "@/types/word";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

interface WordCacheReadClient {
  readonly word: {
    findUnique(args: Prisma.WordFindUniqueArgs): Promise<CachedWord | null>;
  };
}

interface WordCacheWriteClient {
  readonly word: {
    upsert(args: Prisma.WordUpsertArgs): Promise<{ readonly id: string }>;
  };
  readonly etymology: {
    upsert(args: Prisma.EtymologyUpsertArgs): Promise<{ readonly id: string }>;
  };
  readonly wordSegment: {
    upsert(args: Prisma.WordSegmentUpsertArgs): Promise<unknown>;
  };
}

type CachedSegment = Prisma.WordSegmentGetPayload<{
  include: { etymology: true };
}>;

type CachedWord = Prisma.WordGetPayload<{
  include: {
    segments: {
      include: { etymology: true };
    };
  };
}>;

const segmentTypeByDbType = {
  prefix: "prefix",
  root: "root",
  suffix: "suffix"
} as const satisfies Record<string, SegmentType>;

function toAnalysisSegment(segment: CachedSegment): AnalysisSegment {
  return {
    type: segmentTypeByDbType[segment.etymology.type],
    text: segment.customText || segment.etymology.text,
    meaning: segment.etymology.meaning,
    origin: segment.etymology.origin,
    role: segment.etymology.role,
    family: segment.etymology.family
  };
}

function buildRelatedWords(analysis: readonly AnalysisSegment[]): string[] {
  return Array.from(new Set(analysis.flatMap((segment) => segment.family ?? []))).slice(0, 8);
}

export async function readCachedWord(target: string, client?: WordCacheReadClient | null): Promise<WordAnalysis | null> {
  const query = {
    where: { targetWord: target },
    include: {
      segments: {
        orderBy: { sequence: "asc" },
        include: { etymology: true }
      }
    }
  } satisfies Prisma.WordFindUniqueArgs;

  if (client === null) {
    return null;
  }

  const word = client ? await client.word.findUnique(query) : await prisma?.word.findUnique(query);

  if (!word) {
    return null;
  }

  const analysis = word.segments.map(toAnalysisSegment);

  return {
    word: word.targetWord,
    total_meaning: word.totalMeaning,
    etymology_story: word.etymologyStory,
    analysis,
    related_words: buildRelatedWords(analysis),
    cached: true
  };
}

export async function cacheWord(analysis: WordAnalysis, client?: WordCacheWriteClient | null): Promise<void> {
  const db = client === undefined ? prisma : client;

  if (!db) {
    return;
  }

  const word = await db.word.upsert({
    where: { targetWord: analysis.word },
    create: {
      targetWord: analysis.word,
      totalMeaning: analysis.total_meaning,
      etymologyStory: analysis.etymology_story,
      relatedWords: analysis.related_words
    },
    update: {
      totalMeaning: analysis.total_meaning,
      etymologyStory: analysis.etymology_story,
      relatedWords: analysis.related_words
    },
    select: { id: true }
  });

  await Promise.all(
    analysis.analysis.map(async (segment, index) => {
      const etymology = await db.etymology.upsert({
        where: { type_text: { type: segment.type, text: segment.text } },
        create: {
          type: segment.type,
          text: segment.text,
          meaning: segment.meaning,
          origin: segment.origin,
          role: segment.role,
          family: segment.family ?? []
        },
        update: {
          meaning: segment.meaning,
          origin: segment.origin,
          role: segment.role,
          family: segment.family ?? []
        },
        select: { id: true }
      });

      await db.wordSegment.upsert({
        where: { wordId_sequence: { wordId: word.id, sequence: index } },
        create: {
          wordId: word.id,
          etymologyId: etymology.id,
          sequence: index,
          customText: segment.text
        },
        update: {
          etymologyId: etymology.id,
          customText: segment.text
        }
      });
    })
  );
}
