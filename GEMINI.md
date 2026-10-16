<!-- GSD:project-start source:PROJECT.md -->

## Project

**Realm Check 2.0**

Realm Check 2.0 is a gamified personal finance and education recommendation platform where users explore a fantasy realm map to access real-world tools — job search (Castle), scholarships and resources (Library), journaling (Pond), fitness (Garden), exam prep (Arena), finance management (Treasure), AI guidance (Wizard), and a pet companion. It targets students and early-career users who need structured help with career, learning, and financial decisions, delivered through an engaging RPG interface.

**Core Value:** A student completes onboarding, explores the realm, finds relevant job matches in the Castle, gets scholarship recommendations in the Library, and tracks savings in Treasure — all in one cohesive, demo-ready session.

### Constraints

- **Tech Stack:** Spring Boot 4.1.1 / Java 21 / React 19 — must not change frameworks
- **Port:** Backend must stay on 8081 — hardcoded in 15 frontend service files
- **Demo Deadline:** All work must be shippable by tomorrow
- **Risk Tolerance:** Low — prefer targeted fixes over broad refactoring
- **Auth:** Do not change authentication mechanism; mock JWT preserved
- **API Keys:** Move to `.env` / environment variables only; no new secrets management system

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

| Language | Version | Used In |
|---|---|---|
| Java | 21 | Backend (Spring Boot) |
| TypeScript | ~6.0.2 | Frontend (React/Vite) |
| SQL | — | PostgreSQL schema |

## Backend Stack

### Framework

- **Spring Boot** `4.1.1` (parent BOM)
- **Spring Web MVC** (`spring-boot-starter-webmvc`) — REST controllers
- **Spring WebFlux** (`spring-boot-starter-webflux`) — Reactive HTTP client used internally
- **Spring Data JPA** (`spring-boot-starter-data-jpa`) — ORM / persistence
- **Spring Security** (`spring-boot-starter-security`) — Auth filter chain

### Database

- **PostgreSQL** (runtime driver `org.postgresql:postgresql`)
- JPA with **Hibernate** dialect: `PostgreSQLDialect`
- DDL auto: `update` (schema managed by Hibernate, `schema.sql` used for initial Docker seed)

### Libraries

- **Lombok** `1.18.30` — boilerplate reduction (provided scope)
- **Jackson Databind** `2.17.0` — JSON serialization/deserialization

### Build

- **Maven** with Maven Wrapper (`mvnw.cmd`)
- Plugin: `spring-boot-maven-plugin`

### Runtime Config

- Server port: **8081** (`server.port=8081`)
- Datasource: `jdbc:postgresql://localhost:5432/realmcheck` (local dev)
- DB credentials: username `postgres`, password `1234`

## Frontend Stack

### Framework

- **React** `^19.2.8` + **React DOM** `^19.2.8`
- **React Router DOM** `^7.18.4` — client-side routing (13 routes)

### Build Tooling

- **Vite** `^8.3.0` — dev server & bundler
- **TypeScript** `~6.0.2`
- **@vitejs/plugin-react** `^6.1.1`

### Styling

- **Tailwind CSS** `^3.4.19`
- **PostCSS** + **Autoprefixer**
- Custom fonts/theme via `App.css` and `index.css`

### UI Libraries

- **Framer Motion** `^13.4.0` — animations
- **Lucide React** `^1.48.0` — icon set

### HTTP Client

- **Axios** `^1.20.0` — some service modules
- Native **`fetch` API** — most service modules (mixed usage)

### Linting

- **oxlint** `^1.81.0` (configured via `frontend/.oxlintrc.json`)

### Dev Server Port

- Default Vite: **5173** (CORS whitelist on backend includes `http://localhost:5173`)

## Infrastructure

### Docker Compose

- **postgres:15** — database container
- No backend or frontend container defined yet (local JVM + Vite dev only)

## Configuration Files

| File | Purpose |
|---|---|
| `backend/src/main/resources/application.properties` | Primary Spring config, datasource, port, API keys via env vars |
| `backend/src/main/resources/application.yml` | Game mechanics config (XP, levels, health, streaks) |
| `backend/src/main/resources/adzuna.properties` | Adzuna API credentials (app_id + app_key) |
| `backend/src/main/resources/.env` | All API tokens (Adzuna, Apify, BodhDisha) |
| `frontend/vite.config.ts` | Vite build config |
| `frontend/tailwind.config.js` | Tailwind theme |
| `frontend/tsconfig.json` | TypeScript project config |
| `docker-compose.yml` | PostgreSQL container setup |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Backend (Java / Spring Boot)

### Code Style

- **Java version:** 21 (records/sealed classes available but not yet used)
- **No automatic formatter config** found (no `.editorconfig`, no Checkstyle, no Google Java Format)
- Indentation: Mixed — tabs in generated code (pom.xml), spaces in handwritten Java
- **Lombok used minimally** — only `@Value`/`@Service`/`@Autowired` annotations, no `@Data` or `@Builder` observed. Manual getters/setters in `User.java`

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Classes | PascalCase | `QuestService`, `RecommendationDTO` |
| Methods | camelCase | `completeQuest`, `getQuestsByUserId` |
| Variables | camelCase | `questRepository`, `appKey` |
| Constants | UPPER_SNAKE | `MOCK_TOKEN`, `BASE_URL` |
| Packages | lowercase | `com.realmcheck.backend.service` |
| REST endpoints | `/api/{plural-noun}` | `/api/quests`, `/api/saved-jobs` |
| DB tables | snake_case plural | `users`, `quest_completions` |
| DB columns | snake_case | `user_id`, `password_hash` |

