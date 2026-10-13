---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# STRUCTURE.md — Directory Layout & Organization

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## Repository Root

```
RC 2.0/
├── backend/                    # Spring Boot application
├── frontend/                   # React + Vite SPA
├── docker-compose.yml          # PostgreSQL Docker setup
└── .planning/                  # GSD planning artifacts
    ├── PROJECT.md
    └── codebase/               # This codebase map
```

---

## Backend Structure

```
backend/
├── pom.xml                     # Maven build descriptor
├── mvnw / mvnw.cmd             # Maven wrapper scripts
├── .gitignore
├── .mvn/
│   └── wrapper/
└── src/
    ├── main/
    │   ├── java/com/realmcheck/backend/
    │   │   ├── BackendApplication.java         # @SpringBootApplication entry point
    │   │   ├── config/
    │   │   │   └── GameConfig.java             # Binds application.yml game: block
    │   │   ├── controller/                     # REST Controllers
    │   │   │   ├── AuthController.java         # POST /api/auth/register, /login
    │   │   │   ├── CourseController.java        # GET /api/courses
    │   │   │   ├── ExamController.java          # GET /api/exams
    │   │   │   ├── JournalController.java       # CRUD /api/journal
    │   │   │   ├── OnboardingController.java    # POST /api/onboarding
    │   │   │   ├── PlayerController.java        # GET /api/player/stats
    │   │   │   ├── QuestController.java         # CRUD /api/quests
    │   │   │   ├── RecommendationController.java# GET /api/recommendations/jobs
    │   │   │   ├── RssController.java           # GET /api/rss
    │   │   │   ├── SavedJobController.java      # CRUD /api/saved-jobs
    │   │   │   ├── SavingsController.java       # CRUD /api/savings
    │   │   │   ├── ScholarshipController.java   # GET /api/scholarships
    │   │   │   ├── StudyController.java         # CRUD /api/study
    │   │   │   ├── UserController.java          # GET /api/users/{id}, PUT mood
    │   │   │   └── WorkoutController.java       # CRUD /api/workout
    │   │   ├── dto/                            # Data Transfer Objects
    │   │   │   ├── AuthRequest.java
    │   │   │   ├── AuthResponse.java
    │   │   │   ├── CourseDTO.java
    │   │   │   ├── EducationRecommendationDTO.java
    │   │   │   ├── ExamDTO.java
    │   │   │   ├── JournalEntryDTO.java
    │   │   │   ├── OnboardingRequest.java
    │   │   │   ├── PlayerStats.java
    │   │   │   ├── QuestDTO.java
    │   │   │   ├── RecommendationDTO.java
    │   │   │   ├── SavingsTransactionDTO.java
    │   │   │   ├── ScholarshipDTO.java
    │   │   │   ├── StudySessionDTO.java
    │   │   │   └── WorkoutDTO.java
    │   │   ├── entity/                         # JPA Entities
    │   │   │   ├── Course.java
    │   │   │   ├── CourseProgress.java
    │   │   │   ├── Exam.java
    │   │   │   ├── JobApplication.java
    │   │   │   ├── JournalEntry.java
    │   │   │   ├── LibraryItem.java
    │   │   │   ├── OnboardingProfile.java
    │   │   │   ├── Quest.java
    │   │   │   ├── QuestCompletion.java
    │   │   │   ├── SavedJob.java
    │   │   │   ├── SavingsTransaction.java
    │   │   │   ├── Scholarship.java
    │   │   │   ├── StudySession.java
    │   │   │   ├── User.java
    │   │   │   └── Workout.java
    │   │   ├── repository/                     # Spring Data JPA Repositories
    │   │   │   ├── CourseProgressRepository.java
    │   │   │   ├── CourseRepository.java
    │   │   │   ├── ExamRepository.java
    │   │   │   ├── JobApplicationRepository.java
    │   │   │   ├── JournalEntryRepository.java
    │   │   │   ├── OnboardingProfileRepository.java
    │   │   │   ├── QuestCompletionRepository.java
    │   │   │   ├── QuestRepository.java
    │   │   │   ├── SavedJobRepository.java
    │   │   │   ├── SavingsTransactionRepository.java
    │   │   │   ├── ScholarshipRepository.java
    │   │   │   ├── StudySessionRepository.java
    │   │   │   ├── UserRepository.java
    │   │   │   └── WorkoutRepository.java
    │   │   ├── security/                       # Auth & Security
    │   │   │   ├── MockJwtAuthenticationFilter.java      # Hardcoded token filter (MVC)
    │   │   │   ├── MockJwtAuthenticationWebFilter.java   # Hardcoded token filter (WebFlux)
    │   │   │   ├── WebSecurityConfig.java               # MVC security chain + CORS
    │   │   │   └── WebFluxSecurityConfig.java           # WebFlux security chain
    │   │   ├── service/                        # Business Logic
    │   │   │   ├── AdzunaService.java          # Adzuna Jobs API client
    │   │   │   ├── ApifyService.java           # Apify/ClassCentral course scraper
    │   │   │   ├── BodhDishaService.java       # BodhDisha education data client
    │   │   │   ├── CourseService.java
    │   │   │   ├── EducationRecommendationService.java
    │   │   │   ├── ExamService.java
    │   │   │   ├── GameProgressService.java    # XP/level progression engine
    │   │   │   ├── JournalEntryService.java
    │   │   │   ├── QuestService.java           # Quest lifecycle + completion tracking
    │   │   │   ├── RecommendationService.java  # Keyword-based job matching
    │   │   │   ├── SavingsTransactionService.java
    │   │   │   ├── ScholarshipService.java
    │   │   │   ├── StudyService.java (implied)
    │   │   │   ├── UserService.java
    │   │   │   └── WorkoutService.java
    │   │   └── util/
    │   │       └── KeywordUtil.java            # Adzuna JSON parsing + keyword matching
    │   └── resources/
    │       ├── application.properties          # Main Spring config
    │       ├── application.yml                 # Game mechanics config
    │       ├── adzuna.properties               # Adzuna API keys
    │       ├── .env                            # All API tokens
    │       ├── schema.sql                      # Initial DB schema (Docker seed)
    │       ├── static/                         # Static files (empty)
    │       └── templates/                      # Thymeleaf templates (empty)
    └── test/
        └── java/com/realmcheck/backend/        # Test files
```

