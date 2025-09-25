# YouTube Insight Studio

AI-assisted analyst for YouTube videos built with Next.js and the Gemini API. Paste a single video link to receive an SEO-ready report featuring transcripts, analogies, critical perspectives, actionable frameworks, and memory anchors. The interface supports multiple languages and includes an admin area for diagnostics.

## Features

- 🔍 **Single-video focus** – optimized workflow for analyzing one video at a time.
- 🗣️ **Multilingual output** – choose the language of the generated analysis while keeping the UI bilingual (English / Spanish).
- 🔐 **Secure admin console** – environment-driven passphrase login with hashed session cookies and detailed error logs for administrators.
- 🧠 **Rich Gemini prompt engineering** – transcripts transformed into structured Markdown summaries, analogies, critical reviews, action frameworks, and memory aids.
- 📈 **Monetization ready** – architecture isolates AI + workflow services so premium tiers or credits can be layered in later.
- ♿ **Accessible, SEO-friendly UI** – responsive layout, semantic headings, and Markdown rendering designed for search engines and human readers.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and populate the values:

   - `GEMINI_API_KEY` – Gemini service key.
   - `ADMIN_PASSWORD` – passphrase for the diagnostics console.
   - `SESSION_SECRET` – long random string used for session hashing.

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## Admin Console

Visit `/login` to access the diagnostics area. After signing in, `/admin` lists recent error logs with full stack traces for troubleshooting without exposing technical messages to end users.

## Testing & Quality

- `npm run lint` – lint the project with ESLint.
- `npm run typecheck` – ensure TypeScript types are valid.
- `npm run build` – compile the Next.js app.

## Notes

- The app uses the `youtube-transcript` library to fetch captions when available. If a transcript cannot be retrieved in the requested language, an anonymized error is displayed to users while details remain in the admin log.
- Gemini API responses are sanitized to prevent empty payloads; failures are traced with reference codes for follow-up.
- Monetization hooks (credits, billing, exports) can be attached to the API layer without refactoring the UI.
