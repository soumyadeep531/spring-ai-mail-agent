# Backend Build Spec — for Antigravity
## Project: SmartCV Builder (Backend)

> Paste this whole document into Antigravity as the build brief. It follows the same architectural conventions as your existing `email-writer-sb` (Spring AI Mail Agent) backend.

---

## 1. Tech Stack
- Java 17, Spring Boot 3.x
- Spring Web (REST controllers) + Spring WebFlux `WebClient` for the Gemini calls (reactive, non-blocking — same pattern as Mail Agent)
- Spring Data JPA + PostgreSQL (Neon, matching your Linklytics deployment)
- Spring Security + JWT (jjwt or Spring Authorization Server–style filter chain)
- Lombok
- Flyway or Hibernate `ddl-auto=update` for schema (Flyway recommended for a portfolio project — shows migration discipline)
- PDF rendering: **OpenHTMLtoPDF** or **Playwright-Java (headless Chromium)** — see decision note in §6
- Apache PDFBox + Apache POI (only if building the optional P2 resume-upload/parse feature)

## 2. Module / Package Structure
```
com.smartcv
 ├── auth/            AuthController, AuthService, JwtUtil, SecurityConfig
 ├── user/             User entity, UserRepository
 ├── resume/           Resume entity + all section sub-entities, ResumeController, ResumeService, ResumeRepository (+ per-section repos)
 ├── ai/               AiController, GeminiClient (WebClient wrapper), prompt builder classes
 ├── scoring/          AtsScoringService (rule engine)
 ├── pdf/              PdfRenderService, PdfController
 ├── template/         Template entity, TemplateController
 ├── config/           WebConfig (CORS), GeminiConfig, SecurityConfig
 └── common/           GlobalExceptionHandler, DTOs, mappers
```

## 3. Entities (JPA) — mirrors SRS §4
Implement exactly the entities listed in `02_SRS.md` §4. Use `@OneToMany(mappedBy=..., cascade=CascadeType.ALL, orphanRemoval=true)` from `Resume` to each section table. Use `orderIndex` (Integer) on repeatable sections (Experience, Education, CustomSection) to preserve user-defined ordering.

## 4. REST API Contract

### Auth
```
POST /api/auth/register   {email, password} → 201
POST /api/auth/login      {email, password} → {accessToken, refreshToken}
POST /api/auth/refresh    {refreshToken} → {accessToken}
```

### Resume CRUD
```
GET    /api/resumes                 → list current user's resumes
POST   /api/resumes                 {templateId, title} → creates empty resume
GET    /api/resumes/{id}            → full resume JSON (all sections nested)
PATCH  /api/resumes/{id}/contact
PATCH  /api/resumes/{id}/summary
POST   /api/resumes/{id}/experience         (add)
PATCH  /api/resumes/{id}/experience/{eid}   (update)
DELETE /api/resumes/{id}/experience/{eid}
POST   /api/resumes/{id}/education
PATCH  /api/resumes/{id}/education/{eid}
DELETE /api/resumes/{id}/education/{eid}
POST   /api/resumes/{id}/skills
DELETE /api/resumes/{id}/skills/{sid}
PATCH  /api/resumes/{id}/design      {templateId, accentColor}
DELETE /api/resumes/{id}
POST   /api/resumes/{id}/duplicate
```
(Repeat the same add/update/delete pattern for Awards, Languages, Certifications, Links, CustomSections.)

### AI
```
POST /api/ai/summary            {jobTitle, experienceLevel, keySkills[]} → {summary}
POST /api/ai/bullet-point       {roughText, roleContext} → {bullet}
POST /api/ai/skill-suggestions  {jobTitle} → {skills: []}
POST /api/ai/refine-tone        {text, tone} → {refinedText}
```
All four are thin controllers → a single `GeminiClient.generate(promptTemplate, variables)` reactive call, mirroring the exact WebClient pattern already proven in your Mail Agent's `/api/email/generate` endpoint. Reuse that code as the starting point.

### Scoring
```
POST /api/resumes/{id}/score    {targetJobDescription?: string} → {overallScore, subScores: {}, suggestions: []}
```

### Templates
```
GET /api/templates → [{id, name, previewUrl, layoutType}]
```

### Export
```
GET /api/resumes/{id}/export/pdf → application/pdf (binary stream)
```

## 5. Security Config
- Stateless JWT filter chain (same as any of your prior projects with auth).
- `SecurityConfig`: public endpoints = `/api/auth/**`, `/api/templates`; everything else requires `Authorization: Bearer <token>`.
- Resume ownership check: every resume-scoped endpoint must verify `resume.userId == authenticatedUserId` in the service layer (return 403 otherwise) — don't rely on the ID alone.

## 6. PDF Rendering — Decision Note
Two options, pick one and document the choice in your project README:
- **Option A (recommended for visual parity):** Playwright-Java spins up headless Chromium, loads a server-rendered HTML page (built from the same template/CSS the frontend preview uses) with resume data injected, and prints to PDF. Best fidelity, heavier dependency.
- **Option B (lighter):** OpenHTMLtoPDF renders a Thymeleaf HTML template (Java-side templating) to PDF directly. Faster/lighter, but CSS support is more limited (no flexbox/grid) — the HTML template must be hand-written to match the React preview's visual output, which risks drift (see SRS NFR about parity).

Given your existing stack and the "single source of truth" rule in the frontend spec, **Option A is preferred** for a portfolio project — it's a more impressive engineering story too ("server-side headless rendering pipeline").

## 7. Environment Variables (`.env` — never commit, add to `.gitignore` immediately)
```
DB_URL=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
GEMINI_KEY=
FRONTEND_ORIGIN=http://localhost:5173
```
CORS: read `FRONTEND_ORIGIN` from `application.properties`/`WebConfig` — double-check the exact property key name matches between your `@Value` annotation and `application.properties` (this exact class of bug bit you on Linklytics — verify with a quick curl test before moving on).

## 8. Testing
- Unit tests for `AtsScoringService` (pure logic, easiest to test deterministically).
- `@WebMvcTest` for controllers with mocked services.
- `@DataJpaTest` for repository ordering/cascade behavior.
- One integration test hitting a real (test-profile) Gemini call is optional — mock `GeminiClient` in most tests to avoid flaky/slow CI.

## 9. Deployment
- Docker image → Render (backend) — reuse your Linklytics `Dockerfile` and Docker Hub naming convention (make sure the repo name matches consistently this time).
- Neon PostgreSQL for the database.
- Frontend → Netlify, same as Linklytics.
