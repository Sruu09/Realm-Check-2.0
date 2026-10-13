---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# ARCHITECTURE.md — System Architecture

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## Pattern

**Monorepo with two separate applications:**
- `backend/` — Spring Boot REST API (Java 21, MVC + JPA)
- `frontend/` — React SPA (TypeScript, Vite)

The architecture follows a classic **client-server** pattern with the frontend calling the backend over HTTP REST. No shared module, no monorepo tooling — they are independent build units that happen to be co-located.

```
┌──────────────────────────────────────────────┐
│              Frontend (React SPA)             │
│  React Router → Pages → Service Modules      │
│  http://localhost:5173                        │
└────────────────────┬─────────────────────────┘
                     │ REST over HTTP (fetch / axios)
                     ▼ http://localhost:8081/api/**
┌──────────────────────────────────────────────┐
│            Backend (Spring Boot)              │
│  Controllers → Services → Repositories       │
│  + 3rd-party API clients (Adzuna/Apify/BodD) │
└────────────────────┬─────────────────────────┘
                     │ JDBC (JPA/Hibernate)
                     ▼ jdbc:postgresql://localhost:5432/realmcheck
┌──────────────────────────────────────────────┐
│           PostgreSQL 15 Database              │
│  (Docker container or local instance)         │
└──────────────────────────────────────────────┘
```

---

## Backend Architecture

### Layered Architecture (Standard Spring Boot)

```
Controller Layer (com.realmcheck.backend.controller)
    │  @RestController, @RequestMapping("/api/...")
    │  Receives HTTP requests, validates, maps DTOs, returns ResponseEntity
    ▼
Service Layer (com.realmcheck.backend.service)
    │  @Service, business logic, XP calculation, 3rd party API calls
    │  Depends on Repository and other Services
    ▼
Repository Layer (com.realmcheck.backend.repository)
    │  Spring Data JPA interfaces extending JpaRepository
    │  Auto-generated SQL queries
    ▼
Entity Layer (com.realmcheck.backend.entity)
    │  @Entity JPA objects mapped to DB tables
    ▼
PostgreSQL Database
```

### Supporting Layers

- **DTO Layer** (`dto/`) — Request/Response objects decoupled from entities
- **Security Layer** (`security/`) — `MockJwtAuthenticationFilter` + `WebSecurityConfig` + `WebFluxSecurityConfig`
- **Config Layer** (`config/`) — `GameConfig.java` (game mechanics from `application.yml`)
- **Util Layer** (`util/`) — `KeywordUtil.java` (keyword extraction and Adzuna result parsing)

### Key Architecture Decisions

1. **Dual Security Stack:** Both WebMVC (`WebSecurityConfig`) and WebFlux (`WebFluxSecurityConfig`) security configs exist — Spring WebFlux was added alongside MVC for `WebClient` usage. This is non-standard and potentially conflicting.
2. **Mock JWT:** No real JWT library — auth uses a hardcoded token. Designed for rapid prototyping.
3. **DTO Mapping in Controller:** Entity-to-DTO mapping done inline in controllers (e.g., `QuestController.toDTO()`) rather than via a mapper library (MapStruct). Creates boilerplate.
4. **RestTemplate over WebClient:** Most 3rd-party API calls use `RestTemplate` (sync/blocking), despite WebFlux being on classpath. `WebClient` not used.

---

## Frontend Architecture

### SPA with React Router

- Entry: `frontend/src/main.tsx` → renders `<App />`
- Router: `BrowserRouter` with 13 declared routes in `frontend/src/App.tsx`
- Default redirect: `/` → `/login`

### Page → Component → Service Pattern

```
Pages (src/pages/)          — Route-level components (full screens)
    │
    ├── Components (src/components/)  — Reusable UI (RPGHud, Toast, etc.)
    │       └── realm/               — Realm-specific HUD components
    │
    └── Services (src/services/)     — HTTP API calls (one file per domain)
```

### State Management

- **No global state manager** (no Redux, Zustand, or Context API at scale)
- State is local (`useState`) at the page level
- Cross-component communication via custom DOM events:
  ```typescript
  window.dispatchEvent(new Event('player-stats-updated'));
  ```
- Auth token stored in `localStorage` under key `authToken`

### RPG Realm Structure (Domain Metaphor)

The UI maps game metaphors to feature areas:

| Location | Route | Feature Domain |
|---|---|---|
| Castle | `/castle` | Central hub / user profile |
| Library | `/library` | Scholarships, resources |
| Pond | `/pond` | Digital journal |
| Garden | `/garden` | Fitness & wellness |
| Arena | `/arena` | Exam preparation |
| Treasure | `/treasure` | Finance manager |
| Wizard | `/wizard` | AI guidance |
| Pet | `/pet` | Pet companion |

---

## Data Flow

### Authentication Flow

```
Login Page
  → POST /api/auth/login (username, password)
  → Backend validates, returns mock JWT token
  → Frontend stores token in localStorage
  → Subsequent requests include Authorization: Bearer {token}
```

### Recommendation Flow

```
User completes Onboarding (POST /api/onboarding)
  → OnboardingProfile saved with interests (JSONB) + goals (JSONB)
  → GET /api/recommendations/jobs
  → RecommendationService extracts keywords from OnboardingProfile
  → Calls AdzunaService.searchJobs(null, null) — no filters
  → Scores jobs by keyword match (title 0.5, location 0.3, company 0.2)
  → Returns sorted RecommendationDTO[]
```

### Quest/XP Flow

```
User completes quest (PUT /api/quests/{id}/complete)
  → QuestService.completeQuest(id)
  → GameProgressService.addXp(user, amount)
  → XP accumulated, level up check (base 100 XP × 1.25^(level-1))
  → Frontend fires 'player-stats-updated' DOM event
  → RPGHud re-fetches player stats
```

---

## Entry Points

| Point | Location |
|---|---|
| Backend main class | `backend/src/main/java/com/realmcheck/backend/BackendApplication.java` (convention) |
| Frontend entry | `frontend/src/main.tsx` |
| Frontend router | `frontend/src/App.tsx` |
| Docker DB init | `docker-compose.yml` + `backend/src/main/resources/schema.sql` |

---

*Architecture analysis: 2026-10-13*
