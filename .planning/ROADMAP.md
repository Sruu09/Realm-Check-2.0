# Roadmap: Realm Check 2.0

## Overview

Transform Realm Check 2.0 into a stable, demonstrable MVP ready for presentation. The execution focuses on high-impact priorities: establishing baseline configuration hygiene, building out an intelligent multi-source job matching engine in Castle, stabilizing the core interactive exploration modules, and verifying the end-to-end user experience with targeted automated tests and runtime validation.

## Phases

- [ ] **Phase 1: Config & Security Hygiene** - Isolate credentials into environment variables and audit security boundaries
- [x] **Phase 2: Castle Multi-Source Job Matching** - Multi-source job search, deduplication, and explainable skill-based relevance
- [x] **Phase 3: Core Exploration & Module Stabilization** - Stabilize Library, Wizard, Pond, Treasure, Garden, and live HUD metrics
- [ ] **Phase 4: Test Coverage & Demo Validation** - Vitest smoke tests, Spring service unit tests, and verified end-to-end journey

## Phase Details

### Phase 1: Config & Security Hygiene
**Goal**: Isolate committed API credentials into local environment configuration, create `.env.example`, and document security audit boundaries without disrupting existing auth or changing port 8081.
**Mode**: mvp
**Depends on**: Nothing
**Requirements**: SEC-01, SEC-02, SEC-03
**Success Criteria**:
  1. API keys for Adzuna, Apify, and BodhDisha load via environment variables/`.env` without tracking raw secrets in git
  2. `.env.example` documents all required keys and configs
  3. Spring Boot backend starts cleanly on port 8081 with credentials loaded from env
**Plans**: TBD

Plans:
- [ ] 01-01: Move API keys to environment variables and create `.env.example`
- [ ] 01-02: Document security audit findings and ensure baseline configurations are clean

### Phase 2: Castle Multi-Source Job Matching
**Goal**: Deliver a reliable job matching and search experience in Castle using multi-source feeds, deduplication, and transparent, profile-based relevance explanations.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: CAST-01, CAST-02, CAST-03, CAST-04, CAST-05, CAST-06, CAST-07, CAST-08, CAST-09
**Success Criteria**:
  1. User can search jobs by keyword and location from the Castle view
  2. Results combine Adzuna and an additional accessible job source/feed without duplicate entries
  3. Every job displays an evaluated relevance score and plain-language match rationale derived from user onboarding skills/interests
  4. Outbound job application links open valid URLs, and users can save jobs to their profile
**Plans**: 3/3 complete

Plans:
- [x] 02-01: Multi-Source Job Ingestion & Normalization Engine (Jobicy + Adzuna)
- [x] 02-02: Deduplication & Profile-Driven Relevance Scoring Engine with Unit Tests
- [x] 02-03: Castle Search & Recommendation UI Unification & Runtime Verification

### Phase 3: Core Exploration & Module Stabilization
**Goal**: Resolve runtime bugs across Library, Wizard, Pond, Treasure, and Garden, and connect HUD metrics (health, streak, savings) to live backend data.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: LIB-01, LIB-02, WIZ-01, POND-01, TRES-01, TRES-02, GARD-01, HUD-01, HUD-02
**Success Criteria**:
  1. Library loads scholarships, exams, and courses without UI or network exceptions
  2. Pond journal entries, Treasure savings transactions, and Garden workouts persist and display accurately
  3. Wizard dialogue renders without crashing or missing props
  4. HUD Health bar displays live health from the User model instead of a static 100/100 placeholder
**Plans**: Complete

Plans:
- [x] 03-01: Fix and stabilize Library, Wizard, and Pond runtime issues
- [x] 03-02: Fix and verify Treasure and Garden data flows
- [x] 03-03: Connect HUD health and real-time RPG progression updates

### Phase 4: Test Coverage & Demo Validation
**Goal**: Add targeted automated tests for critical business logic and frontend views, verifying the complete demo user journey end-to-end.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, DEMO-01, DEMO-02, DEMO-03
**Success Criteria**:
  1. Frontend Vitest suite executes smoke tests for Login, RealmDashboard, and Castle
  2. Backend JUnit tests verify `GameProgressService`, `QuestService`, and Castle job filtering
  3. The full demo journey (Login → Onboarding → Map → Castle → Treasure) executes smoothly on ports 5173/8081 without console errors
**Plans**: TBD

Plans:
- [ ] 04-01: Configure Vitest and implement frontend smoke tests
- [ ] 04-02: Add backend unit tests for progression, quests, and job search flow
- [ ] 04-03: End-to-end demo dry run and final stability verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. Config & Security Hygiene | 0/2 | Not started | - |
| 2. Castle Multi-Source Job Matching | 3/3 | Complete | 2026-10-13 |
| 3. Core Exploration & Module Stabilization | 3/3 | Complete | 2026-10-13 |
| 4. Test Coverage & Demo Validation | 0/3 | Not started | - |
