# Phase 2: Castle Multi-Source Job Matching - Context

**Gathered:** 2026-10-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform Castle into a demo-ready multi-source job matching engine. Users will be able to search jobs across Adzuna plus at least one legitimate public feed (e.g. Jobicy/Remotive), see evaluated (not fake/hardcoded) skill and profile match relevance, read transparent explanations of why a job matches, apply via valid URLs, and save jobs to their profile. Backend port remains strictly 8081.

</domain>

<decisions>
## Implementation Decisions

### 1. Data Sources & Ingestion
- **D-01:** Primary source remains Adzuna (`AdzunaService.java`) with query pass-through (`what` and `where`).
- **D-02:** Secondary source is **Jobicy Remote Jobs API** (free, public GET, no API key required, reliable JSON format, active dev/tech listings). Remotive is identified as an optional fallback.
- **D-03:** Both feeds are normalized on the backend into a unified `UnifiedJobDTO` (id, title, company, location, salary, url, source, description, skillsFound).

### 2. Deduplication Strategy
- **D-04:** Deduplication performed in memory prior to scoring:
  - Normalization key: lowercase clean title (strip punctuation) + lowercase company name.
  - If a job appears in both sources, preserve the richer description and valid direct URL.

### 3. Transparent Relevance Scoring Formula
- **D-05:** Relevance score is strictly evaluated and computed (never hardcoded, no synthetic guarantees):
  - **Skill / Interest Match (50% weight):** Matches extracted keywords from user's `OnboardingProfile.interests` and `User.preferredCareer` against job title & description.
  - **Role / Title Alignment (30% weight):** Exact or fuzzy containment of `preferredCareer` or target title keyword in `job.title`.
  - **Location / Eligibility (20% weight):** Matches user location/preference or "Remote" / "Worldwide" eligibility.
  - Final score: `0.0` to `1.0` (rendered as `0%` to `100%`).
- **D-06:** ≥80% is an evaluation threshold: jobs matching title + at least 2 primary skills will naturally score ≥80% without manual spoofing.
- **D-07:** Match explanations explicitly articulate reasons:
  - Example: *"Matched skills: Java, Spring Boot • Title matches target career 'Java Developer' • Location eligible (Remote)"*.

### 4. Integration & UI Unification
- **D-08:** Unify the disparate "Search" and "Recommended" flows:
  - `RecommendationService` is upgraded to invoke multi-source fetching with user profile context.
  - In Castle UI, search results include the calculated relevance badge, matched terms, and explanation inline alongside salary and company.
  - Existing "Save Job" (`/api/saved-jobs`) and "Applications" (`/api/applications`) flows preserved with zero breaking schema changes.
- **D-09:** Keep backend on port `8081` and avoid any changes to database configuration.

### 5. Verification Protocol
- **D-10:** Verify via:
  1. Unit test for multi-source deduplication and relevance scoring logic.
  2. Integration check verifying Adzuna + Jobicy aggregation.
  3. UI inspection in Castle: search execution, relevance badge display, explanation visibility, valid outbound link clicks, save-job persistence.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` — Requirements `CAST-01` through `CAST-09`
- `.planning/ROADMAP.md` — Phase 2 Success Criteria & Scope boundaries

### Existing Services & Entities
- `backend/src/main/java/com/realmcheck/backend/service/AdzunaService.java` — Adzuna client
- `backend/src/main/java/com/realmcheck/backend/service/RecommendationService.java` — Current heuristic scoring
- `backend/src/main/java/com/realmcheck/backend/util/KeywordUtil.java` — Term extraction
- `backend/src/main/java/com/realmcheck/backend/entity/OnboardingProfile.java` — User profile interests/goals
- `frontend/src/pages/Castle.tsx` — Castle career center UI
- `frontend/src/services/SavedJobService.ts` — Existing saved jobs API client

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `KeywordUtil.java`: Can be extended to calculate multi-factor scoring (title, skills, location).
- `SavedJobController` & `SavedJobRepository`: Fully functional; Castle UI already calls `saveJob()`.
- `Castle.tsx`: Already has full tabs for Search, Saved, Applications, and Recommended. Needs unifying so search results show the recommendation badges.

### Established Patterns
- Spring Web `RestTemplate` for third-party calls.
- DTO mapping before serialization to frontend.

### Integration Points
- Backend endpoint: Update `/api/recommendations/jobs` and `/api/adzuna/search` or create a consolidated `/api/jobs/search` that returns `RecommendationDTO` with multi-source aggregated jobs.

</code_context>

<specifics>
## Specific Ideas
- Target for demo: Search for "Java Developer" or "React Developer" returns diverse listings with 80%+ match badges showing green, clear skill tags, and valid clickable job links.
</specifics>

<deferred>
## Deferred Ideas
- Real-time scrape of LinkedIn/Indeed (too fragile / blocked without paid proxies).
- AI embedding-based semantic job search (defer to post-demo).
</deferred>

---
*Phase: 2-Castle Multi-Source Job Matching*
*Context gathered: 2026-10-13*
