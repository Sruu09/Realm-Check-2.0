# Realm Check 2.0

## What This Is

Realm Check 2.0 is a gamified personal finance and education recommendation platform where users explore a fantasy realm map to access real-world tools — job search (Castle), scholarships and resources (Library), journaling (Pond), fitness (Garden), exam prep (Arena), finance management (Treasure), AI guidance (Wizard), and a pet companion. It targets students and early-career users who need structured help with career, learning, and financial decisions, delivered through an engaging RPG interface.

## Core Value

A student completes onboarding, explores the realm, finds relevant job matches in the Castle, gets scholarship recommendations in the Library, and tracks savings in Treasure — all in one cohesive, demo-ready session.

## Requirements

### Validated

- ✓ User can register and log in with email/password — existing
- ✓ User is onboarded with interests, goals, career preferences — existing
- ✓ User navigates an RPG realm map with clickable location nodes — existing
- ✓ User sees XP, level, streak, and savings in the HUD — existing (partially live)
- ✓ User creates, tracks, and completes quests with XP rewards — existing
- ✓ User records and views savings transactions in Treasure — existing
- ✓ User writes journal entries in Pond — existing
- ✓ User logs workout sessions in Garden — existing
- ✓ User searches for courses via Apify/Class Central — existing
- ✓ User views scholarships and exams via BodhDisha — existing
- ✓ User gets job recommendations from Adzuna based on onboarding profile — existing
- ✓ Backend runs on port 8081 (Spring Boot) — existing and must be preserved

### Active

- [ ] Castle delivers multi-platform job search with ≥80% relevance, deduplication, and match explanations
- [ ] Library, Wizard, Pond, Treasure, and Garden modules are stable and bug-free
- [ ] API keys moved to environment variables (removed from source control)
- [ ] Health bar fetches real health value from backend
- [ ] Frontend tests for core pages (Vitest + React Testing Library)
- [ ] Backend unit tests for GameProgressService and QuestService
- [ ] Integration tests for Castle job search flow
- [ ] Application is buildable and demo-ready end-to-end

### Out of Scope

- Real JWT implementation (signing, refresh, expiry) — deferred; mock JWT preserved for demo
- Broad endpoint security rewrite (blanket permitAll preserved) — security audit report only
- Gold/currency reward system — incomplete stub; deferred post-demo
- Mobile app / React Native — web-first
- OAuth (Google, GitHub) login — deferred
- Real-time features (WebSocket, SSE) — deferred
- Deployment / production infrastructure — local demo only

## Context

- **Stack:** Spring Boot 4.1.1 (Java 21) + React 19 (TypeScript/Vite) + PostgreSQL 15
- **External APIs:** Adzuna (jobs), Apify/Class Central (courses), BodhDisha (scholarships/exams)
- **Auth:** Mock JWT (hardcoded token `mock-jwt-token-123`) — intentional for rapid prototyping, preserved for demo
- **Codebase map:** `.planning/codebase/` — complete analysis of all 7 dimensions
- **22 known concerns** documented in `.planning/codebase/CONCERNS.md`
- **Demo deadline:** Tomorrow — all changes must be minimal-risk and demo-ready
- **Guiding principle:** Preserve working functionality; fix confirmed bugs; don't refactor what works

## Constraints

- **Tech Stack:** Spring Boot 4.1.1 / Java 21 / React 19 — must not change frameworks
- **Port:** Backend must stay on 8081 — hardcoded in 15 frontend service files
- **Demo Deadline:** All work must be shippable by tomorrow
- **Risk Tolerance:** Low — prefer targeted fixes over broad refactoring
- **Auth:** Do not change authentication mechanism; mock JWT preserved
- **API Keys:** Move to `.env` / environment variables only; no new secrets management system

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Preserve mock JWT for demo | Rewriting auth risks breaking login before deadline | — Pending |
| Castle as primary feature focus | Highest user-facing value; job search relevance is core demo moment | — Pending |
| Move API keys to env vars only | Minimal security fix achievable before demo; no new infra needed | — Pending |
| Vertical MVP phases | Each phase ships a working feature; safest for deadline | — Pending |
| Add tests for key services | GameProgressService/QuestService are critical logic; worth protecting | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-13 after initialization*
