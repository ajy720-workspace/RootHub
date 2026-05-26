import { SegmentPill } from '@/components/SegmentPill';
import { WordAnalysis } from '@/types/word';

const demo: WordAnalysis = {
  word: 'reinforce',
  total_meaning: '다시 강하게 만들다',
  etymology_story: 're(again) + in(into) + force(strength) 구조로 형성되어, 어떤 것을 더 강하게 만드는 의미를 갖습니다.',
  analysis: [
    { type: 'prefix', text: 're-', meaning: 'again', origin: 'Latin' },
    { type: 'prefix', text: 'in-', meaning: 'into', origin: 'Latin' },
    { type: 'root', text: 'force', meaning: 'strength', origin: 'Latin fortis' }
  ]
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">RootHub · Anatomy Lab</h1>
      <input className="w-full rounded-lg border px-4 py-3" placeholder="영단어 검색 (예: reinforce)" />
      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-lg font-medium">Visual Breakdown</h2>
        <div className="flex flex-wrap gap-2">{demo.analysis.map((s, i) => <SegmentPill key={`${s.text}-${i}`} segment={s} />)}</div>
      </section>
      <section className="rounded-xl border p-4">
        <h2 className="mb-3 text-lg font-medium">Etymology Story</h2>
        <p>{demo.etymology_story}</p>
      </section>
    </main>
  );
}
