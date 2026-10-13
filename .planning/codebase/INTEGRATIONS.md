---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# INTEGRATIONS.md — External APIs & Services

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## External API Integrations

### 1. Adzuna Jobs API

- **Purpose:** Job search results for career recommendations
- **Backend Service:** `backend/src/main/java/com/realmcheck/backend/service/AdzunaService.java`
- **Frontend Service:** `frontend/src/services/AdzunaService.ts`
- **Endpoint:** `https://api.adzuna.com/v1/api/jobs/in/search/1`
- **Auth:** Query params `app_id` + `app_key`
- **Config:** `adzuna.properties` and `.env` (`ADZUNA_APP_ID`, `ADZUNA_APP_KEY`)
- **Results:** 20 per page, supports keyword + location filter
- **Error handling:** Returns `{"results":[]}` if keys not configured

### 2. Apify / Class Central Course Scraper

- **Purpose:** Course discovery — scrapes Class Central search results
- **Backend Service:** `backend/src/main/java/com/realmcheck/backend/service/ApifyService.java`
- **Frontend Service:** `frontend/src/services/courseApi.ts`
- **Endpoint:** `https://api.apify.com/v2/acts/powerai~classcentral-search-scraper/run-sync-get-dataset-items`
- **Auth:** Bearer token via query param (`?token=...`)
- **Config:** `APIFI_API_TOKEN` in `.env` (note: typo in property key — `APIFI` vs `APIFY`)
- **Payload:** `{ searchUrl, maxItems: 20 }`
- **HTTP method:** POST (sync run — blocks until actor completes)

### 3. BodhDisha Education API

- **Purpose:** Scholarships, exams, colleges, universities data
- **Backend Service:** `backend/src/main/java/com/realmcheck/backend/service/BodhDishaService.java`
- **Frontend Services:** `frontend/src/services/scholarshipApi.ts`, `frontend/src/services/educationApi.ts`
- **Base URL:** `https://bodhdisha.com/api/v1`
- **Endpoints:**
  - `GET /scholarships`
  - `GET /exams`
  - `GET /colleges`
  - `GET /universities`
- **Auth:** `Authorization: Bearer {BODHDISHA_API_KEY}`
- **Config:** `BODHDISHA_API_KEY` in `.env`

### 4. RSS Feed Service

- **Purpose:** News / content aggregation
- **Backend Controller:** `RssController.java`
- **Frontend Service:** `frontend/src/services/RssService.ts`

---

## Internal API (Backend → Frontend)

### Base URL (dev)

`http://localhost:8081`

### API Groups

| Prefix | Controller | Description |
|---|---|---|
| `/api/auth/**` | `AuthController.java` | Register, login — public |
| `/api/users/**` | `UserController.java` | User stats, mood update |
| `/api/player/**` | — | Player stats (XP, level, streak) |
| `/api/quests/**` | `QuestController.java` | Quest CRUD, completion |
| `/api/recommendations/**` | `RecommendationController.java` | Job recommendations (auth required) |
| `/api/onboarding/**` | `OnboardingController.java` | Onboarding profile setup (auth required) |
| `/api/savings/**` | `SavingsController.java` | Savings transactions |
| `/api/journal/**` | `JournalController.java` | Journal entries |
| `/api/study/**` | `StudyService.java` | Study sessions |
| `/api/workout/**` | `WorkoutController.java` | Workout tracking |
| `/api/courses/**` | `CourseController.java` | Course search via Apify |
| `/api/scholarships/**` | `ScholarshipController.java` | Scholarships via BodhDisha |
| `/api/exams/**` | `ExamController.java` | Exams via BodhDisha |
| `/api/jobs/search` | — | Job search via Adzuna |
| `/api/saved-jobs/**` | `SavedJobController.java` | Saved jobs |
| `/api/rss/**` | `RssController.java` | RSS feed proxy |

### Authentication

- **Mechanism:** Mock JWT filter (`MockJwtAuthenticationFilter`)
- **Token:** Hardcoded `mock-jwt-token-123` for development
- **Storage (frontend):** `localStorage.getItem('authToken')`
- **Header:** `Authorization: Bearer {token}`
- **Note:** Not production-ready — no real JWT signing/verification

### CORS Config

- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: allowed

---

## Database

### PostgreSQL

- **Host (local dev):** `localhost:5432`
- **Host (Docker):** `localhost:5433` (port-forwarded)
- **Database:** `realmcheck`
- **Schema Tables:** `users`, `onboarding_profiles`, `skills`, `user_skills` (from `schema.sql`)
- **JPA-managed tables (via entities):** `courses`, `course_progress`, `exams`, `job_applications`, `journal_entries`, `library_items`, `onboarding_profiles`, `quests`, `quest_completions`, `saved_jobs`, `savings_transactions`, `scholarships`, `study_sessions`, `workouts`

---

## Frontend Service Modules

| File | Backend Endpoint |
|---|---|
| `UserService.ts` | `/api/users`, `/api/player/stats` |
| `QuestService.ts` | `/api/quests` |
| `SavingsService.ts` | `/api/savings` |
| `JournalService.ts` | `/api/journal` |
| `StudyService.ts` | `/api/study` |
| `WorkoutService.ts` | `/api/workout` |
| `RecommendationService.ts` | `/api/recommendations/jobs` |
| `ApplicationService.ts` | `/api/saved-jobs` |
| `SavedJobService.ts` | `/api/saved-jobs` |
| `AdzunaService.ts` | `/api/jobs/search` |
| `courseApi.ts` | `/api/courses/search` |
| `educationApi.ts` | `/api/exams`, `/api/scholarships` |
| `scholarshipApi.ts` | `/api/scholarships` |
| `ExamService.ts` | `/api/exams` |
| `RssService.ts` | `/api/rss` |

---

*Integrations analysis: 2026-10-13*
