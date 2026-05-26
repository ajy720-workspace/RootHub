# 📄 제품 요구사항 정의서 (PRD): RootHub (가칭)

## 1. 서비스 개요

* **서비스명:** RootHub (가칭)
* **목적:** 영단어를 단순히 암기하는 것을 넘어, 접두사(Prefix), 어근(Root), 접미사(Suffix)로 분해하여 언어의 구조적 이해를 돕고 어휘 학습의 확장성을 제공하는 PWA 기반 웹 애플리케이션.
* **타겟 유저:** 토익, 토플, 수능 등 중/고급 수준의 어휘 확장이 필요한 학습자 및 영어 어원에 흥미를 느끼는 일반인.
* **핵심 가치 제안 (Core Value):** "단어 하나를 알면 열을 유추할 수 있는 언어의 설계도 제공"

---

## 2. 핵심 기능 요구사항

### 2.1. 단어 해부 및 시각화 (Word Anatomy)

* 사용자가 검색창에 영단어를 입력하면, AI를 활용해 단어를 최소 단위의 형태소(접두사, 어근, 접미사)로 분해하여 시각적 블록 형태로 제공한다.
* 복합 어근이나 다중 접사(예: `re-` + `in-` + `force`)를 완벽히 지원하기 위해 고정된 3단 구조가 아닌 '유동적 시퀀스' 기반으로 블록을 렌더링한다.
* 각 블록을 클릭하면 해당 형태소의 라틴어/그리스어 기원, 본래 의미, 그리고 단어 내에서의 역할을 상세히 설명하는 뷰를 제공한다.

### 2.2. 어원 스토리 생성 (Etymology Story)

* 분해된 형태소들이 어떻게 결합하여 현재의 단어 뜻(Total Meaning)을 가지게 되었는지 AI가 자연스러운 문장(스토리)으로 풀어서 설명한다.

### 2.3. 가족 단어 확장 (Word Family Tree)

* 특정 어근(Root) 블록을 클릭했을 때, 동일한 어근을 공유하는 다른 파생 단어들(예: `fin` -> `define`, `refine`, `confine`)을 추천하여 연계 학습을 유도한다.

### 2.4. 나만의 단어장 (My Library)

* 사용자는 검색한 '단어 전체'를 저장할 수도 있고, 특정 '어근이나 접사'만을 별도로 저장하여 관리할 수 있다.
* 단어장 내에서는 내가 저장한 어근을 중심으로 학습할 수 있는 '어근 모아보기' 모드를 제공한다.

---

## 3. UI/UX 디자인 요구사항

### 3.1. 컬러 코딩 시스템 (Color-Coding)

사용자가 색상만으로 단어의 구조를 직관적으로 파악할 수 있도록 글로벌 디자인 토큰을 고정한다.

* **접두사 (Prefix):** 파란색 계열 (예: 배경 `#EBF5FF`, 텍스트/테두리 `#2563EB`)
* **어근 (Root):** 빨간색 계열 (예: 배경 `#FEF2F2`, 텍스트/테두리 `#DC2626` / Bold 처리)
* **접미사 (Suffix):** 초록색 계열 (예: 배경 `#F0FDF4`, 텍스트/테두리 `#16A34A`)

### 3.2. 화면 레이아웃 (The Anatomy Lab)

* **상단:** 검색바 및 최근 검색어 칩(Chips).
* **중앙 (Visual Breakdown):** 단어가 분리된 시각적 형태소 블록들 (가로 배열, Flex-wrap 적용). 조립되는 느낌의 Slide-up 애니메이션 적용.
* **중하단 (Insight Drawer):** 선택된 형태소의 상세 의미와 AI 어원 스토리 카드.
* **하단 (Related Words):** 동일 어근을 가진 연관 단어들이 나열된 횡스크롤 영역 (각 단어 우측 하단에 `+` 저장 버튼 포함).

---

## 4. 시스템 아키텍처 및 API 요구사항

### 4.1. 기술 스택

* **플랫폼:** PWA (Progressive Web App) - 접근성 확보 및 추후 Native 앱 전환 대비
* **Frontend:** Next.js (React), Tailwind CSS
* **Backend/Database:** Supabase (PostgreSQL 기반, Auth 및 캐싱 활용)
* **AI API:** OpenAI (GPT-4o-mini 등), JSON Mode 응답 강제 적용

### 4.2. 검색 및 캐싱 로직 (Data Flow)

1. 사용자가 단어 검색.
2. 서버에서 DB(`words` 테이블)를 우선 조회.
3. **DB에 데이터가 존재할 경우:** 즉시 캐시된 데이터를 반환하여 렌더링.
4. **DB에 데이터가 없을 경우:** AI API에 프롬프트를 전송하여 단어 분석 요청.
5. AI의 JSON 응답을 받아 RDBMS 구조에 맞게 분리하여 DB에 저장(Caching) 후 프론트엔드로 반환.

### 4.3. AI 프롬프트 요구사항

* AI는 반드시 다음과 같은 JSON 포맷으로 응답해야 하며, 환각(Hallucination)을 최소화하기 위해 검증된 어원 정보를 바탕으로 쪼개도록 프롬프트를 구성한다.
* **응답 포맷:** `word`, `total_meaning`, `etymology_story`, `analysis` (배열 형태: `type`, `text`, `meaning`, `origin` 포함)

---

## 5. 데이터베이스 스키마 설계 (DB Schema)

다중 접사, 복합 어근을 처리하고 확장성을 보장하기 위해 N:M 매핑 테이블을 구성한다.

* **`etymologies` 테이블 (어원 마스터):**
    * `id` (PK, UUID)
    * `type` (ENUM: 'prefix', 'root', 'suffix')
    * `text` (형태소 원형)
    * `meaning` (의미)
    * `origin` (원형)


* **`words` 테이블 (단어 마스터):**
    * `id` (PK, UUID)
    * `target_word` (영단어 원본)
    * `total_meaning` (단어 전체 의미)
    * `etymology_story` (어원 스토리)


* **`word_segments` 테이블 (단어-어원 매핑 - 핵심 테이블):**
    * `id` (PK, UUID)
    * `word_id` (FK)
    * `etymology_id` (FK)
    * `sequence` (단어 내 형태소의 순서, INT)
    * `custom_text` (해당 단어 내에서 변형된 철자 형태)


* **`user_collections` 테이블 (단어장):**
    * `id` (PK, UUID)
    * `user_id` (FK)
    * `item_type` (ENUM: 'word', 'etymology')
    * `item_id` (FK)