import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { buildLibraryItems, resolveCollectionItem } from "@/lib/library";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "authentication required" }, { status: 401 });
}

function unavailable() {
  return NextResponse.json({ error: "database is not configured" }, { status: 503 });
}

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function POST(req: Request) {
  if (!prisma) {
    return unavailable();
  }
  const db = prisma;

  const userId = await getUserId();
  if (!userId) {
    return unauthorized();
  }

  const body = (await req.json().catch(() => null)) as { items?: unknown } | null;
  const items = Array.isArray(body?.items) ? body.items : [];
  const itemKeys = Array.from(
    new Set(
      items
        .map((item) => (typeof item === "object" && item && "id" in item ? item.id : null))
        .filter((id): id is string => typeof id === "string")
    )
  );

  const resolvedItems = (await Promise.all(itemKeys.map(resolveCollectionItem))).filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );

  await Promise.all(
    resolvedItems.map((item) =>
      db.userCollection.upsert({
        where: {
          userId_itemType_itemId: {
            userId,
            itemType: item.itemType,
            itemId: item.itemId
          }
        },
        create: {
          userId,
          itemType: item.itemType,
          itemId: item.itemId
        },
        update: {}
      })
    )
  );

  const records = await db.userCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ library: await buildLibraryItems(records), mergedCount: resolvedItems.length });
}
