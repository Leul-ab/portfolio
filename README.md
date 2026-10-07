# Leul Abera Portfolio

React, TypeScript, and Vite frontend with a Node.js/Express API. The API stores editable site content, projects, admin sessions, and contact messages in Postgres (Neon). Uploaded images go to Cloudinary.

## Local Development

Use Node.js 22 or newer. Install dependencies and prepare the environment:

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env`:

- `ADMIN_USERNAME` / `ADMIN_PASSWORD` – admin login.
- `DATABASE_URL` – a Neon Postgres connection string (required). Use a separate Neon branch for development so you don't touch production data.
- `CLOUDINARY_URL` – optional locally; if empty, uploads are saved to `public/uploads/`.

Then run both the API and frontend:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal and go to `/admin` to sign in. The development server proxies API and upload requests to Express. Tables are created and seeded automatically on first start.

The admin workspace lets you edit the hero/about/contact details, replace the profile image, add/edit/delete projects, and read or delete contact messages. Contact form submissions are stored in the admin inbox; email notifications are not configured.

## Deployment: Vercel (frontend) + Render (API)

`vercel.json` rewrites `/api/*` to the Render service, so the browser only talks to the Vercel domain (cookies stay same-site, no CORS needed). All data lives in Neon and Cloudinary, so the free Render plan works: nothing is lost when the server restarts.

1. **Neon** – Create a free project at https://neon.tech and copy its connection string (`postgresql://...?sslmode=require`).
2. **Cloudinary** – Create a free account at https://cloudinary.com and copy the API environment variable from Dashboard > API Keys (`cloudinary://<key>:<secret>@<cloud_name>`).
3. **Render** – New > Web Service, connect this repo, and use: runtime Node, build command `npm ci`, start command `npm start`, instance type Free, health check path `/api/health`. Add environment variables: `NODE_VERSION=22`, `NODE_ENV=production`, `TRUST_PROXY=2`, `DATABASE_URL`, `CLOUDINARY_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (12+ characters). (Alternatively New > Blueprint uses `render.yaml`.) Check `https://<service>.onrender.com/api/health` returns `{"ok":true}`.
4. **Vercel** – Import the repo (Vite preset). If your Render URL differs from `https://leul-portfolio-api.onrender.com`, update the destination in `vercel.json` first.

Free Render services sleep after ~15 minutes without traffic; the first request afterwards takes ~30–50 seconds while it wakes up.

## API Overview

- `GET /api/content` and `GET /api/projects` provide public portfolio content.
- `POST /api/contact` validates and stores a contact message.
- `/api/admin/*` provides session-protected content, project, upload, and inbox management.
- `GET /api/health` is used by Render's health check.

Admin sessions use HTTP-only, same-site cookies. Uploaded images are limited to 5 MB and JPG, PNG, WebP, or GIF formats.
