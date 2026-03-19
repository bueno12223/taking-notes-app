# Notes App

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Django-REST_Framework-092E20?style=for-the-badge&logo=django" />
  <img src="https://img.shields.io/badge/AWS-Cognito_·_Transcribe_·_Amplify-orange?style=for-the-badge&logo=amazon-aws" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
</div>

---

## Overview

A notes-taking app built with Django and Next.js. Users can create, edit, and organize notes by category, with support for rich text formatting and voice-to-text transcription.

---

## Infrastructure

| Layer | Service |
|---|---|
| Frontend | AWS Amplify |
| Backend | EC2 + Docker |
| Database | RDS PostgreSQL |
| Auth | AWS Cognito |
| Transcription | AWS Transcribe |

Environment variables are documented in `.env.example` for both `backend/` and `frontend/`.

---

## Frontend Architecture

### Auth — `AuthContext`
Built on Amplify JS SDK. Handles login, signup, and session persistence via `localStorage`. No tokens are managed manually — Amplify handles refresh automatically. Protected routes use `AuthGuard`, which redirects to `/auth/login` if no session exists.

### Categories — `CategoriesContext`
Fetches `GET /api/categories/` on mount and provides the result globally. Components consume categories via `useCategories()` without prop drilling.

### API — `useApi`
Custom hook that attaches the Cognito JWT (`Authorization: Bearer <token>`) to every request automatically. Exposes `data`, `isLoading`, and `error` states. Supports two usage patterns:
- **Initial fetch**: called directly in `useEffect` for data on mount
- **Lazy fetch**: returns an `execute()` function for action-based calls (POST, PATCH, DELETE)

### Autosave — `useAutosave`
Debounced autosave (1000ms) with smart create/update logic:
- If no `noteId` exists → fires `POST`, stores the returned ID, switches to `PATCH` for all subsequent saves
- If `noteId` exists → fires `PATCH` directly
- Only fires when the note is valid (title and category are required)
- When the note is invalid, inline errors are shown and the save is skipped silently
- On close with an invalid state, the note reverts to the last successfully saved state

### Rich Text — Tiptap
Headless WYSIWYG editor. Content is stored as Tiptap JSON (not raw markdown or HTML), which eliminates XSS risk without needing a sanitization library. Formatting is triggered via markdown shortcuts (`**bold**`, `- ` for lists, `# ` for headings).

### Voice Transcription
User presses the microphone button, speaks, then manually presses stop. The audio blob is sent to `POST /api/transcribe/`. The backend transcribes it via AWS Transcribe and returns the transcript as a plain string. The transcript is appended at the end of the editor content.

### Error Handling
Backend errors are never shown raw to the user. All errors are mapped to friendly messages via a centralized `ERROR_MESSAGES` utility.

---

## Backend Architecture

### Auth
JWT validation via Cognito's public JWKS endpoint. A custom `CognitoAuthentication` class (DRF) fetches and caches the JWKS, validates the token on every protected request, and extracts the `sub` claim as the user identifier.

**No user table.** Cognito is the source of truth for identity. Only `cognito_user_id` is stored on the `Note` model.

### Categories
Declared as `CATEGORY_CHOICES` on the `Note` model — no separate table, because categories are fixed and not user-creatable in this app. The `GET /api/categories/` endpoint builds its response directly from this constant. Category values are Tailwind color tokens (`brand-peach`, `brand-cream`, `brand-teal`), which the frontend applies as CSS classes directly.

### Layered Architecture
All Django apps follow a `views → services → models` pattern. Views handle HTTP only and delegate all business logic to `services.py`. This keeps views thin and services independently testable.

### Transcription
Audio is received as binary at `POST /api/transcribe/`. The backend sends it to AWS Transcribe and returns the transcript as a plain string. Requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` in the environment.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/notes/` | ✅ | List notes for the authenticated user |
| POST | `/api/notes/` | ✅ | Create a new note |
| PATCH | `/api/notes/:id/` | ✅ | Update a note |
| GET | `/api/categories/` | ✅ | List available categories |
| POST | `/api/transcribe/` | ✅ | Transcribe audio to text |

