'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { SegmentPill } from '@/components/SegmentPill';
import { AnalysisSegment, LibraryItem, WordAnalysis } from '@/types/word';

const starterWords = ['reinforce', 'define', 'transport'];
const libraryKey = 'roothub.library.v1';
const recentKey = 'roothub.recent.v1';

export default function HomePage() {
  const [query, setQuery] = useState('reinforce');
  const [recent, setRecent] = useState<string[]>(starterWords);
  const [result, setResult] = useState<WordAnalysis | null>(null);
  const [selected, setSelected] = useState<AnalysisSegment | null>(null);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [libraryTab, setLibraryTab] = useState<'word' | 'etymology'>('word');
  const [status, setStatus] = useState('검색할 단어를 입력하세요.');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLibrary(JSON.parse(localStorage.getItem(libraryKey) ?? '[]'));
    setRecent(JSON.parse(localStorage.getItem(recentKey) ?? JSON.stringify(starterWords)));
    void searchWord('reinforce');
    // The initial demo load should run once after localStorage hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleLibrary = useMemo(
    () => library.filter((item) => item.itemType === libraryTab).sort((a, b) => b.savedAt.localeCompare(a.savedAt)),
    [library, libraryTab]
  );

  async function searchWord(nextQuery = query) {
    const target = nextQuery.trim().toLowerCase();
    if (!target) return;

    setIsLoading(true);
    setStatus(`${target} 분석 중...`);

    try {
      const response = await fetch(`/api/word?target=${encodeURIComponent(target)}`);
      if (!response.ok) throw new Error('단어 분석에 실패했습니다.');
      const data = (await response.json()) as WordAnalysis;
      setResult(data);
      setSelected(data.analysis[0] ?? null);
      setStatus(data.cached ? '캐시된 분석을 불러왔습니다.' : '새 분석을 생성했습니다.');
      const nextRecent = [target, ...recent.filter((item) => item !== target)].slice(0, 6);
      setRecent(nextRecent);
      localStorage.setItem(recentKey, JSON.stringify(nextRecent));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void searchWord();
  }

  function saveItem(item: LibraryItem) {
    const next = [item, ...library.filter((saved) => saved.id !== item.id)];
    setLibrary(next);
    localStorage.setItem(libraryKey, JSON.stringify(next));
    setStatus(`${item.label} 저장 완료`);
  }

  return (
    <main className="min-h-screen bg-white text-[#181d26]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <nav className="mb-16 flex items-center justify-between border-b border-[#dddddd] pb-4 text-sm">
          <span className="text-xl font-medium">RootHub</span>
          <a href="#library" className="rounded-lg border border-[#dddddd] px-4 py-2">My Library</a>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#41454d]">The Anatomy Lab</p>
              <h1 className="max-w-3xl text-5xl font-normal leading-[1.05] md:text-6xl">단어 하나에서 어휘의 설계도를 발견하세요.</h1>
              <p className="max-w-2xl text-lg leading-7 text-[#333840]">영단어를 접두사, 어근, 접미사의 유동적 시퀀스로 분해하고 어원 스토리와 가족 단어를 함께 학습합니다.</p>
            </div>

            <form onSubmit={onSubmit} className="rounded-xl border border-[#dddddd] bg-[#f8fafc] p-3 md:flex md:gap-3">
              <input
                value={query}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                className="h-12 w-full rounded-md border border-[#dddddd] bg-white px-4 outline-none focus:border-[#458fff]"
                placeholder="영단어 검색 (예: reinforce)"
              />
              <button disabled={isLoading} className="mt-3 h-12 w-full rounded-xl bg-[#181d26] px-6 font-medium text-white disabled:opacity-60 md:mt-0 md:w-auto">
                {isLoading ? 'Analyzing' : 'Analyze'}
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {recent.map((word) => (
                <button key={word} onClick={() => { setQuery(word); void searchWord(word); }} className="rounded-full border border-[#dddddd] px-3 py-1.5 text-sm text-[#41454d]">
                  {word}
                </button>
              ))}
            </div>

            {result && (
              <section className="space-y-6 rounded-xl border border-[#dddddd] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#41454d]">Visual Breakdown</p>
                    <h2 className="text-3xl font-normal">{result.word}</h2>
                    <p className="mt-2 text-[#333840]">{result.total_meaning}</p>
                  </div>
                  <button onClick={() => saveItem({ id: `word:${result.word}`, itemType: 'word', label: result.word, meaning: result.total_meaning, savedAt: new Date().toISOString() })} className="rounded-xl border border-[#dddddd] px-4 py-2 text-sm">+ 저장</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.analysis.map((segment, index) => <SegmentPill key={`${segment.text}-${index}`} segment={segment} selected={selected?.text === segment.text} index={index} onSelect={setSelected} />)}
                </div>
              </section>
            )}

            {selected && result && (
              <section className="grid gap-6 md:grid-cols-[320px_1fr]">
                <article className="rounded-xl bg-[#f5e9d4] p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#41454d]">Insight Drawer</p>
                  <h3 className="mt-3 text-2xl font-normal">{selected.text}</h3>
                  <p className="mt-3 text-[#333840]">{selected.meaning}</p>
                  <p className="mt-4 text-sm text-[#41454d]">Origin: {selected.origin}</p>
                  <p className="mt-4 text-sm leading-6">{selected.role}</p>
                  <button onClick={() => saveItem({ id: `etymology:${selected.type}:${selected.text}`, itemType: 'etymology', label: selected.text, meaning: selected.meaning, origin: selected.origin, segmentType: selected.type, savedAt: new Date().toISOString() })} className="mt-6 rounded-xl bg-[#181d26] px-4 py-2 text-sm font-medium text-white">형태소 저장</button>
                </article>
                <article className="rounded-xl bg-[#181d26] p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.18em] text-white/70">Etymology Story</p>
                  <p className="mt-4 text-xl leading-8">{result.etymology_story}</p>
                </article>
              </section>
            )}

            {result && (
              <section className="space-y-3">
                <h2 className="text-2xl font-normal">Related Words</h2>
                <div className="flex gap-3 overflow-x-auto pb-3">
                  {result.related_words.length ? result.related_words.map((word) => (
                    <button key={word} onClick={() => { setQuery(word); void searchWord(word); }} className="min-w-40 rounded-xl border border-[#dddddd] p-4 text-left">
                      <span className="block text-lg">{word}</span>
                      <span className="text-sm text-[#41454d]">가족 단어 열기</span>
                    </button>
                  )) : <p className="text-[#41454d]">연관 단어는 API 연결 후 확장됩니다.</p>}
                </div>
              </section>
            )}
          </div>

          <aside id="library" className="sticky top-6 rounded-xl border border-[#dddddd] bg-white p-5">
            <p className="text-sm text-[#41454d]">{status}</p>
            <h2 className="mt-4 text-2xl font-normal">My Library</h2>
            <div className="mt-4 grid grid-cols-2 rounded-lg border border-[#dddddd] p-1 text-sm">
              <button onClick={() => setLibraryTab('word')} className={`rounded-md py-2 ${libraryTab === 'word' ? 'bg-[#181d26] text-white' : ''}`}>단어</button>
              <button onClick={() => setLibraryTab('etymology')} className={`rounded-md py-2 ${libraryTab === 'etymology' ? 'bg-[#181d26] text-white' : ''}`}>어근/접사</button>
            </div>
            <div className="mt-4 space-y-3">
              {visibleLibrary.length ? visibleLibrary.map((item) => (
                <article key={item.id} className="rounded-lg bg-[#f8fafc] p-3">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-[#41454d]">{item.meaning}</p>
                </article>
              )) : <p className="text-sm text-[#41454d]">저장한 항목이 여기에 표시됩니다.</p>}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