### Annotation Patterns

- Controllers: `@RestController` + `@RequestMapping` + `@CrossOrigin(origins = "*")`
- Services: `@Service`
- Repositories: `interface extends JpaRepository<Entity, ID>`
- Transactional: `@Transactional` on mutating service methods
- Config injection: `@Value("${property.key:defaultValue}")` (with default fallback)
- Constructor injection preferred in services (over `@Autowired` on fields) in newer code
- `@Autowired` on fields still used in older controllers (`UserController`)

### Error Handling Patterns

- **Service layer:** `orElseThrow(() -> new RuntimeException("..."))` — no custom exception types
- **External API services:** `try/catch (Exception e)` → return empty/error JSON string or map
- **Controllers:** Return `ResponseEntity.ok(data)` or `ResponseEntity.notFound().build()`
- No global `@ControllerAdvice` / `@ExceptionHandler` found — errors propagate as 500s
- Logging: SLF4J `Logger` used in `RecommendationService`; `System.out.println` used in security config (debug leftover)

### DTO Mapping

- Mapped inline in controller methods (`toDTO()`, `toEntity()`) — e.g., `QuestController`
- No MapStruct or ModelMapper used
- Creates code duplication across controllers

### Data Models

- Entities: Plain JPA (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`) — no Lombok `@Data`
- All getters/setters written manually (long boilerplate in `User.java` — 92 lines)
- `@PreUpdate` lifecycle hook used in `User` for `updatedAt`
- Status fields use String enums: `"AVAILABLE"`, `"ACTIVE"`, `"COMPLETED"`, `"FAILED"` — not Java `enum` types

## Frontend (TypeScript / React)

### TypeScript Config

### Component Conventions

- All components: `const ComponentName: React.FC = () => { ... }` — explicit `React.FC` typing
- Exports: default export at bottom of file
- Props: inline `interface` in same file (no separate `*.types.ts` per component)
- Styling: Tailwind CSS utility classes inline in JSX — no separate CSS modules
- Animations: Framer Motion `motion.*` components where needed

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `RPGHud`, `ProfilePanel` |
| Pages | PascalCase | `RealmDashboard`, `WizardHouse` |
| Services | PascalCase or camelCase (mixed) | `QuestService.ts`, `courseApi.ts` |
| Interfaces | PascalCase | `Quest`, `User`, `RecommendationDTO` |
| Functions | camelCase | `getQuests`, `completeQuest` |
| CSS classes | Tailwind utilities | `bg-[#1a1728] border-2 rounded-xl` |

### State Management

- Local `useState` only — no global state manager
- `localStorage` for auth:
- Cross-component events via DOM: `window.dispatchEvent(new Event('player-stats-updated'))`

### Service Module Pattern

- Most services use native `fetch` (not axios despite it being installed)
- Axios used in some services (inconsistency)
- No centralized HTTP client or interceptor
- Error handling: `if (!res.ok) throw new Error(...)` — caller must handle

### Linting

- Tool: **oxlint** (`^1.81.0`)
- Plugins: `react`, `typescript`, `oxc`
- Rules enforced:
- No Prettier or ESLint

## General Observations

- **No consistent API base URL strategy** — `http://localhost:8081` hardcoded across all frontend service files
- **Mixed HTTP clients** — some services use `fetch`, some use `axios`; both installed
- **Duplicate WizardDialogue component** — exists in both `components/` and `components/realm/`
- **`@CrossOrigin(origins = "*")`** on individual controllers AND global CORS config — redundant
- **Debug logging** in production code — `System.out.println` in `WebSecurityConfig` CSRF matchers

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern

- `backend/` — Spring Boot REST API (Java 21, MVC + JPA)
- `frontend/` — React SPA (TypeScript, Vite)

```

```

## Backend Architecture

### Layered Architecture (Standard Spring Boot)

```

```

### Supporting Layers

- **DTO Layer** (`dto/`) — Request/Response objects decoupled from entities
- **Security Layer** (`security/`) — `MockJwtAuthenticationFilter` + `WebSecurityConfig` + `WebFluxSecurityConfig`
- **Config Layer** (`config/`) — `GameConfig.java` (game mechanics from `application.yml`)
- **Util Layer** (`util/`) — `KeywordUtil.java` (keyword extraction and Adzuna result parsing)

### Key Architecture Decisions

## Frontend Architecture

### SPA with React Router

- Entry: `frontend/src/main.tsx` → renders `<App />`
- Router: `BrowserRouter` with 13 declared routes in `frontend/src/App.tsx`
- Default redirect: `/` → `/login`

### Page → Component → Service Pattern

```

```

### State Management

- **No global state manager** (no Redux, Zustand, or Context API at scale)
- State is local (`useState`) at the page level
- Cross-component communication via custom DOM events:
- Auth token stored in `localStorage` under key `authToken`

### RPG Realm Structure (Domain Metaphor)

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

## Data Flow

### Authentication Flow

```

```

### Recommendation Flow

```

```

### Quest/XP Flow

```

```

## Entry Points

| Point | Location |
|---|---|
| Backend main class | `backend/src/main/java/com/realmcheck/backend/BackendApplication.java` (convention) |
| Frontend entry | `frontend/src/main.tsx` |
| Frontend router | `frontend/src/App.tsx` |
| Docker DB init | `docker-compose.yml` + `backend/src/main/resources/schema.sql` |
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-fast` for a trivial task inline, with no subagents and no PLAN.md
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
