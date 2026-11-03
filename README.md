# personal-growth-web

Web app for the Personal Growth Agent. Next.js 16 (App Router), React 19, Tailwind v4.
Talks to the FastAPI backend in `../personal-growth-agent`.

## Setup

```bash
npm install
cp .env.example .env.local
```

`BACKEND_URL` points at the FastAPI server (default `http://localhost:8000`).

## Run

```bash
npm run dev
# http://localhost:3000
```

Start the backend first. With `HARDCODED_OTP=123456` in the backend `.env`, every login code is `123456`.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## How auth works

The backend login returns a JWT. A server action stores it in the httpOnly `pg_session` cookie,
so browser JavaScript never sees it. Only server code (`src/lib/backend.ts`) calls the backend,
adding `Authorization: Bearer <token>`. `src/proxy.ts` redirects to `/login` when the cookie is
missing; an expired token sends the user through `/logout`, which clears the cookie.

## Layout

```
src/
  proxy.ts               route protection
  app/
    login/               email → code login
    logout/route.ts      clears the cookie
    planner/             goal planner screen
    actions/auth.ts      login and logout server actions
  components/            header, logo
  lib/
    backend.ts           server-only fetch to FastAPI with the token
    session.ts           requireUser()
```
