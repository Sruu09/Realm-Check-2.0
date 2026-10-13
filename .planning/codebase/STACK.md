---
last_mapped_commit: 5d8dc2a556869e1fc1236155eeb4ac210a2e9d80
last_mapped_at: 2026-10-13
---
# STACK.md — Technology Stack

**Analysis Date:** 2026-10-13
<!-- refreshed: 2026-10-13 -->

---

## Languages

| Language | Version | Used In |
|---|---|---|
| Java | 21 | Backend (Spring Boot) |
| TypeScript | ~6.0.2 | Frontend (React/Vite) |
| SQL | — | PostgreSQL schema |

---

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

---

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

---

## Infrastructure

### Docker Compose

- **postgres:15** — database container
  - Container: `realmcheck-db`
  - Host port: `5433` → container `5432`
  - Initial schema: `backend/src/main/resources/schema.sql` mounted to init dir
  - Volume: `pgdata` (persistent)
- No backend or frontend container defined yet (local JVM + Vite dev only)

---

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

---

*Tech stack analysis: 2026-10-13*
