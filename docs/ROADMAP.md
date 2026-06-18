# 🗓️ RootHub 개발 마일스톤 (Development Roadmap)

RootHub은 '언어의 구조적 이해'라는 핵심 가치를 시작으로, 개인화된 학습 경험과 커뮤니티 생태계로 확장합니다.

---

## Phase 1: Lean MVP (Core Experience)
**목표:** AI 기반 단어 해부 및 시각화 기능의 기술적 타당성 및 사용자 경험 검증.
- [ ] 프로젝트 스캐폴딩 (Next.js, Tailwind)
- [ ] AI 단어 분해 프롬프트 엔지니어링 (OpenAI)
- [ ] 형태소별 컬러 코딩 UI 컴포넌트 개발
- [ ] PostgreSQL 기반 기본 캐싱 서버 구축

## Phase 2: Personalization (User Library)
**목표:** 저장 및 관리 기능을 통해 사용자의 리텐션(Retention) 확보.
- [ ] Auth.js (Social Login) 연동
- [ ] 나만의 단어장 (My Library) 기능
- [ ] 특정 어근/접사 팔로우 및 모아보기
- [ ] 최근 검색어 및 개인 검색 히스토리 관리

## Phase 3: Ecosystem & Learning (Advanced)
**목표:** 데이터 확장 및 학습 콘텐츠 강화를 통한 서비스 완결성 확보.
- [ ] Word Family Tree (연관 단어 추천 알고리즘)
- [ ] 어원 기반 데일리 퀴즈 및 학습 리포트
- [ ] PWA 오프라인 모드 지원 및 푸시 알림
- [ ] 사용자 생성 어원 스토리 공유 및 피드백

---

# 📄 Phase 1 PRD: Lean MVP
*상세 내용은 기존 PRD.md의 핵심 기능을 따름*

# 📄 Phase 2 PRD: Personalization
## 1. 개요
Phase 1에서 검증된 단어 해부 경험을 바탕으로, 사용자가 자신만의 어휘 지도를 구축할 수 있도록 돕는 개인화 단계.

## 2. 핵심 기능
- **Auth:** 구글/카카오 등 소셜 로그인 지원.
- **Save Feature:** 단어 전체 또는 특정 어근(Root)만 골라서 저장 가능.
- **Collection View:** 저장한 항목들을 '어근별'로 그룹화하여 시각화.
- **Activity Log:** 사용자가 검색하고 학습한 이력을 타임라인 형태로 제공.

---

# 📄 Phase 3 PRD: Ecosystem & Learning
## 1. 개요
단순 검색 툴을 넘어, 능동적인 어휘 확장과 학습이 이루어지는 플랫폼 단계.

## 2. 핵심 기능
- **Family Tree Engine:** DB 내의 동일 어근 데이터를 활용하여 복잡한 파생어 관계도(Tree) 자동 생성.
- **Smart Quiz:** 사용자가 저장한 단어들을 바탕으로 AI가 어원 중심의 객관식/주관식 퀴즈 생성.
- **Gamification:** 연속 학습일수(Streak), 배지 시스템 도입.
- **Community Insights:** 다른 유저들이 많이 검색하는 어근이나 인기 있는 어원 스토리 랭킹 제공.