---

## Testing

### Backend — 91% coverage

| Module | Coverage |
|---|---|
| `notes/services.py` | 100% |
| `notes/views.py` | 97% |
| `categories/views.py` | 100% |
| `notes/authentication.py` | 91% |
| `notes/transcription/` | 42% |
| **Global** | **91%** |

The lower coverage on `notes/transcription/` is expected — the AWS Transcribe client is mocked at the view level. Testing the internal streaming logic would require a real AWS integration test, which is out of scope for unit tests.

### Frontend — 86% coverage

| Module | Coverage |
|---|---|
| `AuthGuard.tsx` | 100% |
| `constants/index.ts` | 100% |
| `lib/note-utils.ts` | 100% |
| `hooks/useApi.ts` | 100% |
| `hooks/useAutosave.ts` | 89% |
| `hooks/useVoiceRecorder.ts` | 71% |
| **Global** | **86%** |

The lower coverage on `useVoiceRecorder` is expected — `MediaRecorder` and `AudioContext` are browser APIs not available in jsdom. The core recording flow is tested; the untested lines are browser API initialization paths.

---

## Process & AI Usage

### Process Summary
Started by defining the data model and authentication strategy before writing any code. Built backend and frontend in parallel, validating each layer (auth → categories → notes → transcription) before moving to the next. Deployment was configured incrementally — local Docker first, then EC2 + RDS, then Amplify.

### Key Design Decisions
- **No user table** — Cognito owns identity. Storing only `cognito_user_id` on the Note model eliminates an entire class of auth-related bugs and PII risk.
- **`CATEGORY_CHOICES` over a DB table** — Categories are fixed by design. A separate table would add a JOIN, a migration, and an endpoint for data that never changes.
- **Tiptap over raw markdown** — Storing content as Tiptap JSON avoids XSS without a sanitization library, preserves formatting without string parsing, and gives the editor a WYSIWYG experience without building a custom renderer.
- **`useAutosave` with POST→PATCH handoff** — The note gets a real ID on first save. All subsequent saves use PATCH against that ID. The user never thinks about saving.
- **Debounce over interval** — Saving every Xms regardless of activity wastes requests. Debounce fires only after the user stops typing, which is when saving is actually meaningful.
- **AudioWorklet over MediaRecorder** — AudioWorklet provides better performance and more control over audio processing, which is essential for real-time transcription.

### AI Tools
**Claude (claude.ai)** was used as an architectural advisor throughout the project:
- Evaluating tradeoffs before implementation (e.g. Tiptap vs react-markdown, CATEGORY_CHOICES vs DB table, Formik vs reactive validation)
- Generating prompts for GitHub Copilot — rather than prompting Copilot directly with vague instructions, Claude was used to produce precise, scoped prompts with explicit constraints and stopping conditions
- Reviewing architectural decisions for correctness before committing to them

**Antigravity AI assistant** was used for implementation:
- Generating boilerplate from the prompts produced by Claude
- Writing unit tests given the existing implementation
- Filling in repetitive patterns (serializers, URL routing, Tailwind classes)

The workflow was: Claude owns the architecture and the prompt, Antigravity AI assistant owns the implementation. No code was committed without being read and understood.

---

## Known Improvements

- Add logged-in user display and logout button in the sidebar
- Add skeletons to the note list during loading
- Animations on open and close notes
- Silence detection (3s) was not implemented — user must press stop manually to trigger transcription
- UI fixes: category dropdown missing shadow (blends with background), loading states on buttons and auth forms, selected category highlight in dropdown
- `ERROR_MESSAGES` mapping is partially implemented — needs to cover all edge cases consistently

---

<div align="center">
  <small>Built by Jesús Berrio</small>
</div>