# SmartCV Builder

SmartCV Builder is a next-generation career tool designed to help professionals land their dream jobs. It features an intuitive builder, AI-powered writing assistants, and dynamic ATS templates.

## Features

- **Dynamic CV Builder:** Real-time editing with live preview of your resume layout.
- **ATS-Optimized Templates:** Choose from beautifully crafted templates (Modern, Elegant, ATS-Strict) guaranteed to parse correctly in Applicant Tracking Systems.
- **AI Writing Assistant:** Powered by Google's Gemini AI. Automatically generate strong bullet points, professional summaries, and discover relevant skills based on your job title.
- **Live ATS Scoring:** Get instant feedback on your resume's completeness, formatting, and keyword usage.
- **Multi-language Support:** Add optional sections for Languages, Certifications, and Awards.
- **PDF Export:** Download a pixel-perfect PDF of your resume instantly.
- **Dashboard Management:** Save, duplicate, or delete your resume drafts directly from your dashboard.
- **Resume Upload & Parsing:** Upload an existing PDF to automatically parse its contents and extract it into a new editable draft.
- **Custom Accent Colors:** Pick personalized accent colors to style your templates effortlessly.

## Architecture & Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- TailwindCSS & Lucide Icons
- Zustand for state management

**Backend:**
- Java Spring Boot (WebFlux, Data JPA)
- Google Gemini API integration (`GeminiClient`)
- PostgreSQL / MySQL (configurable)
- JWT Authentication

## Running Locally

1. **Backend Server:**
   Ensure `JAVA_HOME` is set to Java 22 or higher. Navigate to `email-writer-sb/` and run:
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Frontend Server:**
   Navigate to `email-writer frontend/` and install dependencies:
   ```bash
   npm install
   npm run dev
   ```

The frontend will be accessible at `http://localhost:5173`.
The backend runs on: `http://localhost:9090`.

---

*© 2026 SmartCV Builder. All rights reserved.*
