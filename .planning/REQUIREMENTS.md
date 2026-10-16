# Requirements: Realm Check 2.0

**Defined:** 2026-10-13
**Core Value:** A student completes onboarding, finds relevant job matches in Castle, gets scholarship recommendations in Library, and tracks savings in Treasure — all in one cohesive, demo-ready session.

---

## v1 Requirements

Requirements for the demo-ready v1 release. Grouped by vertical feature area.

### Security & Configuration

- [ ] **SEC-01**: API keys (Adzuna, Apify, BodhDisha) are stored in environment variables, not committed to source control
- [ ] **SEC-02**: A `.env.example` file documents all required environment variables with placeholder values
- [ ] **SEC-03**: Security audit findings documented (risks catalogued; no broad security rewrite)

### Castle — Job Search & Matching

- [ ] **CAST-01**: User can search for jobs by keyword and location from the Castle page
- [ ] **CAST-02**: Castle integrates at least one additional job source alongside Adzuna (e.g., a public job feed or API) to broaden result coverage
- [ ] **CAST-03**: Job results are deduplicated across all sources (no repeated listings)
- [ ] **CAST-04**: Relevance scoring incorporates skill matching, career preferences, and interests from the onboarding profile — scores are computed, not hardcoded
- [ ] **CAST-05**: Each job match displays a relevance score with matched terms highlighted and a plain-language explanation of the match
- [ ] **CAST-06**: Job search filters (keyword, location) work correctly and return filtered results
- [ ] **CAST-07**: Job links open valid employer pages (no broken URLs)
- [ ] **CAST-08**: User can save a job to their saved jobs list from Castle
- [ ] **CAST-09**: User can view their saved jobs and job applications in Castle

### Module Stability (Library, Wizard, Pond, Treasure, Garden)

- [ ] **LIB-01**: User can view scholarships in Library without errors
- [ ] **LIB-02**: User can view exams and courses in Library without errors
- [ ] **WIZ-01**: Wizard page loads and displays AI-guided content or meaningful placeholder without crashing
- [ ] **POND-01**: User can create, view, edit, and delete journal entries in Pond without errors
- [ ] **TRES-01**: User can add and view savings transactions in Treasure without errors
- [ ] **TRES-02**: User can view their current savings balance in Treasure
- [ ] **GARD-01**: User can log and view workout sessions in Garden without errors

### HUD & Game Progression

- [ ] **HUD-01**: Health bar in RPGHud displays the real health value fetched from the backend (not hardcoded 100/100)
- [ ] **HUD-02**: XP bar, level, streak, and savings in RPGHud update after completing a quest or action

### Testing

- [ ] **TEST-01**: Frontend test suite configured (Vitest + React Testing Library installed and runnable)
- [ ] **TEST-02**: Core pages have smoke tests (Login, RealmDashboard, Castle render without crashing)
- [ ] **TEST-03**: Backend unit tests for `GameProgressService` (XP calculation, level-up logic)
- [ ] **TEST-04**: Backend unit tests for `QuestService` (quest completion, daily quest deduplication)
- [ ] **TEST-05**: Integration test for Castle job search flow (search → score → deduplicate → return results)

### Demo Readiness

- [ ] **DEMO-01**: Application starts cleanly with `mvnw.cmd spring-boot:run` (backend) and `npm run dev` (frontend)
- [ ] **DEMO-02**: Full user journey works end-to-end: Login → Onboarding → Realm Map → Castle → Treasure
- [ ] **DEMO-03**: No console errors or unhandled exceptions during the demo flow

---

## v2 Requirements

Deferred to post-demo. Tracked but not in current roadmap.

### Authentication & Security

- **AUTH-01**: Real JWT implementation with signing, expiry, and refresh tokens
- **AUTH-02**: Per-endpoint authorization (remove blanket `permitAll`)
- **AUTH-03**: OAuth login (Google, GitHub)

### Game Features

- **GAME-01**: Gold/currency reward system for quest completion
- **GAME-02**: Pet companion interactions and progression
- **GAME-03**: Energy system tied to actions

### Platform

- **PLAT-01**: Production deployment (Docker, cloud hosting)
- **PLAT-02**: Email notifications
- **PLAT-03**: Mobile-responsive UI optimization
- **PLAT-04**: Real-time features (WebSocket event push for XP updates)

---

## Out of Scope

| Feature | Reason |
|---|---|
| Real JWT auth rewrite | Deadline risk; mock JWT preserved for demo |
| Broad endpoint security rewrite | Blanket permitAll preserved; audit report only |
| Gold/currency system | Stub exists but incomplete; deferred post-demo |
| Mobile app / React Native | Web-first; mobile later |
| Production deployment | Local demo only |
| Real-time WebSocket features | Complexity vs. deadline trade-off |
| New external API integrations | Existing 3 APIs (Adzuna, Apify, BodhDisha) sufficient |

---

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|---|---|---|
| SEC-01 | Phase 1 | Pending |
| SEC-02 | Phase 1 | Pending |
| SEC-03 | Phase 1 | Pending |
| CAST-01 | Phase 2 | Pending |
| CAST-02 | Phase 2 | Pending |
| CAST-03 | Phase 2 | Pending |
| CAST-04 | Phase 2 | Pending |
| CAST-05 | Phase 2 | Pending |
| CAST-06 | Phase 2 | Pending |
| CAST-07 | Phase 2 | Pending |
| CAST-08 | Phase 2 | Pending |
| CAST-09 | Phase 2 | Pending |
| LIB-01 | Phase 3 | Pending |
| LIB-02 | Phase 3 | Pending |
| WIZ-01 | Phase 3 | Pending |
| POND-01 | Phase 3 | Pending |
| TRES-01 | Phase 3 | Pending |
| TRES-02 | Phase 3 | Pending |
| GARD-01 | Phase 3 | Pending |
| HUD-01 | Phase 3 | Pending |
| HUD-02 | Phase 3 | Pending |
| TEST-01 | Phase 4 | Pending |
| TEST-02 | Phase 4 | Pending |
| TEST-03 | Phase 4 | Pending |
| TEST-04 | Phase 4 | Pending |
| TEST-05 | Phase 4 | Pending |
| DEMO-01 | Phase 4 | Pending |
| DEMO-02 | Phase 4 | Pending |
| DEMO-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-13*
*Last updated: 2026-10-13 after initial definition*
