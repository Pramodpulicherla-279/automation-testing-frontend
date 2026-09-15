# automation-testing-frontend

React + Vite UI for the test automation platform.

Split out of the `test-automation-platform` mono repo (from
`frontend/test-platform/`) alongside
[`automation-testing`](../automation-testing) and
[`automation-testing-backend`](../automation-testing-backend).

## Backend URL

Every API and WebSocket call goes through `src/api/config.js`, which reads
`VITE_API_BASE_URL` and falls back to `http://localhost:8000`. The WebSocket
origin is derived from it, so one variable configures both.

Vite inlines this at **build** time, so set it in the build environment — for a
Render static site, as an environment variable on the service.

```bash
cp .env.example .env    # local override, optional
```

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

## Deploying

The backend runs on the laptop that has the Android device, ADB and Appium, so a
deployed frontend needs a publicly reachable URL for it (a tunnel) in
`VITE_API_BASE_URL`. Pointing it at `localhost` only works when the browser is
on the same machine as the backend.
