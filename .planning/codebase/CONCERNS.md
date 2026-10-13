---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# CONCERNS.md — Technical Debt & Known Issues

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## 🔴 Critical — Security

### 1. API Keys Committed to Version Control

- **File:** `backend/src/main/resources/.env` and `adzuna.properties`
- **Issue:** Real API credentials stored in tracked files:
  - `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` in `adzuna.properties`
  - `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `APIFI_API_TOKEN`, `BODHDISHA_API_KEY` in `.env`
- **Risk:** Anyone with repo access can extract live API keys
- **Fix:** Add `.env` and `adzuna.properties` to `.gitignore`, use environment variables or a secrets manager

### 2. Hardcoded Mock JWT Token

- **File:** `backend/src/main/java/com/realmcheck/backend/security/MockJwtAuthenticationFilter.java`
- **Issue:** Authentication uses a hardcoded static token `mock-jwt-token-123`. Anyone who knows this token has full `ROLE_USER` access.
- **Risk:** The app has no real auth. This is explicitly for prototyping but must not go to production.
- **Fix:** Implement real JWT (e.g., `jjwt` library) with signed tokens, expiry, and secret rotation

### 3. Hardcoded Database Credentials in Config

- **File:** `backend/src/main/resources/application.properties`
- **Issue:** `spring.datasource.username=postgres` and `spring.datasource.password=1234`
- **Risk:** Weak password; credentials in source control
- **Fix:** Move to environment variables

### 4. Wildcard CORS (`@CrossOrigin(origins = "*")`)

- **Files:** `UserController.java`, `QuestController.java` (likely all controllers)
- **Issue:** Both per-controller wildcard CORS and a proper whitelist in `WebSecurityConfig` exist simultaneously. The wildcard overrides the whitelist for those controllers.
- **Risk:** Cross-origin requests accepted from any domain on those endpoints
- **Fix:** Remove `@CrossOrigin` annotations from controllers; rely solely on `WebSecurityConfig` CORS config

### 5. Blanket API Permit-All

- **File:** `backend/src/main/java/com/realmcheck/backend/security/WebSecurityConfig.java` (line 57)
- **Issue:** `.requestMatchers("/api/**").permitAll()` — all API endpoints except `/api/onboarding/**` and `/api/recommendations/**` are publicly accessible without auth
- **Risk:** User data (journal, savings, workouts) accessible without authentication
- **Fix:** Remove the blanket `permitAll`, secure each endpoint explicitly

---

## 🟠 High — Architecture

### 6. Dual Web Stack (MVC + WebFlux) Conflict

- **Files:** `WebSecurityConfig.java` (MVC) + `WebFluxSecurityConfig.java` (empty, 0 bytes) + both `MockJwt*` filter variants
- **Issue:** Spring Boot with both `spring-boot-starter-webmvc` and `spring-boot-starter-webflux` on classpath creates a non-standard hybrid stack. WebFlux was added (for `WebClient`/`WebTestClient`) but the actual HTTP serving is done by MVC.
- **Risk:** Unexpected behavior; security config confusion; deployment issues
- **Fix:** Remove WebFlux dependency unless reactive endpoints are actually needed. Use `RestClient` (Spring 6.1+) instead of `WebClient` for non-blocking HTTP client calls.

### 7. DTO Mapping Inline in Controllers

- **Files:** `QuestController.java` and likely all other controllers
- **Issue:** `toDTO()` / `toEntity()` methods duplicated inside each controller. No shared mapper.
- **Risk:** Code duplication; mapping bugs diverge per-controller
- **Fix:** Extract mappers to a dedicated mapper class per domain, or use MapStruct

### 8. No Custom Exception Handling

- **Issue:** `RuntimeException("Quest not found")` propagates as HTTP 500
- **Risk:** Poor API contract; leaks stack traces to client; no 404 distinction from 500
- **Fix:** Add `@ControllerAdvice` with `@ExceptionHandler` for typed exceptions (`ResourceNotFoundException`, etc.)

### 9. Gold Award Placeholder (Incomplete Feature)

- **File:** `backend/src/main/java/com/realmcheck/backend/service/QuestService.java` (lines 64, 83)
- **Issue:** `// Gold award only` comments left in `completeQuest()` — indicates a planned gold/currency system that was never implemented
- **Risk:** Incomplete feature silently does nothing

---

## 🟡 Medium — Code Quality

### 10. `System.out.println` Debug Logging in Security Config

- **File:** `backend/src/main/java/com/realmcheck/backend/security/WebSecurityConfig.java`
- **Issue:** CSRF matchers contain verbose `System.out.println` for every request — prints URI, method, and match result to stdout
- **Risk:** Log pollution in production; performance overhead on every request
- **Fix:** Remove or replace with `LOG.debug()`

### 11. No Global Base URL in Frontend

- **Files:** All `frontend/src/services/*.ts`
- **Issue:** `http://localhost:8081` hardcoded in every service file (~15 files)
- **Risk:** Any port or host change requires editing 15+ files
- **Fix:** Create a shared `frontend/src/config/api.ts` with `export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081'`

### 12. Mixed HTTP Clients (`fetch` vs `axios`)

- **Files:** Frontend service modules
- **Issue:** `axios` installed but most services use native `fetch`. No interceptor pattern for auth headers.
- **Risk:** Auth token injection (localStorage) duplicated across services; inconsistent error handling
- **Fix:** Adopt one client with a shared interceptor/wrapper

### 13. Duplicate WizardDialogue Component

- **Files:** `frontend/src/components/WizardDialogue.tsx` and `frontend/src/components/realm/WizardDialogue.tsx`
- **Issue:** Two files with the same name in different directories — unclear which is canonical
- **Risk:** One gets updated, the other stagnates
- **Fix:** Remove the root-level duplicate; use only `realm/WizardDialogue.tsx`

### 14. Manual Getters/Setters on `User` Entity (92 lines)

- **File:** `backend/src/main/java/com/realmcheck/backend/entity/User.java`
- **Issue:** Lombok is installed but `User.java` manually writes all getters/setters
- **Risk:** Boilerplate error-prone; new fields require 3 new lines each
- **Fix:** Add `@Data` or `@Getter @Setter` to `User.java`

### 15. Status Fields as Strings Instead of Enums

- **Files:** `Quest.java`, `QuestService.java`, frontend `QuestService.ts`
- **Issue:** Quest status uses `"AVAILABLE"`, `"ACTIVE"`, `"COMPLETED"`, `"FAILED"` as raw strings
- **Risk:** Typos cause silent failures; no compile-time safety
- **Fix:** Create a Java `enum QuestStatus` and TypeScript `type QuestStatus`

### 16. Typo in Property Key

- **File:** `backend/src/main/resources/application.properties` (line 21)
- **Issue:** `apify.api.token=${APIFI_API_TOKEN}` — `APIFI` vs `APIFY` typo. The `.env` file uses `APIFI_API_TOKEN` matching the typo, so it works — but is confusing.
- **Risk:** Future devs may create `APIFY_API_TOKEN` and wonder why it doesn't work

---

## 🟡 Medium — Performance

### 17. Synchronous Blocking External API Calls

- **Files:** `AdzunaService.java`, `ApifyService.java`, `BodhDishaService.java`
- **Issue:** All 3rd-party API calls use `RestTemplate` (blocking). Apify's `run-sync-get-dataset-items` can take 30–60 seconds.
- **Risk:** Thread pool exhaustion under concurrent load; timeouts block Tomcat threads
- **Fix:** Use `RestClient` or `WebClient` with async/reactive patterns, or offload to a background job

### 18. Adzuna Recommendation Query Sends No Filters

- **File:** `backend/src/main/java/com/realmcheck/backend/service/RecommendationService.java` (line 80)
- **Issue:** `adzunaService.searchJobs(null, null)` — fetches generic jobs with no keyword filter, then scores in-memory
- **Risk:** 20 jobs returned total; scoring on a small pool limits recommendation quality
- **Fix:** Pass extracted keywords to Adzuna query params for server-side filtering

### 19. Health Field Static in Frontend HUD

- **File:** `frontend/src/components/realm/RPGHud.tsx` (line 31)
- **Issue:** Health bar is hardcoded `100/100` — not fetched from backend despite `User.health` existing in the entity
- **Risk:** Misleading UI

---

## 🟢 Low — Minor

### 20. No `.gitignore` for Secrets at Root

- **Issue:** No root-level `.gitignore` entry for `*.env` or `*.properties` (only backend and frontend have their own `.gitignore`)
- **Fix:** Add root `.gitignore` that excludes `**/.env`, `**/adzuna.properties`

### 21. `schema.sql` is Partial

- **File:** `backend/src/main/resources/schema.sql`
- **Issue:** Only defines `users`, `onboarding_profiles`, `skills`, `user_skills` with comment "Placeholder schemas for remaining tables to avoid errors". All other tables (`quests`, `journal_entries`, `savings_transactions`, etc.) rely on JPA `ddl-auto=update`.
- **Risk:** Docker container initialization only creates 4 tables; JPA auto-creates the rest on first start — different schema than schema.sql

### 22. `spring.jpa.show-sql=true` in Production Config

- **File:** `backend/src/main/resources/application.properties`
- **Issue:** SQL logging enabled in the main config (not just test)
- **Risk:** Verbose SQL output in production logs

### 23. `dist/` Directory Possibly Committed

- **File:** `frontend/dist/` directory exists
- **Issue:** Build artifacts in the repo
- **Fix:** Ensure `dist/` is in `frontend/.gitignore`

---

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 5 |
| 🟠 High | 4 |
| 🟡 Medium | 9 |
| 🟢 Low | 4 |
| **Total** | **22** |

---

*Concerns analysis: 2026-10-13*
