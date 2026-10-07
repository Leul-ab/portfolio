import "dotenv/config"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Database from "better-sqlite3"
import express from "express"
import multer from "multer"

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
// On Render, point these at the persistent disk (e.g. DATA_DIR=/var/data, UPLOADS_DIR=/var/data/uploads).
const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(rootDirectory, "data"))
const uploadsDirectory = path.resolve(process.env.UPLOADS_DIR || path.join(rootDirectory, "public", "uploads"))
const buildDirectory = path.join(rootDirectory, "dist")
const port = Number(process.env.PORT || 3001)

fs.mkdirSync(dataDirectory, { recursive: true })
fs.mkdirSync(uploadsDirectory, { recursive: true })

const database = new Database(path.join(dataDirectory, "portfolio.sqlite"))
database.pragma("journal_mode = WAL")
database.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    links TEXT NOT NULL,
    image_fit TEXT,
    image_bg TEXT,
    position INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL
  );
`)

const defaultContent = {
  heroName: "Leul Abera",
  heroIntro:
    "Full-stack developer focused on building reliable, scalable, and modern web applications that turn ideas into practical digital experiences.",
  aboutText:
    "I build practical digital experiences, from thoughtful interfaces to dependable backend systems.",
  profileImage: "/leul_image.png",
  resumeUrl: "/LEUL_ABERA_CV.pdf",
  email: "leulabera321@gmail.com",
  location: "Addis Ababa, Ethiopia",
  phone: "+251 979 254 066",
  availability: "Available for opportunities",
  contactDescription:
    "Have a project in mind, a job opportunity, or simply want to connect? Send me a message and I'll get back to you.",
}

const seededProjects = [
  {
    title: "Landlord Tenant Management System",
    description:
      "End-to-end governmental web application for managing tenants, leases, and payments of Addis Ababa houses with a secure administrative dashboard.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/betochbureau.png",
    links: {
      github: "https://github.com/Robani-G/LTMS",
      live: "https://aahdabrhrcas.gov.et/",
    },
  },
  {
    title: "Budget Request & Cashflow",
    description:
      "Governmental web application for managing budget requests and cashflow with a centralized dashboard and structured financial management workflows.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/financebureau.png",
    links: { github: "https://github.com/Robani-G/Budget-Request-and-Cashflow-" },
  },
  {
    title: "Menschen fuer Menschen",
    description:
      "A web application for managing Tender, bids, projects, and beneficiaries for the NGO Menschen fuer Menschen, with a secure administrative dashboard and reporting features.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/MFM-logo.jpg",
    links: { github: "https://github.com/Robani-G/MFM" },
  },
  {
    title: "Digital Menu Management System",
    description:
      "Restaurant web application for managing digital menus and customer orders, supported by a secure administration dashboard for restaurant owners.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/mamaskitchen-logo.png",
    links: { github: "https://github.com/Leul-ab/DMMS", live: "https://mamaskitchen.ethioinnovation.com/" },
    imageFit: "contain",
    imageBg: "bg-white",
  },
  {
    title: "NIB Insurance API",
    description:
      "RESTful API for handling insurance claims and policy management with authentication and data validation.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "backend",
    image: "/nibinsurance.png",
    links: { github: "https://github.com/Leul-ab/NIB-Insurance", live: "https://nib-insurance-1.onrender.com" },
  },
  {
    title: "ArifMenu",
    description:
      "Restaurant menu web application with dynamic menu management, order tracking, and responsive design for mobile and desktop.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "backend",
    image: "/arifmenu.webp",
    links: {},
  },
]

if (!database.prepare("SELECT id FROM content WHERE id = 1").get()) {
  database.prepare("INSERT INTO content (id, value) VALUES (1, ?)").run(JSON.stringify(defaultContent))
}
if (database.prepare("SELECT COUNT(*) AS count FROM projects").get().count === 0) {
  const insertProject = database.prepare(`
    INSERT INTO projects (title, description, tags, category, image, links, image_fit, image_bg, position)
    VALUES (@title, @description, @tags, @category, @image, @links, @image_fit, @image_bg, @position)
  `)
  const seedProjects = database.transaction(() => {
    seededProjects.forEach((project, position) => {
      insertProject.run({
        ...project,
        tags: JSON.stringify(project.tags),
        links: JSON.stringify(project.links),
        image_fit: project.imageFit || null,
        image_bg: project.imageBg || null,
        position,
      })
    })
  })
  seedProjects()
}

const app = express()
app.disable("x-powered-by")
// Behind Vercel's rewrite proxy and Render's load balancer, trust the forwarding hops so
// request.ip is the visitor's IP (used by the rate limiters) instead of the proxy's IP.
if (process.env.TRUST_PROXY) {
  const hops = Number(process.env.TRUST_PROXY)
  app.set("trust proxy", Number.isNaN(hops) ? process.env.TRUST_PROXY : hops)
}
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff")
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  next()
})
app.use(express.json({ limit: "32kb" }))
app.use("/uploads", express.static(uploadsDirectory, { maxAge: "1d" }))

const contentFields = Object.keys(defaultContent)
const getContent = () => JSON.parse(database.prepare("SELECT value FROM content WHERE id = 1").get().value)
const encodeProject = (row) => ({
  id: row.id,
  title: row.title,
  desc: row.description,
  tags: JSON.parse(row.tags),
  category: row.category,
  image: row.image,
  links: JSON.parse(row.links),
  ...(row.image_fit ? { imageFit: row.image_fit } : {}),
  ...(row.image_bg ? { imageBg: row.image_bg } : {}),
})
const getProjects = () =>
  database.prepare("SELECT * FROM projects ORDER BY position, id").all().map(encodeProject)

function readCookie(request, name) {
  const cookie = request.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : ""
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function requireAdmin(request, response, next) {
  const token = readCookie(request, "portfolio_session")
  if (!token) return response.status(401).json({ error: "Authentication required." })
  const tokenHash = hashToken(token)
  const session = database.prepare("SELECT expires_at FROM sessions WHERE token_hash = ?").get(tokenHash)
  if (!session || session.expires_at < Date.now()) {
    database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash)
    return response.status(401).json({ error: "Your session has expired. Sign in again." })
  }
  next()
}

const attempts = new Map()
function limitRequests(limit, windowMs, message) {
  return (request, response, next) => {
    const key = `${request.path}:${request.ip}`
    const now = Date.now()
    const record = attempts.get(key)
    if (!record || record.resetAt < now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }
    if (record.count >= limit) return response.status(429).json({ error: message })
    record.count += 1
    next()
  }
}

const loginFailures = new Map()
function limitFailedLogins(limit, windowMs) {
  return (request, response, next) => {
    const key = request.ip
    const now = Date.now()
    const record = loginFailures.get(key)
    if (record && record.resetAt > now && record.count >= limit) {
      return response.status(429).json({ error: "Too many sign-in attempts. Try again later." })
    }

    response.on("finish", () => {
      if (response.statusCode === 401) {
        const current = loginFailures.get(key)
        if (!current || current.resetAt <= now) {
          loginFailures.set(key, { count: 1, resetAt: now + windowMs })
        } else {
          current.count += 1
        }
      } else if (response.statusCode < 400) {
        loginFailures.delete(key)
      }
    })
    next()
  }
}

const imageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
])
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${crypto.randomUUID()}${imageTypes.get(file.mimetype) || ".bin"}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!imageTypes.has(file.mimetype)) return callback(new Error("Upload a JPG, PNG, WebP, or GIF image."))
    callback(null, true)
  },
})

app.get("/api/health", (_request, response) => response.json({ ok: true }))
app.get("/api/content", (_request, response) => response.json(getContent()))
app.get("/api/projects", (_request, response) => response.json(getProjects()))

app.post("/api/contact", limitRequests(5, 15 * 60 * 1000, "Please wait before sending another message."), (request, response) => {
  const { name, email, subject = "", message } = request.body || {}
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return response.status(400).json({ error: "Please complete the required fields." })
  }
  const clean = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }
  if (!clean.name || clean.name.length > 120 || clean.email.length > 254 || !/^\S+@\S+\.\S+$/.test(clean.email) || clean.subject.length > 180 || !clean.message || clean.message.length > 5000) {
    return response.status(400).json({ error: "Check the name, email, and message lengths and try again." })
  }
  database.prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)").run(clean.name, clean.email, clean.subject, clean.message)
  response.status(201).json({ message: "Message received." })
})

app.post("/api/admin/login", limitFailedLogins(8, 15 * 60 * 1000), (request, response) => {
  const username = process.env.ADMIN_USERNAME || ""
  const password = process.env.ADMIN_PASSWORD || ""
  if (!username || !password) {
    return response.status(503).json({ error: "Set ADMIN_USERNAME and ADMIN_PASSWORD in the server environment." })
  }
  if (process.env.NODE_ENV === "production" && (!username || password.length < 12)) {
    return response.status(503).json({ error: "Admin credentials are not configured securely." })
  }
  const submittedUsername = String(request.body?.username || "")
  const submittedPassword = String(request.body?.password || "")
  const matches = (left, right) => {
    const leftBuffer = Buffer.from(left)
    const rightBuffer = Buffer.from(right)
    return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
  }
  if (!username || !password || !matches(submittedUsername, username) || !matches(submittedPassword, password)) {
    return response.status(401).json({ error: "Incorrect username or password." })
  }
  const token = crypto.randomBytes(32).toString("base64url")
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  database.prepare("INSERT INTO sessions (token_hash, expires_at) VALUES (?, ?)").run(hashToken(token), expiresAt)
  response.cookie("portfolio_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresAt - Date.now(),
    path: "/",
  })
  response.json({ authenticated: true })
})

app.get("/api/admin/session", requireAdmin, (_request, response) => response.json({ authenticated: true }))
app.post("/api/admin/logout", (request, response) => {
  const token = readCookie(request, "portfolio_session")
  if (token) database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token))
  response.clearCookie("portfolio_session", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/" })
  response.json({ authenticated: false })
})

app.put("/api/admin/content", requireAdmin, (request, response) => {
  const current = getContent()
  const nextContent = { ...current }
  for (const field of contentFields) {
    if (typeof request.body?.[field] !== "string") return response.status(400).json({ error: `The ${field} field must be text.` })
    const value = request.body[field].trim()
    if (value.length > 5000) return response.status(400).json({ error: `${field} is too long.` })
    nextContent[field] = value
  }
  database.prepare("UPDATE content SET value = ? WHERE id = 1").run(JSON.stringify(nextContent))
  response.json(nextContent)
})

app.post("/api/admin/upload", requireAdmin, upload.single("image"), (request, response) => {
  if (!request.file) return response.status(400).json({ error: "Choose an image to upload." })
  response.status(201).json({ url: `/uploads/${request.file.filename}` })
})

function validateProject(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : ""
  const description = typeof body?.desc === "string" ? body.desc.trim() : ""
  const image = typeof body?.image === "string" ? body.image.trim() : ""
  const tags = Array.isArray(body?.tags) ? body.tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 12) : []
  const category = body?.category
  if (!title || title.length > 160 || !description || description.length > 2000 || !image || image.length > 500 || !["fullstack", "backend"].includes(category)) return null
  const links = {}
  for (const key of ["github", "live"]) {
    const value = body.links?.[key]
    if (typeof value === "string" && value.trim()) {
      try {
        const url = new URL(value.trim())
        if (!["http:", "https:"].includes(url.protocol)) return null
        links[key] = url.href
      } catch {
        return null
      }
    }
  }
  return { title, description, tags, category, image, links, imageFit: body.imageFit === "contain" ? "contain" : null, imageBg: typeof body.imageBg === "string" ? body.imageBg.slice(0, 80) : null }
}

const saveProject = database.prepare(`
  INSERT INTO projects (title, description, tags, category, image, links, image_fit, image_bg, position)
  VALUES (@title, @description, @tags, @category, @image, @links, @image_fit, @image_bg, @position)
