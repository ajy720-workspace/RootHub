import { NextRequest, NextResponse } from 'next/server';
import { analyzeWordWithGemini } from '@/lib/gemini';
import { cacheWord, readCachedWord } from '@/lib/word-cache';
import { normalizeTarget } from '@/lib/word-normalize';

export async function GET(req: NextRequest) {
  const target = normalizeTarget(req.nextUrl.searchParams.get('target') ?? '');

  if (!target) {
    return NextResponse.json({ error: 'target is required' }, { status: 400 });
  }

  const cached = await readCachedWord(target);
  if (cached) {
    return NextResponse.json(cached);
  }

  const analysis = await analyzeWordWithGemini(target);
  const normalized = { ...analysis, word: normalizeTarget(analysis.word || target), cached: false };
  await cacheWord(normalized);

  return NextResponse.json(normalized);
}
