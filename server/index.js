import "dotenv/config"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import multer from "multer"
import pg from "pg"

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const uploadsDirectory = path.join(rootDirectory, "public", "uploads")
const buildDirectory = path.join(rootDirectory, "dist")
const port = Number(process.env.PORT || 3001)

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add your Neon Postgres connection string to the environment (see .env.example).")
  process.exit(1)
}

// Images go to Cloudinary when CLOUDINARY_URL is set (production); otherwise to public/uploads for local development.
// Tolerate common copy/paste mistakes: surrounding whitespace/quotes or a pasted "CLOUDINARY_URL=" prefix.
const cloudinaryUrl = (process.env.CLOUDINARY_URL || "").trim().replace(/^CLOUDINARY_URL=/, "").replace(/^["']|["']$/g, "")
if (cloudinaryUrl && !cloudinaryUrl.startsWith("cloudinary://")) {
  console.error("CLOUDINARY_URL must look like cloudinary://<api_key>:<api_secret>@<cloud_name> (copy it from Cloudinary Dashboard > API Keys), or be removed to disable Cloudinary.")
  process.exit(1)
}
if (cloudinaryUrl) process.env.CLOUDINARY_URL = cloudinaryUrl
else delete process.env.CLOUDINARY_URL
const useCloudinary = Boolean(cloudinaryUrl)
// Imported lazily: the cloudinary package validates CLOUDINARY_URL as soon as it loads.
const cloudinary = useCloudinary ? (await import("cloudinary")).v2 : null
if (!useCloudinary) fs.mkdirSync(uploadsDirectory, { recursive: true })

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
const query = async (text, params) => (await pool.query(text, params)).rows

await pool.query(`
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    expires_at BIGINT NOT NULL
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

const insertProjectSql = `
  INSERT INTO projects (title, description, tags, category, image, links, image_fit, image_bg, position)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *
`
function projectParams(project, position) {
  return [
    project.title,
    project.description,
    JSON.stringify(project.tags),
    project.category,
    project.image,
    JSON.stringify(project.links),
    project.imageFit || null,
    project.imageBg || null,
    position,
  ]
}

await query("INSERT INTO content (id, value) VALUES (1, $1) ON CONFLICT (id) DO NOTHING", [JSON.stringify(defaultContent)])
{
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    // Lock so two instances starting together cannot both seed.
    await client.query("LOCK TABLE projects IN EXCLUSIVE MODE")
    const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM projects")
    if (rows[0].count === 0) {
      for (const [position, project] of seededProjects.entries()) {
        await client.query(insertProjectSql, projectParams(project, position))
      }
    }
    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
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
if (!useCloudinary) app.use("/uploads", express.static(uploadsDirectory, { maxAge: "1d" }))

const contentFields = Object.keys(defaultContent)
const getContent = async () => JSON.parse((await query("SELECT value FROM content WHERE id = 1"))[0].value)
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
const getProjects = async () => (await query("SELECT * FROM projects ORDER BY position, id")).map(encodeProject)

function readCookie(request, name) {
  const cookie = request.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : ""
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

async function requireAdmin(request, response, next) {
  const token = readCookie(request, "portfolio_session")
  if (!token) return response.status(401).json({ error: "Authentication required." })
  const tokenHash = hashToken(token)
  const [session] = await query("SELECT expires_at FROM sessions WHERE token_hash = $1", [tokenHash])
  if (!session || Number(session.expires_at) < Date.now()) {
    await query("DELETE FROM sessions WHERE token_hash = $1", [tokenHash])
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

function clientError(message) {
  return Object.assign(new Error(message), { status: 400 })
}

const imageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
])
const upload = multer({
  storage: useCloudinary
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: uploadsDirectory,
        filename: (_request, file, callback) => {
          callback(null, `${crypto.randomUUID()}${imageTypes.get(file.mimetype) || ".bin"}`)
        },
      }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!imageTypes.has(file.mimetype)) return callback(clientError("Upload a JPG, PNG, WebP, or GIF image."))
    callback(null, true)
  },
})

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "portfolio", resource_type: "image" }, (error, result) => {
        if (error || !result) return reject(error || new Error("Image upload failed."))
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}

app.get("/api/health", (_request, response) => response.json({ ok: true }))
app.get("/api/content", async (_request, response) => response.json(await getContent()))
app.get("/api/projects", async (_request, response) => response.json(await getProjects()))

app.post("/api/contact", limitRequests(5, 15 * 60 * 1000, "Please wait before sending another message."), async (request, response) => {
  const { name, email, subject = "", message } = request.body || {}
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" || typeof subject !== "string") {
    return response.status(400).json({ error: "Please complete the required fields." })
  }
  const clean = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }
  if (!clean.name || clean.name.length > 120 || clean.email.length > 254 || !/^\S+@\S+\.\S+$/.test(clean.email) || clean.subject.length > 180 || !clean.message || clean.message.length > 5000) {
    return response.status(400).json({ error: "Check the name, email, and message lengths and try again." })
  }
  await query("INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)", [clean.name, clean.email, clean.subject, clean.message])
  response.status(201).json({ message: "Message received." })
})

app.post("/api/admin/login", limitFailedLogins(8, 15 * 60 * 1000), async (request, response) => {
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
  await query("DELETE FROM sessions WHERE expires_at < $1", [Date.now()])
  await query("INSERT INTO sessions (token_hash, expires_at) VALUES ($1, $2)", [hashToken(token), expiresAt])
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
app.post("/api/admin/logout", async (request, response) => {
  const token = readCookie(request, "portfolio_session")
  if (token) await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)])
  response.clearCookie("portfolio_session", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/" })
  response.json({ authenticated: false })
})

app.put("/api/admin/content", requireAdmin, async (request, response) => {
  const current = await getContent()
  const nextContent = { ...current }
  for (const field of contentFields) {
    if (typeof request.body?.[field] !== "string") return response.status(400).json({ error: `The ${field} field must be text.` })
    const value = request.body[field].trim()
    if (value.length > 5000) return response.status(400).json({ error: `${field} is too long.` })
    nextContent[field] = value
  }
  await query("UPDATE content SET value = $1 WHERE id = 1", [JSON.stringify(nextContent)])
  response.json(nextContent)
})

app.post("/api/admin/upload", requireAdmin, upload.single("image"), async (request, response) => {
  if (!request.file) return response.status(400).json({ error: "Choose an image to upload." })
  const url = useCloudinary ? await uploadToCloudinary(request.file.buffer) : `/uploads/${request.file.filename}`
  response.status(201).json({ url })
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

const parseId = (value) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null
}

app.post("/api/admin/projects", requireAdmin, async (request, response) => {
  const project = validateProject(request.body)
  if (!project) return response.status(400).json({ error: "Check the project details and links." })
  const [{ position }] = await query("SELECT COALESCE(MAX(position), -1) + 1 AS position FROM projects")
  const [row] = await query(insertProjectSql, projectParams(project, position))
  response.status(201).json(encodeProject(row))
})

app.put("/api/admin/projects/:id", requireAdmin, async (request, response) => {
  const id = parseId(request.params.id)
  const project = validateProject(request.body)
  if (!project) return response.status(400).json({ error: "Check the project details and links." })
  const params = projectParams(project, 0).slice(0, 8)
  const [row] = id
    ? await query(
        `UPDATE projects SET title=$1, description=$2, tags=$3, category=$4, image=$5, links=$6, image_fit=$7, image_bg=$8
         WHERE id=$9 RETURNING *`,
        [...params, id],
      )
    : []
  if (!row) return response.status(404).json({ error: "Project not found." })
  response.json(encodeProject(row))
})

app.delete("/api/admin/projects/:id", requireAdmin, async (request, response) => {
  const id = parseId(request.params.id)
  const rows = id ? await query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]) : []
  if (!rows.length) return response.status(404).json({ error: "Project not found." })
  response.status(204).end()
})

app.get("/api/admin/messages", requireAdmin, async (_request, response) => {
  response.json(await query(`
    SELECT id, name, email, subject, message, is_read AS "isRead",
      to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
    FROM messages ORDER BY id DESC
  `))
})

app.patch("/api/admin/messages/:id", requireAdmin, async (request, response) => {
  const id = parseId(request.params.id)
  const rows = id ? await query("UPDATE messages SET is_read = $1 WHERE id = $2 RETURNING id", [Boolean(request.body?.isRead), id]) : []
  if (!rows.length) return response.status(404).json({ error: "Message not found." })
  response.json({ updated: true })
})

app.delete("/api/admin/messages/:id", requireAdmin, async (request, response) => {
  const id = parseId(request.params.id)
  const rows = id ? await query("DELETE FROM messages WHERE id = $1 RETURNING id", [id]) : []
  if (!rows.length) return response.status(404).json({ error: "Message not found." })
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
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "Images must be 5 MB or smaller." : error.message
    return response.status(400).json({ error: message })
  }
  const status = error.status || error.statusCode || 500
  if (status >= 500) {
    console.error(error)
    return response.status(500).json({ error: "Something went wrong on the server. Try again shortly." })
  }
  response.status(status).json({ error: error.message || "The request could not be processed." })
})

app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`))
