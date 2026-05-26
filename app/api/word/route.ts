import { NextRequest, NextResponse } from 'next/server';
import { WordAnalysis } from '@/types/word';

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('target');
  if (!target) {
    return NextResponse.json({ error: 'target is required' }, { status: 400 });
  }

  const mock: WordAnalysis = {
    word: target,
    total_meaning: `${target}의 전체 의미`,
    etymology_story: `${target}의 형태소가 결합되어 현재의 의미가 되었습니다.`,
    analysis: []
  };

  return NextResponse.json(mock);
}
