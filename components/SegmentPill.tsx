import { AnalysisSegment } from '@/types/word';

const styleByType = {
  prefix: 'bg-prefix-bg text-prefix-text border-prefix-text',
  root: 'bg-root-bg text-root-text border-root-text font-semibold',
  suffix: 'bg-suffix-bg text-suffix-text border-suffix-text'
};

const labelByType = {
  prefix: 'Prefix',
  root: 'Root',
  suffix: 'Suffix'
};

interface SegmentPillProps {
  segment: AnalysisSegment;
  selected?: boolean;
  index?: number;
  onSelect?: (segment: AnalysisSegment) => void;
}

export function SegmentPill({ segment, selected = false, index = 0, onSelect }: SegmentPillProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(segment)}
      className={`animate-slide-up rounded-lg border px-4 py-3 text-left transition active:scale-[0.99] ${styleByType[segment.type]} ${
        selected ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:-translate-y-0.5'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-pressed={selected}
    >
      <span className="block text-[11px] uppercase tracking-[0.18em] opacity-70">{labelByType[segment.type]}</span>
      <span className="text-lg">{segment.text}</span>
    </button>
  );
}
