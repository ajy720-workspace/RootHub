import { prisma } from "@/lib/prisma";
import { normalizeTarget } from "@/lib/word-normalize";
import type { LibraryItem, LibraryItemType, SegmentType } from "@/types/word";

export type CollectionRecord = {
  readonly itemType: LibraryItemType;
  readonly itemId: string;
  readonly createdAt: Date;
};

export type ResolvedCollectionItem = {
  readonly itemType: LibraryItemType;
  readonly itemId: string;
};

function isSegmentType(value: string): value is SegmentType {
  return value === "prefix" || value === "root" || value === "suffix";
}

function keyForRecord(itemType: LibraryItemType, item: { targetWord?: string; type?: SegmentType; text?: string }) {
  if (itemType === "word") {
    return `word:${item.targetWord}`;
  }

  return `etymology:${item.type}:${item.text}`;
}

export async function buildLibraryItems(records: readonly CollectionRecord[]): Promise<LibraryItem[]> {
  if (!prisma || records.length === 0) {
    return [];
  }

  const wordIds = records.filter((record) => record.itemType === "word").map((record) => record.itemId);
  const etymologyIds = records.filter((record) => record.itemType === "etymology").map((record) => record.itemId);

  const [words, etymologies] = await Promise.all([
    prisma.word.findMany({ where: { id: { in: wordIds } } }),
    prisma.etymology.findMany({ where: { id: { in: etymologyIds } } })
  ]);

  const wordById = new Map(words.map((word) => [word.id, word]));
  const etymologyById = new Map(etymologies.map((etymology) => [etymology.id, etymology]));

  return records.flatMap((record) => {
    if (record.itemType === "word") {
      const word = wordById.get(record.itemId);
      if (!word) return [];

      return {
        id: keyForRecord("word", word),
        itemType: "word",
        label: word.targetWord,
        meaning: word.totalMeaning,
        savedAt: record.createdAt.toISOString()
      };
    }

    const etymology = etymologyById.get(record.itemId);
    if (!etymology) return [];

    return {
      id: keyForRecord("etymology", etymology),
      itemType: "etymology",
      label: etymology.text,
      meaning: etymology.meaning,
      origin: etymology.origin,
      segmentType: etymology.type,
      savedAt: record.createdAt.toISOString()
    };
  });
}

export async function resolveCollectionItem(itemKey: string): Promise<ResolvedCollectionItem | null> {
  if (!prisma) {
    return null;
  }

  if (itemKey.startsWith("word:")) {
    const targetWord = normalizeTarget(itemKey.slice("word:".length));
    if (!targetWord) return null;

    const word = await prisma.word.findUnique({
      where: { targetWord },
      select: { id: true }
    });

    return word ? { itemType: "word", itemId: word.id } : null;
  }

  if (itemKey.startsWith("etymology:")) {
    const [, type, ...textParts] = itemKey.split(":");
    const text = textParts.join(":").trim();

    if (!isSegmentType(type) || !text) {
      return null;
    }

    const etymology = await prisma.etymology.findUnique({
      where: { type_text: { type, text } },
      select: { id: true }
    });

    return etymology ? { itemType: "etymology", itemId: etymology.id } : null;
  }

  return null;
}
