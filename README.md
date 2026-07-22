This is a full-stack [Next.js](https://nextjs.org) app with both frontend UI and backend API routes.

## Project Overview

- Frontend UI: `src/app/page.tsx`, `src/components/`, and the assistant chat in `src/features/assistant/assistant-client.tsx`.
- Backend API: `src/app/api/assistant/route.ts` and `src/app/api/agents/route.ts`.
- AI integration: backend uses `OPENROUTER_API_KEY` or `OPENAI_API_KEY` to call the OpenRouter/OpenAI API.
- Optional Supabase auth: `src/lib/supabase.ts` provides auth and agent history support.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file:

```bash
copy .env.example .env.local
```

3. Open `.env.local` and add your backend API key(s):

- `OPENROUTER_API_KEY=your-openrouter-api-key`
- or `OPENAI_API_KEY=your-openai-api-key`

Optional Supabase variables for authentication and agent tracking:

- `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key`

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API Routes

- `POST /api/assistant` — handles the chat assistant.
- `POST /api/agents` — powers the specialist agent panel.

If the backend cannot find an API key, it will return an error message instructing you to configure `OPENROUTER_API_KEY` or `OPENAI_API_KEY`.

## Notes

- The UI is already wired to call the backend routes.
- The backend is where the API key belongs; do not put it in frontend code.
- Use `.env.local` for local secrets and keep it out of source control.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API docs](https://platform.openai.com/docs)
- [OpenRouter docs](https://openrouter.ai)
