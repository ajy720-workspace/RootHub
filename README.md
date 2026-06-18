# RootHub

RootHub is a PWA-style vocabulary learning app that decomposes English words into prefix/root/suffix and explains etymology.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- PostgreSQL with Prisma
- Gemini API

## Quick Start
1. Install deps: `yarn install`
2. Copy env: `cp .env.example .env.local` and replace the `DATABASE_URL` placeholders.
3. Run dev server: `yarn dev`

## Production Deploy
Pushing to `main` builds a Docker image, pushes it to GHCR, then deploys it on the `self-hosted` runner with Docker Compose.

Configure these values in the GitHub `Production` environment:
- Secrets: `ROOTHUB_DATABASE_URL`, `ROOTHUB_GEMINI_API_KEY`
- Variable: `ROOTHUB_APP_PORT` (optional, defaults to `3000`)

## Current Scope
Phase 1 MVP: search -> analysis -> visualization -> PostgreSQL caching.