---

## Frontend Structure

```
frontend/
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── .oxlintrc.json              # Linting rules
├── index.html                  # Vite HTML entry point
├── README.md
├── dist/                       # Build output (not committed)
├── node_modules/
└── src/
    ├── main.tsx                # React entry point (renders <App />)
    ├── App.tsx                 # Router + all route declarations
    ├── App.css
    ├── index.css               # Global styles + Tailwind directives
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── components/
    │   ├── Toast.tsx           # Global toast notification system
    │   ├── TopHud.tsx          # Top HUD bar
    │   ├── WizardDialogue.tsx  # Wizard dialogue (root-level, possibly duplicate)
    │   └── realm/              # Realm-specific overlay components
    │       ├── LocationNode.tsx        # Clickable map location card
    │       ├── ProfilePanel.tsx        # User profile avatar/level panel
    │       ├── RealmEnvironment.tsx    # SVG/decorative background
    │       ├── RPGHud.tsx              # XP bar, health, streak HUD
    │       ├── SideMenu.tsx            # Slide-out navigation menu
    │       └── WizardDialogue.tsx      # Wizard NPC dialogue (realm-specific)
    ├── pages/                  # Route-level page components
    │   ├── Login.tsx           # /login
    │   ├── Onboarding.tsx      # /onboarding
    │   ├── RealmReady.tsx      # /realm-ready (post-onboarding transition)
    │   ├── RealmDashboard.tsx  # /realm (main map view)
    │   ├── Castle.tsx          # /castle
    │   ├── Library.tsx         # /library
    │   ├── Pond.tsx            # /pond (journal)
    │   ├── Treasure.tsx        # /treasure (finance)
    │   ├── Garden.tsx          # /garden (fitness)
    │   ├── Arena.tsx           # /arena (exams)
    │   ├── WizardHouse.tsx     # /wizard
    │   ├── PetCompanion.tsx    # /pet
    │   └── LocationsPlaceholder.tsx  # Placeholder for unbuilt locations
    ├── services/               # HTTP API abstraction layer
    │   ├── UserService.ts
    │   ├── QuestService.ts
    │   ├── SavingsService.ts
    │   ├── JournalService.ts
    │   ├── StudyService.ts
    │   ├── WorkoutService.ts
    │   ├── RecommendationService.ts
    │   ├── ApplicationService.ts
    │   ├── SavedJobService.ts
    │   ├── AdzunaService.ts
    │   ├── courseApi.ts
    │   ├── educationApi.ts
    │   ├── scholarshipApi.ts
    │   ├── ExamService.ts
    │   └── RssService.ts
    └── types/
        └── Workout.ts          # Shared TypeScript type definitions
```

---

## Naming Conventions

### Backend

- **Packages:** `com.realmcheck.backend.{layer}`
- **Classes:** PascalCase — `QuestController`, `RecommendationService`
- **Methods:** camelCase — `getQuestsByUserId`, `completeQuest`
- **Entities:** Singular noun — `Quest`, `User`, `JournalEntry`
- **DTOs:** Named with `DTO` suffix — `QuestDTO`, `RecommendationDTO`
- **Repositories:** Entity name + `Repository` — `QuestRepository`
- **Endpoints:** Plural noun, kebab-case — `/api/saved-jobs`, `/api/quests`

### Frontend

- **Components:** PascalCase `.tsx` — `RPGHud.tsx`, `ProfilePanel.tsx`
- **Services:** PascalCase or camelCase `.ts` — `QuestService.ts`, `courseApi.ts` (mixed)
- **Pages:** PascalCase `.tsx` — `RealmDashboard.tsx`
- **Routes:** Kebab-case paths — `/realm-ready`, `/wizard`, `/pond`
- **Interfaces:** Declared inline in service files (no separate `types/` except `Workout.ts`)

---

## Key File Locations

| Artifact | Location |
|---|---|
| Backend main class | `backend/src/main/java/com/realmcheck/backend/BackendApplication.java` |
| Database schema seed | `backend/src/main/resources/schema.sql` |
| Game mechanics config | `backend/src/main/resources/application.yml` |
| API keys | `backend/src/main/resources/.env` |
| Frontend router | `frontend/src/App.tsx` |
| Tailwind theme | `frontend/tailwind.config.js` |
| Global CSS | `frontend/src/index.css` |

---

*Structure analysis: 2026-10-13*
