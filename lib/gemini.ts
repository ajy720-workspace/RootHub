import { GoogleGenAI } from '@google/genai';
import { WordAnalysis } from '@/types/word';

const MODEL = 'gemini-3.5-flash';

const fixtures: Record<string, WordAnalysis> = {
  reinforce: {
    word: 'reinforce',
    total_meaning: '다시 또는 추가로 힘을 보태어 더 강하게 만들다.',
    etymology_story:
      're-는 “again/back”의 감각을, in-은 “into”의 방향성을 더하고, force는 라틴어 fortis의 “strong”에서 온 힘의 개념을 담습니다. 그래서 reinforce는 어떤 대상 안으로 힘을 다시 넣어 견고하게 만든다는 이미지로 이해할 수 있습니다.',
    analysis: [
      { type: 'prefix', text: 're-', meaning: 'again, back', origin: 'Latin re-', role: '반복·강화의 방향을 더합니다.', family: ['return', 'rebuild', 'review'] },
      { type: 'prefix', text: 'in-', meaning: 'into, in', origin: 'Latin in-', role: '힘이 대상 안으로 들어가는 느낌을 만듭니다.', family: ['inject', 'include', 'insert'] },
      { type: 'root', text: 'force', meaning: 'strength, power', origin: 'Latin fortis', role: '단어의 핵심 의미인 힘과 강도를 담당합니다.', family: ['fortify', 'effort', 'comfort'] }
    ],
    related_words: ['fortify', 'enforce', 'forceful', 'effort']
  },
  define: {
    word: 'define',
    total_meaning: '범위나 의미를 명확히 정하다.',
    etymology_story:
      'de-는 아래로 또는 완전히라는 방향을 만들고, fin은 라틴어 finis의 “경계·끝”을 뜻합니다. define은 경계를 끝까지 그어 의미를 분명하게 하는 단어입니다.',
    analysis: [
      { type: 'prefix', text: 'de-', meaning: 'down, completely', origin: 'Latin de-', role: '완결·분리의 뉘앙스를 더합니다.', family: ['describe', 'deduct', 'detach'] },
      { type: 'root', text: 'fin', meaning: 'end, boundary', origin: 'Latin finis', role: '경계와 한계를 정하는 핵심 의미입니다.', family: ['final', 'confine', 'refine'] },
      { type: 'suffix', text: '-e', meaning: 'verb marker', origin: 'Middle English spelling', role: '동사 형태로 굳어진 철자 요소입니다.', family: ['refine', 'confine'] }
    ],
    related_words: ['final', 'confine', 'refine', 'finite']
  }
};

const wordAnalysisSchema = {
  type: 'object',
  properties: {
    word: { type: 'string' },
    total_meaning: { type: 'string' },
    etymology_story: { type: 'string' },
    analysis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['prefix', 'root', 'suffix'] },
          text: { type: 'string' },
          meaning: { type: 'string' },
          origin: { type: 'string' },
          role: { type: 'string' },
          family: { type: 'array', items: { type: 'string' } }
        },
        required: ['type', 'text', 'meaning', 'origin', 'role', 'family']
      }
    },
    related_words: { type: 'array', items: { type: 'string' } }
  },
  required: ['word', 'total_meaning', 'etymology_story', 'analysis', 'related_words']
} as const;

export function fallbackAnalysis(target: string): WordAnalysis {
  const key = target.toLowerCase();
  return fixtures[key] ?? {
    word: key,
    total_meaning: `${key}의 의미를 형태소 단위로 탐색합니다.`,
    etymology_story:
      '데모 분석입니다. Gemini API 키와 DATABASE_URL을 연결하면 검증된 어원 정보를 JSON으로 생성하고 캐시에 저장합니다.',
    analysis: [{ type: 'root', text: key, meaning: 'core word form', origin: 'Dictionary lookup recommended', role: '현재 MVP에서는 알 수 없는 단어를 하나의 어근 블록으로 표시합니다.', family: [] }],
    related_words: []
  };
}

export async function analyzeWordWithGemini(target: string): Promise<WordAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackAnalysis(target);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Analyze the English word: ${target}`,
    config: {
      systemInstruction: [
        'You are an etymology tutor.',
        'Return only reliable JSON with word, total_meaning, etymology_story, analysis, related_words.',
        'analysis items require type(prefix/root/suffix), text, meaning, origin, role, family(array).',
        'Prefer Korean explanations and avoid unsupported segmentation.'
      ].join(' '),
      responseMimeType: 'application/json',
      responseJsonSchema: wordAnalysisSchema
    }
  });

  if (!response.text) {
    return fallbackAnalysis(target);
  }

  return JSON.parse(response.text) as WordAnalysis;
}
