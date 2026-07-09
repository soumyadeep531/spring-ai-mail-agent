# SmartCV Builder — Template Gallery, Resume Upload/Parsing & Deployment-Readiness Spec
**Version:** 1.0 | **Date:** July 2026
**Applies to:** existing SmartCV Builder repo (React/Vite/TypeScript/Tailwind/Zustand frontend + Spring Boot WebFlux/JPA backend, per current README)

This document adds three things to the existing project: (1) a template-selection gallery matching the reference screenshot, (2) resume upload with automatic PDF/DOCX parsing, and (3) a deployment-readiness checklist. It's written to be handed to Stitch (frontend) and Antigravity (backend) directly, section by section.

---

## 1. Feature: Template Gallery & Selection

### 1.1 What it does
User browses a grid of pre-built resume templates, each rendered with real sample data (like "Kelly Blackwell", "Howard Jones", "Samantha Williams" in the reference), picks an accent color per template, and either (a) selects it to continue building in the app, or (b) quick-downloads that sample as PDF/DOCX for reference — matching the reference screenshot exactly.

### 1.2 UI Layout (matches screenshot)
- **Grid:** 3 cards per row on desktop, 1 per row on mobile, responsive Tailwind grid (`grid-cols-1 md:grid-cols-3 gap-6`).
- **Each template card contains:**
  - A scaled-down live rendering of the template (not a static image — render the actual `<ResumePreview>` component with sample data so it stays in sync with the real builder output)
  - Below the card: a row of 4–5 accent-color swatches (small circles, first one usually a neutral/white outline = "no accent / default")
  - Below the swatches: two small buttons, `PDF` and `DOCX`, for a quick sample download without entering the builder
  - Selected card gets a highlighted border + checkmark badge (top-right corner, blue circle with a check icon — Lucide `Check` icon)
