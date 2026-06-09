# Cyber Portfolio (Full Stack)

A modern animated portfolio based on your resume.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript

## Run locally
```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deploy on one domain
This repo is set up so the backend can serve the built frontend from the same domain.

1. Build the app:
```bash
npm run build
```

2. Start the backend:
```bash
npm start
```

3. Point your domain to the backend service.

If you deploy the frontend and backend separately, set `VITE_API_URL` in the frontend build environment to your backend URL. If you deploy them together, no extra frontend environment variable is needed.
