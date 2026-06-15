import { NextRequest, NextResponse } from 'next/server';
import { analyzeWordWithOpenAI } from '@/lib/openai';
import { getSupabaseAdmin } from '@/lib/supabase';
import { AnalysisSegment, WordAnalysis } from '@/types/word';

function normalizeTarget(target: string) {
  return target.trim().toLowerCase().replace(/[^a-z-]/g, '');
}

async function readCachedWord(target: string): Promise<WordAnalysis | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: word } = await supabase
    .from('words')
    .select('id,target_word,total_meaning,etymology_story')
    .eq('target_word', target)
    .maybeSingle();

  if (!word) return null;

  const { data: segments } = await supabase
    .from('word_segments')
    .select('sequence,custom_text,etymologies(type,text,meaning,origin,role,family)')
    .eq('word_id', word.id)
    .order('sequence', { ascending: true });

  const analysis =
    segments?.map((segment) => {
      const etymology = Array.isArray(segment.etymologies) ? segment.etymologies[0] : segment.etymologies;
      return {
        type: etymology.type,
        text: segment.custom_text || etymology.text,
        meaning: etymology.meaning,
        origin: etymology.origin,
        role: etymology.role,
        family: etymology.family ?? []
      } as AnalysisSegment;
    }) ?? [];

  return {
    word: word.target_word,
    total_meaning: word.total_meaning,
    etymology_story: word.etymology_story,
    analysis,
    related_words: Array.from(new Set(analysis.flatMap((segment) => segment.family ?? []))).slice(0, 8),
    cached: true
  };
}

async function cacheWord(analysis: WordAnalysis) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { data: word } = await supabase
    .from('words')
    .upsert(
      {
        target_word: analysis.word,
        total_meaning: analysis.total_meaning,
        etymology_story: analysis.etymology_story,
        related_words: analysis.related_words
      },
      { onConflict: 'target_word' }
    )
    .select('id')
    .single();

  if (!word) return;

  await Promise.all(
    analysis.analysis.map(async (segment, index) => {
      const { data: etymology } = await supabase
        .from('etymologies')
        .upsert(
          {
            type: segment.type,
            text: segment.text,
            meaning: segment.meaning,
            origin: segment.origin,
            role: segment.role,
            family: segment.family ?? []
          },
          { onConflict: 'type,text' }
        )
        .select('id')
        .single();

      if (!etymology) return;

      await supabase.from('word_segments').upsert(
        {
          word_id: word.id,
          etymology_id: etymology.id,
          sequence: index,
          custom_text: segment.text
        },
        { onConflict: 'word_id,sequence' }
      );
    })
  );
}

export async function GET(req: NextRequest) {
  const target = normalizeTarget(req.nextUrl.searchParams.get('target') ?? '');

  if (!target) {
    return NextResponse.json({ error: 'target is required' }, { status: 400 });
  }

  const cached = await readCachedWord(target);
  if (cached) {
    return NextResponse.json(cached);
  }

  const analysis = await analyzeWordWithOpenAI(target);
  const normalized = { ...analysis, word: normalizeTarget(analysis.word || target), cached: false };
  await cacheWord(normalized);

  return NextResponse.json(normalized);
}