`)
function projectRow(project, position) {
  return {
    ...project,
    tags: JSON.stringify(project.tags),
    links: JSON.stringify(project.links),
    image_fit: project.imageFit,
    image_bg: project.imageBg,
    position,
  }
}

app.post("/api/admin/projects", requireAdmin, (request, response) => {
  const project = validateProject(request.body)
  if (!project) return response.status(400).json({ error: "Check the project details and links." })
  const position = database.prepare("SELECT COALESCE(MAX(position), -1) + 1 AS position FROM projects").get().position
  const result = saveProject.run(projectRow(project, position))
  response.status(201).json(encodeProject(database.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid)))
})

app.put("/api/admin/projects/:id", requireAdmin, (request, response) => {
  const project = validateProject(request.body)
  if (!project) return response.status(400).json({ error: "Check the project details and links." })
  const result = database.prepare(`
    UPDATE projects SET title=@title, description=@description, tags=@tags, category=@category,
      image=@image, links=@links, image_fit=@image_fit, image_bg=@image_bg WHERE id=@id
  `).run({ ...projectRow(project, 0), id: Number(request.params.id) })
  if (!result.changes) return response.status(404).json({ error: "Project not found." })
  response.json(encodeProject(database.prepare("SELECT * FROM projects WHERE id = ?").get(Number(request.params.id))))
})

app.delete("/api/admin/projects/:id", requireAdmin, (request, response) => {
  const result = database.prepare("DELETE FROM projects WHERE id = ?").run(Number(request.params.id))
  if (!result.changes) return response.status(404).json({ error: "Project not found." })
  response.status(204).end()
})

app.get("/api/admin/messages", requireAdmin, (_request, response) => {
  response.json(database.prepare("SELECT id, name, email, subject, message, is_read AS isRead, created_at AS createdAt FROM messages ORDER BY id DESC").all())
})

app.patch("/api/admin/messages/:id", requireAdmin, (request, response) => {
  const result = database.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(request.body?.isRead ? 1 : 0, Number(request.params.id))
  if (!result.changes) return response.status(404).json({ error: "Message not found." })
  response.json({ updated: true })
})

app.delete("/api/admin/messages/:id", requireAdmin, (request, response) => {
  const result = database.prepare("DELETE FROM messages WHERE id = ?").run(Number(request.params.id))
  if (!result.changes) return response.status(404).json({ error: "Message not found." })
  response.status(204).end()
})

app.use("/api", (_request, response) => response.status(404).json({ error: "API route not found." }))
if (fs.existsSync(buildDirectory)) app.use(express.static(buildDirectory))
app.get("/{*path}", (_request, response) => {
  const indexPath = path.join(buildDirectory, "index.html")
  if (fs.existsSync(indexPath)) return response.sendFile(indexPath)
  response.status(404).send("Build the frontend with npm run build before starting the production server.")
})

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return response.status(400).json({ error: "Images must be 5 MB or smaller." })
  }
  response.status(400).json({ error: error.message || "The request could not be processed." })
})

app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`))