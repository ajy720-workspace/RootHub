import { AnalysisSegment } from '@/types/word';

const styleByType = {
  prefix: 'bg-prefix-bg text-prefix-text border-prefix-text',
  root: 'bg-root-bg text-root-text border-root-text font-semibold',
  suffix: 'bg-suffix-bg text-suffix-text border-suffix-text'
};

export function SegmentPill({ segment }: { segment: AnalysisSegment }) {
  return <span className={`rounded-lg border px-3 py-2 ${styleByType[segment.type]}`}>{segment.text}</span>;
}
