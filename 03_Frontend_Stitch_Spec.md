# Frontend Build Spec — for Stitch
## Project: SmartCV Builder (Frontend)

> Paste this whole document into Stitch as the design/build brief. It describes every screen, the exact layout to replicate from the reference screenshots, and the component inventory.

---

## 0. Reference Layout (from provided screenshots)
Replicate this structure for the **Builder screen**:

- **Top bar**: Logo (left) · Resume title (editable, center-left) · "Saved" status pill (center) · "Download PDF" primary button + "···" overflow menu (right)
- **Left icon rail** (fixed, ~90px wide): 4 vertical nav icons with labels — `Templates`, `Section`, `Design & Formatting`, `Spell check`
- **Center-left panel** (~35% width): scrollable form — this is the active tab's content (Templates grid, or Section form fields, depending on left-rail selection)
- **Right panel** (~65% width): live, high-fidelity resume preview, updates in real time as the user types on the left
- **Landing page** (separate route, from screenshot 2): hero headline "Create your CV with an AI-powered CV maker", subheadline, two CTAs (`Create a New CV` primary, `Improve My CV` secondary), stat badges ("48% more likely to get hired", "12% better pay"), a preview resume card with floating "AI-powered ideas" suggestion chips.

---

## 1. Tech Stack
- React 18 + Vite
- Material UI v5 (matches your Mail Agent frontend — reuse the same theme setup for consistency)
- Axios for API calls
- React Router v6
- Zustand or Context API for builder state (resume-in-progress) — recommend Zustand for simplicity

## 2. Screens / Routes

### 2.1 `/` — Landing Page
- Hero section matching screenshot 2 layout (headline, subhead, two CTA buttons, stat badges).
- Sample resume preview card on the right with 1–2 floating "AI-powered ideas" chips (static/decorative on landing page).
- "Create a New CV" → `/onboarding`
- "Improve My CV" → file upload modal → `/builder/:id` (prefilled)

### 2.2 `/onboarding`
- Two-card choice: "Start from scratch" vs "I already have a resume" (upload).
- On "Start from scratch": template gallery grid (reuse Template component from builder's Templates tab) → pick one → creates a new resume → redirects to `/builder/:id`.

### 2.3 `/builder/:id` — Main Builder (core screen, matches screenshot 1)
Left icon rail tabs control what renders in the center-left panel:

**Tab: Templates**
- Grid of template thumbnails (4–6 templates), color-swatch row above the grid (5 accent color dots, matching screenshot: white/black/navy/teal/green), selected template has a checkmark badge.

**Tab: Section**
- Sequential accordion or stepper form:
  1. Contact (name, job title, phone, email, location)
  2. Experience (repeatable card: company, role, dates, bullet list with a "+ Add bullet" and an "✨ AI generate" button per bullet)
  3. Education (repeatable card: institution, degree, dates, score)
  4. Skills (chip input with autocomplete; "✨ Suggest skills" button calls `/api/ai/skill-suggestions`)
  5. Summary (rich text box + "✨ Generate with AI" button + tone selector)
  6. Additional Sections (toggleable add-ons: Awards, Hobbies, Languages, Certifications, Links, Custom)

**Tab: Design & Formatting**
- Accent color picker, font pairing selector, spacing density toggle (Compact/Comfortable).

**Tab: Spell check**
- List of flagged issues (client-side basic check + optionally AI-assisted grammar pass) with "Fix" quick-actions.

**Right panel (always visible in Builder)**
- Live preview component that renders the *exact same* template component used for PDF export (see note in section 4) — pure function of `resumeState`, no separate "preview-only" markup.

### 2.4 `/builder/:id/review` — Review & Export (Step 3)
- Big circular/radial "Resume Score" widget (e.g. "75% Your resume score 🤩") with expandable breakdown by category (matches SRS FR-5.2 sub-scores).
- List of specific improvement suggestions, each with a "Jump to section" link back into the builder.
- "Download PDF" primary CTA.

### 2.5 `/dashboard`
- Grid/list of the user's saved resumes (title, last updated, ATS score badge, thumbnail).
- "New Resume" CTA → `/onboarding`.

### 2.6 `/login`, `/register`
- Standard MUI form, same pattern as your other projects (JWT stored in memory/httpOnly cookie — not localStorage, for security).

## 3. Component Inventory
```
<AppShell>            top bar + routing outlet
<LandingHero>          
<TemplateGallery>       used in onboarding + builder Templates tab
<AccentColorPicker>
<BuilderIconRail>       left nav icons
<SectionForm>           wraps per-section subforms
  <ContactForm>
  <ExperienceForm>       + <AIBulletButton>
  <EducationForm>
  <SkillsForm>           + <AISkillSuggestChip>
  <SummaryForm>          + <AIGenerateButton>
  <AdditionalSectionsForm>
<ResumePreview>          pure render component, shared with PDF export
<ResumeScoreWidget>
<Dashboard>
<AuthForm>
```

## 4. Critical Design Rule: Single Source of Truth for Rendering
`<ResumePreview>` must be a pure component that takes `{resumeData, templateId, accentColor}` as props and renders identically whether shown live in-browser or passed to the backend's server-side HTML→PDF renderer. Do **not** build two separate templates (one for screen, one for PDF) — that's how visual drift bugs happen. If the backend renders PDF via headless browser, it can literally load this same React component server-side (SSR) or a shared HTML/CSS template extracted from it.

## 5. Style Guide
- Reuse the MUI theme (palette, typography) from your existing Mail Agent frontend for visual consistency across your project portfolio, but allow the accent color to be dynamic per-resume (CSS variable `--accent-color`, not hardcoded MUI primary).
- Typography: clean sans-serif (Inter or Roboto), matching the reference screenshots' minimal serif/sans headers.
- Keep the left icon rail and top bar fixed/sticky; only the center-left panel scrolls independently from the right preview panel.

## 6. State & API Wiring
- On any form field change → update Zustand store → debounce 2s → `PATCH /api/resume/{id}/{section}`.
- AI buttons → call respective `/api/ai/*` endpoint → show a loading skeleton in place of the button → insert returned text into the field (never auto-replace without the insertion being visible/undoable — add a simple "Undo" snackbar).
- Score widget → `POST /api/resume/{id}/score` on entering the Review screen, and optionally on a manual "Re-check score" button elsewhere.

## 7. Responsiveness
- Desktop-first (primary use case: laptop, per NFR-6 in SRS).
- Below 1024px: collapse the right preview panel behind a "Preview" toggle button instead of a permanent split-screen.