- **Top of page:** thin progress bar (already visible in screenshot as a blue bar under the browser tabs' page — represents onboarding step progress, e.g. Step 1 of 3)

### 1.3 Template Catalog (v1 — 3 templates, matching the styles shown)
| ID | Name | Style | Layout notes |
|---|---|---|---|
| `modern-sidebar` | Modern | Two-column, left sidebar (contact/skills/education), right main (summary/experience) | Matches "Kelly Blackwell" card |
| `classic-centered` | Classic | Single-column, centered header, horizontal-rule section dividers | Matches "Howard Jones" card |
| `executive-photo` | Executive | Two-column with profile photo + colored header band | Matches "Samantha Williams" card |

Each template is a **pure React component** (`ModernSidebarTemplate.tsx`, `ClassicCenteredTemplate.tsx`, `ExecutivePhotoTemplate.tsx`) that takes `{resumeData, accentColor}` as props — same single-source-of-truth rule as before, so gallery preview = builder preview = PDF export.

### 1.4 Component Inventory
```
<TemplateGallery>
  <TemplateCard>
     <ResumePreview template={id} data={sampleData} accentColor={selectedColor} scale={0.4} />
     <AccentColorSwatchRow onSelect={...} />
     <QuickDownloadButtons onDownloadPdf onDownloadDocx />
     <SelectCheckmarkBadge visible={isSelected} />
  </TemplateCard>
</TemplateGallery>
```

### 1.5 Backend Support
```
GET  /api/templates                    → [{id, name, layoutType, previewSampleDataUrl}]
GET  /api/templates/{id}/sample/pdf    → sample PDF (pre-rendered, cached — doesn't need a live user resume)
GET  /api/templates/{id}/sample/docx   → sample DOCX (see §2.4 for DOCX generation approach)
POST /api/resumes/{id}/design          {templateId, accentColor} → updates the user's actual resume (unchanged from earlier spec)
```
Sample PDFs/DOCX can be pre-generated once at deploy time (they use static sample data) and served from object storage or a static `/resources/samples/` folder — no need to render on every request.

### 1.6 Adding More Templates Later
Keep each template as a self-contained component + a registry entry (`id`, `name`, `component`, `thumbnailData`). Adding template #4 should never require touching the gallery, builder, or PDF export code — just register it. This is the acceptance test for "is this properly decoupled."

---

## 2. Feature: Resume Upload & Auto-Parsing (PDF + DOCX)

### 2.1 What it does
User uploads an existing resume (PDF or DOCX). Backend extracts the text, sends it to Gemini with a structured-JSON-output prompt, maps the result into the SmartCV data model, and creates a new **draft** resume pre-filled with that data — which the user then reviews/edits before it's treated as a normal saved resume. Nothing is auto-saved as final without the user seeing it first.

### 2.2 Frontend Flow
1. Onboarding screen → "I already have a resume" card → file picker (`.pdf`, `.docx`, max 5MB)
2. Upload progress indicator → "Reading your resume…" → "Extracting details with AI…" (two-stage loading message, since it's a two-stage backend process)
3. Redirect to `/builder/:id?draft=true` with all fields pre-filled
4. A dismissible banner at the top: *"We pre-filled this from your upload — please review each section for accuracy."*
5. Standard builder editing/auto-save behavior takes over from here (no special "draft" state in the backend once the user touches Save — see §2.5)

### 2.3 Backend Endpoint
```
POST /api/resume/parse
  Content-Type: multipart/form-data
  Body: file (pdf or docx)

Response 200:
{
  "resumeId": "uuid",
  "confidence": "high" | "medium" | "low",
  "unmappedText": ["...any content the parser couldn't confidently categorize..."]
}
```
- `confidence` and `unmappedText` let the frontend show a warning banner ("We weren't fully sure about some sections — please double check Education and Skills") rather than silently guessing.

### 2.4 Backend Pipeline
```
1. Receive file → validate type/size
2. Extract raw text:
   - PDF  → Apache PDFBox (PDFTextStripper)
   - DOCX → Apache POI (XWPFDocument)
3. Send raw text to Gemini with a strict JSON-schema prompt:
   "Extract the following resume into this exact JSON shape: { contact: {...}, summary: string,
    experience: [{company, role, startDate, endDate, bullets: []}], education: [...], skills: [...],
    certifications: [...], languages: [...] }. Return ONLY valid JSON, no prose."
4. Parse Gemini's JSON response (wrap in try/catch — if invalid JSON, retry once with a
   "your last response was not valid JSON, return only JSON" follow-up prompt)
5. Map parsed JSON → create Resume + child entities in DB (status: DRAFT)
6. Return resumeId + confidence heuristic (e.g. "low" if fewer than 3 of the 6 major sections
   were populated)
```
For DOCX **generation** (the quick-download sample feature in §1.5, and optionally a "Download as DOCX" option for real resumes later), use **Apache POI** to build a `.docx` from the same resume data model — this is a separate, simpler code path than parsing (writing vs. reading).

### 2.5 Draft vs. Saved State
- Add a `status` field to `Resume`: `DRAFT | SAVED`.
- Parsed uploads start as `DRAFT`.
- First explicit auto-save action (any field edit) flips it to `SAVED` — this is just a UX signal (e.g. dashboard shows a "needs review" tag on drafts the user hasn't touched yet); it does not block editing or exporting.

### 2.6 Error Handling
- Unsupported file type → 400 with a clear message, shown as a toast.
- File too large → 400, same pattern.
- Gemini extraction totally fails (empty/garbage text, e.g. a scanned image PDF with no text layer) → return `confidence: "low"` with an empty-ish draft and a banner suggesting the user fill it manually instead; do **not** hard-fail the whole upload flow — always give the user *something* to land on.

---

## 3. Deployment-Readiness Checklist

### 3.1 Environment Variables (both PDF and DOCX endpoints, plus everything else)
```
# Backend
DB_URL=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
GEMINI_URL=
GEMINI_KEY=
FRONTEND_ORIGIN=
MAX_UPLOAD_SIZE_MB=5

# Frontend
VITE_API_BASE_URL=
```
- Confirm `.env` / `.env.prod` are in `.gitignore` and **not** already tracked (`git status` should show them ignored, not "nothing to commit" because they're already committed — check `git log --all --full-history -- .env*` comes back empty).
- Rotate any keys that were ever exposed, even briefly (per your earlier Linklytics incident — same rule applies here).

### 3.2 Backend Production Checklist
- [ ] `application-prod.properties` profile with prod DB URL, connection pool sized appropriately (HikariCP defaults are usually fine to start)
- [ ] CORS locked to the exact deployed frontend origin (no wildcard `*` in prod)
- [ ] File upload size limit enforced both in Spring config (`spring.servlet.multipart.max-file-size`) and in the controller
- [ ] Global exception handler returns clean JSON errors (no raw stack traces leaking to the client)
- [ ] Rate limiting on `/api/ai/*` and `/api/resume/parse` (these hit paid Gemini calls — a simple per-user-per-minute limiter prevents runaway cost from a buggy frontend loop)
- [ ] Actuator health endpoint enabled (`/actuator/health`) for Render's health checks
- [ ] Dockerfile builds a slim JAR image (multi-stage build: Maven build stage → JRE-only runtime stage)

### 3.3 Frontend Production Checklist
- [ ] `VITE_API_BASE_URL` correctly points at the deployed backend, not `localhost`
- [ ] Build succeeds with `npm run build` and produces a working `dist/` (test locally with `npm run preview` before deploying)
- [ ] JWT stored in memory or httpOnly cookie, not `localStorage` (XSS-safer)
- [ ] Netlify `_redirects` file (or `netlify.toml`) configured for SPA fallback routing (`/*  /index.html  200`) so deep links like `/builder/abc123` don't 404 on refresh

### 3.4 Database
- [ ] Neon (or chosen) PostgreSQL instance provisioned, connection string added to backend env
- [ ] Flyway migrations run cleanly against a fresh database (test this on a throwaway DB before pointing at prod)
- [ ] Backups/point-in-time recovery enabled if Neon plan supports it

### 3.5 Deployment Steps (Render + Netlify pattern, matching your Linklytics setup)
1. Push backend to GitHub → connect repo in Render → set env vars in Render dashboard → deploy → confirm `/actuator/health` returns 200
2. Push frontend to GitHub → connect repo in Netlify → set `VITE_API_BASE_URL` in Netlify env vars → deploy → confirm the deployed site loads and can hit the backend (check browser network tab for CORS errors first)
3. Update backend's `FRONTEND_ORIGIN` env var to the real Netlify URL (not `localhost`) and redeploy backend
4. Full smoke test on the live URLs: register → build a resume → upload/parse a sample resume → pick a template → use an AI button → export PDF → download DOCX sample

### 3.6 Post-Deploy Verification (final gate before calling it "done")
- [ ] Register + login works on the live site
- [ ] Template gallery renders all 3 templates with correct sample data and accent colors
- [ ] Uploading a real PDF resume produces a sensibly pre-filled draft
- [ ] Uploading a real DOCX resume produces a sensibly pre-filled draft
- [ ] AI buttons (summary, bullet, skills) return results within ~5s
- [ ] ATS score updates correctly as sections are filled/emptied
- [ ] PDF export visually matches the live preview
- [ ] No secrets visible in browser dev tools, network tab, or page source
- [ ] No `.env` files present in the GitHub repo history

Once every box above is checked, the project is deployment-ready.
