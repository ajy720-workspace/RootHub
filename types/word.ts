export type SegmentType = 'prefix' | 'root' | 'suffix';

export interface AnalysisSegment {
  type: SegmentType;
  text: string;
  meaning: string;
  origin: string;
  role: string;
  family?: string[];
}

export interface WordAnalysis {
  word: string;
  total_meaning: string;
  etymology_story: string;
  analysis: AnalysisSegment[];
  related_words: string[];
  cached?: boolean;
}

export type LibraryItemType = 'word' | 'etymology';

export interface LibraryItem {
  id: string;
  itemType: LibraryItemType;
  label: string;
  meaning: string;
  origin?: string;
  segmentType?: SegmentType;
  savedAt: string;
}
