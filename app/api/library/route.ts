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

export async function GET() {
  if (!prisma) {
    return unavailable();
  }

  const userId = await getUserId();
  if (!userId) {
    return unauthorized();
  }

  const records = await prisma.userCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ library: await buildLibraryItems(records) });
}

export async function POST(req: Request) {
  if (!prisma) {
    return unavailable();
  }

  const userId = await getUserId();
  if (!userId) {
    return unauthorized();
  }

  const body = (await req.json().catch(() => null)) as { itemKey?: unknown } | null;
  const itemKey = typeof body?.itemKey === "string" ? body.itemKey : "";
  const resolved = await resolveCollectionItem(itemKey);

  if (!resolved) {
    return NextResponse.json({ error: "library item was not found" }, { status: 404 });
  }

  await prisma.userCollection.upsert({
    where: {
      userId_itemType_itemId: {
        userId,
        itemType: resolved.itemType,
        itemId: resolved.itemId
      }
    },
    create: {
      userId,
      itemType: resolved.itemType,
      itemId: resolved.itemId
    },
    update: {}
  });

  const records = await prisma.userCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ library: await buildLibraryItems(records) });
}
