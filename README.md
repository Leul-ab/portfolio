# Leul Abera Portfolio

React, TypeScript, and Vite frontend with a Node.js/Express API. The API stores editable site content, projects, admin sessions, and contact messages in SQLite.

## Local Development

Use Node.js 22 or newer. Install dependencies and prepare the local administrator account:

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` and set a unique `ADMIN_USERNAME` and a long `ADMIN_PASSWORD`. Then run both the API and frontend:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal and go to `/admin` to sign in. The development server proxies API and upload requests to Express.

The admin workspace lets you edit the hero/about/contact details, replace the profile image, add/edit/delete projects, and read or delete contact messages. Contact form submissions are stored in the admin inbox; email notifications are not configured.

## Production

Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD` (at least 12 characters), and optionally `PORT` in the hosting environment, then run:

```powershell
npm run build
npm start
```

The Node server serves both the built frontend and the API. Keep the `data/` directory and `public/uploads/` on persistent storage: SQLite data and uploaded images are stored there. These generated files are excluded from Git. Back them up along with the database.

## API Overview

- `GET /api/content` and `GET /api/projects` provide public portfolio content.
- `POST /api/contact` validates and stores a contact message.
- `/api/admin/*` provides session-protected content, project, upload, and inbox management.

Admin sessions use HTTP-only, same-site cookies. Uploaded images are limited to 5 MB and JPG, PNG, WebP, or GIF formats.