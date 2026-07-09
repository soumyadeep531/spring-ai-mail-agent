# Step-by-Step Build Loop
## Project: SmartCV Builder

Use this as your working checklist. Each phase follows the same **Build → Test → Verify → Iterate** loop — don't move to the next phase until the current one's exit criteria are all checked off. This is the "loop until it's perfect" mechanism: every phase ends with a self-review gate, not just a "done" flag.

---

## The Loop (apply inside every phase below)
1. **Build** the smallest working slice for this phase.
2. **Test** it in isolation (unit test / manual curl / manual click-through).
3. **Verify against exit criteria** listed for that phase.
4. If any criterion fails → fix → re-test → re-verify (repeat until all pass).
5. Only then mark the phase complete and move to the next.

---

## Phase 0 — Project Setup
- [ ] Init backend repo (Spring Initializr: Web, WebFlux, Data JPA, PostgreSQL Driver, Security, Lombok, Validation)
- [ ] Init frontend repo (`npm create vite@latest smartcv-frontend -- --template react`)
- [ ] `.gitignore` in place for both repos **before first commit** (`.env`, `target/`, `node_modules/`, `dist/`) — non-negotiable, given your Linklytics `.env.prod` incident
- [ ] Both repos push to GitHub, README stub in each
- **Exit criteria:** both repos build/run locally with a "Hello World" endpoint/page; no secrets in git history (`git log -p | grep -i key` comes back empty).

## Phase 1 — Backend Core (Auth + Resume CRUD, no AI yet)
- [ ] Entities + Flyway migrations for User, Resume, Contact, Experience, Education, Skill, Summary
- [ ] AuthController (register/login/refresh) + JWT filter chain
- [ ] ResumeController CRUD endpoints (per §4 of Backend spec) for Contact, Experience, Education, Skills, Summary only (defer Awards/Languages/etc. to Phase 5)
- [ ] Postman/curl collection to manually exercise every endpoint
- **Exit criteria:** can register → login → create a resume → add one experience entry → GET the full resume back with correct nested JSON, all via curl/Postman. No AI, no frontend needed yet.

## Phase 2 — Frontend Skeleton (talks to real backend, no AI, one template)
- [ ] Auth screens (login/register) wired to real backend
- [ ] Builder screen shell: top bar, left icon rail (non-functional stubs OK except Section tab), one hardcoded template
- [ ] Section forms (Contact, Experience, Education, Skills, Summary) wired to PATCH/POST endpoints with 2s debounce auto-save
- [ ] `<ResumePreview>` component renders live from Zustand state (no AI, no PDF yet)
- **Exit criteria:** can fill out the whole builder form and see the right-panel preview update in real time; refresh the page and see the same data reload from the backend (proves persistence works, not just local state).

## Phase 3 — AI Integration
- [ ] Backend: `GeminiClient` WebClient wrapper (copy/adapt from Mail Agent) + 4 `/api/ai/*` endpoints
- [ ] Frontend: AI buttons wired in Experience (bullet gen), Summary (summary gen), Skills (suggestions)
- [ ] Error/timeout handling: if Gemini call fails, show a toast, don't crash the form
- **Exit criteria:** clicking each AI button, on a real filled-in job title/experience, returns a sensible generated string within ~5s and inserts it into the field with an "Undo" option.

## Phase 4 — Templates, Design, Scoring
- [ ] Template registry endpoint + 3+ real templates (start with 3, expand later)
- [ ] Accent color picker wired to `PATCH /design`
- [ ] `AtsScoringService` implemented with the weighted rules from SRS §FR-5.1 + unit tests
- [ ] Review screen with score widget + suggestions list
- **Exit criteria:** switching templates preserves all content; score updates correctly when you deliberately leave a section empty vs. fill it in (test both directions); unit tests for scoring pass.

## Phase 5 — PDF Export + Remaining Sections
- [ ] Implement chosen PDF pipeline (Playwright-Java recommended, per Backend spec §6)
- [ ] Verify pixel parity: export a resume, compare side-by-side with the live preview screenshot
- [ ] Add remaining optional sections: Awards, Languages, Certifications, Links, Custom Sections (both backend CRUD + frontend forms)
- **Exit criteria:** downloaded PDF visually matches the on-screen preview for at least 2 different templates; all section types can be added/edited/removed without errors.

## Phase 6 — Dashboard, Polish, Deployment
- [ ] Dashboard screen (list resumes, ATS score badge, delete/duplicate)
- [ ] Landing page matching screenshot 2 layout
- [ ] Responsive check at 1024px breakpoint (preview collapses to a toggle)
- [ ] Dockerize backend, deploy to Render; deploy frontend to Netlify; Neon Postgres wired up
- [ ] Full smoke test on the deployed URLs (not just localhost) — register → build → AI-assist → export → download, end to end
- **Exit criteria:** a stranger with the deployed URL and no help from you can register, build a resume with AI assistance, and download a correct PDF, with zero console errors.

## Phase 7 (P2, optional) — Resume Upload/Parse
- [ ] `/api/resume/parse` endpoint (PDFBox/POI extraction → Gemini structured-JSON prompt → prefilled draft)
- [ ] Frontend "I already have a resume" upload flow → review/edit screen before saving
- **Exit criteria:** uploading a real resume PDF produces a reasonably-filled draft that the user only needs to correct, not re-type from scratch.

---

## When You're "Stuck in the Loop"
If a phase's exit criteria keep failing after 2–3 fix attempts, that's a signal to **narrow the slice**, not push through — cut the phase into a smaller sub-slice, get that fully green, then expand. This keeps the loop converging instead of spinning.
