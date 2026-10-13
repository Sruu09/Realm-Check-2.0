---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# TESTING.md — Test Structure & Practices

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## Backend Tests

### Framework Stack

| Tool | Purpose |
|---|---|
| **JUnit 5** (`junit-jupiter`) | Test runner — via `spring-boot-starter-test` |
| **Mockito** | Mocking — `@Mock`, `@InjectMocks`, `MockitoAnnotations.openMocks()` |
| **AssertJ** | Fluent assertions — `assertThat(...)` |
| **Spring Boot Test** | Integration testing — `@SpringBootTest`, `WebTestClient` |
| **spring-boot-starter-data-jpa-test** | JPA slice tests (present in pom but not yet used) |
| **spring-boot-starter-security-test** | Security test support |
| **spring-boot-starter-webmvc-test** | MVC test support (MockMvc) |

### Test Location

```
backend/src/test/java/com/realmcheck/backend/
├── BackendApplicationTests.java          # Spring context load test
├── AuthIntegrationTest.java              # E2E auth flow integration test
└── service/
    ├── RecommendationServiceTest.java    # Unit test (Mockito)
    ├── ApifyServiceTest.java             # Unit test (Mockito)
    └── EducationRecommendationServiceTest.java
util/
    └── KeywordUtilTest.java              # Pure unit test
```

### Test Types Found

#### 1. Context Load Test

```java
// BackendApplicationTests.java
@SpringBootTest
class BackendApplicationTests {
    @Test
    void contextLoads() {}
}
```

Smoke test — verifies Spring context starts.

#### 2. Unit Tests (Mockito)

Example from `RecommendationServiceTest.java`:

```java
class RecommendationServiceTest {
    @Mock private AdzunaService adzunaService;
    @Mock private UserRepository userRepository;
    @InjectMocks private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Set up SecurityContext manually
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void getRecommendations_normalScoringAndOrdering() { ... }
}
```

Pattern: `@Mock` + `@InjectMocks` + `MockitoAnnotations.openMocks(this)` (not `@ExtendWith(MockitoExtension.class)`)

#### 3. Integration Tests

```java
// AuthIntegrationTest.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthIntegrationTest {
    @LocalServerPort private int port;
    private WebTestClient webTestClient;
    // Uses WebTestClient (reactive) against full server
}
```

Starts full Spring Boot context on a random port. Uses `WebTestClient` (not `MockMvc`) — consistent with WebFlux being on the classpath.

### Test Coverage Assessment

| Layer | Coverage |
|---|---|
| Controllers | ⚠️ None (no `@WebMvcTest` tests) |
| Services | ✅ Partial (`RecommendationService`, `ApifyService`, `EducationRecommendationService`) |
| Repositories | ❌ None |
| Utilities | ✅ `KeywordUtil` tested |
| Auth/Security | ✅ Integration test for register/login/protected endpoint |
| Game logic | ❌ `GameProgressService` not tested |
| External APIs | ✅ Mocked in service tests |

### Test Naming Convention

- Method names use `_` separator: `getRecommendations_normalScoringAndOrdering`
- Follows pattern: `method_scenario` or `method_condition_expectedResult`

### Known Test Gaps

1. `GameProgressService` — XP/level calculation logic has no unit tests
2. `QuestService` — Quest completion and daily quest deduplication not tested
3. All controllers — no controller-layer tests
4. All repositories — no `@DataJpaTest` tests
5. Frontend — **zero test files found** in `frontend/src/`

---

## Frontend Tests

### Status: **No tests present**

- No test files found in `frontend/src/`
- No test runner configured (`package.json` has no `test` script)
- Vitest (common Vite testing framework) not installed
- React Testing Library not installed

### Recommendation

Add testing stack:

```json
{
  "devDependencies": {
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x"
  },
  "scripts": {
    "test": "vitest"
  }
}
```

---

## Running Tests

### Backend

```cmd
cd backend
mvnw.cmd test
```

### Frontend

Not yet configured.

---

## CI / CD

- No CI pipeline found (no `.github/workflows/`, no `Jenkinsfile`, no `Dockerfile` for backend)
- Docker Compose only covers database, not testing or deployment

---

*Testing analysis: 2026-10-13*
