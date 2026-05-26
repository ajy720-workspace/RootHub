export type SegmentType = 'prefix' | 'root' | 'suffix';

export interface AnalysisSegment {
  type: SegmentType;
  text: string;
  meaning: string;
  origin: string;
}

export interface WordAnalysis {
  word: string;
  total_meaning: string;
  etymology_story: string;
  analysis: AnalysisSegment[];
}
