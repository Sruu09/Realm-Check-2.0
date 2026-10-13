---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# CONVENTIONS.md — Code Style & Conventions

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

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

---

## Frontend (TypeScript / React)

### TypeScript Config

```json
{
  "target": "es2023",
  "lib": ["ES2023", "DOM"],
  "moduleResolution": "bundler",
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "erasableSyntaxOnly": true
}
```

Strict-ish — unused locals/params are errors. `skipLibCheck: true`.

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
  - `localStorage.getItem('authToken')` — JWT
  - `localStorage.getItem('userId')` — user ID
- Cross-component events via DOM: `window.dispatchEvent(new Event('player-stats-updated'))`

### Service Module Pattern

```typescript
// Constants at top
const API_URL = 'http://localhost:8081/api/quests';

// Exported interface
export interface Quest { id: number; ... }

// Exported async functions
export const getQuests = async (userId: number): Promise<Quest[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch quests');
  return res.json();
};
```

- Most services use native `fetch` (not axios despite it being installed)
- Axios used in some services (inconsistency)
- No centralized HTTP client or interceptor
- Error handling: `if (!res.ok) throw new Error(...)` — caller must handle

### Linting

- Tool: **oxlint** (`^1.81.0`)
- Plugins: `react`, `typescript`, `oxc`
- Rules enforced:
  - `react/rules-of-hooks: error`
  - `react/only-export-components: warn` (with `allowConstantExport: true`)
- No Prettier or ESLint

---

## General Observations

- **No consistent API base URL strategy** — `http://localhost:8081` hardcoded across all frontend service files
- **Mixed HTTP clients** — some services use `fetch`, some use `axios`; both installed
- **Duplicate WizardDialogue component** — exists in both `components/` and `components/realm/`
- **`@CrossOrigin(origins = "*")`** on individual controllers AND global CORS config — redundant
- **Debug logging** in production code — `System.out.println` in `WebSecurityConfig` CSRF matchers

---

*Conventions analysis: 2026-10-13*
