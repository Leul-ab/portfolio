import "dotenv/config"
import dns from "node:dns"
import crypto from "node:crypto"

dns.setDefaultResultOrder("ipv4first")
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import multer from "multer"
import nodemailer from "nodemailer"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
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
  profileImage: "/leul_image.webp",
  resumeUrl: "/LEUL_ABERA_CV.pdf",
  showResume: true,
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
const getContent = async () => {
  const rows = await query("SELECT value FROM content WHERE id = 1")
  return { ...defaultContent, ...(rows[0] ? JSON.parse(rows[0].value) : {}) }
}
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
app.get("/api/content", async (_request, response) => {
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  response.json(await getContent())
})
app.get("/api/projects", async (_request, response) => {
  response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  response.json(await getProjects())
})

const mailTransporter =
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })
    : null

async function sendNotificationEmail({ name, email, subject, message }) {
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER || "leulabera321@gmail.com"
  const cleanSubject = subject ? subject : "New Contact Submission"
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff; color: #18181b;">
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #4338ca; font-size: 20px; font-weight: 700;">New Portfolio Message</h2>
        <p style="margin: 4px 0 0; color: #71717a; font-size: 13px;">Someone reached out through the contact form on your portfolio.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: 600; width: 100px;">From:</td>
          <td style="padding: 8px 0; color: #18181b; font-size: 14px; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0; color: #4f46e5; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
        </tr>
        ${
          subject
            ? `<tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: 600;">Subject:</td>
          <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${subject}</td>
        </tr>`
            : ""
        }
      </table>

      <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">Message:</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${safeMessage}</p>
      </div>

      <div style="text-align: center; padding-top: 12px; border-top: 1px solid #f4f4f5;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(cleanSubject)}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">Reply to ${name}</a>
      </div>
    </div>
  `

  // 1. Resend API (HTTPS port 443 — recommended on Render to bypass SMTP port blocking)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [recipient],
          reply_to: email,
          subject: `[Portfolio] ${cleanSubject} - ${name}`,
          html,
          text: `New contact submission from ${name} (${email}):\n\nSubject: ${cleanSubject}\n\nMessage:\n${message}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Resend API rejected email:", errorData)
      } else {
        console.log("Email notification sent successfully via Resend.")
        return
      }
    } catch (error) {
      console.error("Failed to send via Resend:", error.message)
    }
  }

  // 2. Gmail Nodemailer fallback (for local development or environments with open SMTP ports)
  if (!mailTransporter) {
    console.log("Email notification skipped: neither RESEND_API_KEY nor GMAIL_USER/GMAIL_APP_PASSWORD is set.")
    return
  }

  await mailTransporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `[Portfolio] ${cleanSubject} - ${name}`,
    text: `New contact submission from ${name} (${email}):\n\nSubject: ${cleanSubject}\n\nMessage:\n${message}`,
    html,
  })
}

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
  
  // Send email notification in the background
  sendNotificationEmail(clean).catch((error) => {
    console.error("Failed to send contact notification email:", error)
  })

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

async function updateContentHandler(request, response) {
  const current = await getContent()
  const nextContent = { ...current }
  const body = request.body || {}

  if ("showResume" in body) {
    nextContent.showResume = Boolean(body.showResume)
  }

  for (const field of contentFields) {
    if (field === "showResume") continue
    if (body[field] === undefined) continue
    if (typeof body[field] !== "string") {
      return response.status(400).json({ error: `The ${field} field must be text.` })
    }
    const value = body[field].trim()
    if (value.length > 5000) {
      return response.status(400).json({ error: `${field} is too long.` })
    }
    nextContent[field] = value
  }

  await query("UPDATE content SET value = $1 WHERE id = 1", [JSON.stringify(nextContent)])
  response.json(nextContent)
}

app.put("/api/admin/content", requireAdmin, updateContentHandler)
app.patch("/api/admin/content", requireAdmin, updateContentHandler)

app.post("/api/admin/upload", requireAdmin, upload.single("image"), async (request, response) => {
  if (!request.file) return response.status(400).json({ error: "Choose an image to upload." })
  if (!useCloudinary) return response.status(201).json({ url: `/uploads/${request.file.filename}` })
  try {
    response.status(201).json({ url: await uploadToCloudinary(request.file.buffer) })
  } catch (error) {
    console.error("Cloudinary upload failed:", error)
    const code = error?.http_code
    const reason =
      code === 401 || code === 403
        ? "Cloudinary rejected the credentials. Check CLOUDINARY_URL (api key, secret, and cloud name) on the server."
        : code === 404
          ? "Cloudinary cloud name not found. Check the cloud name at the end of CLOUDINARY_URL."
          : `Image upload to Cloudinary failed${error?.message ? `: ${error.message}` : "."}`
    response.status(502).json({ error: reason })
  }
})

const cvTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
])

const cvUpload = multer({
  storage: useCloudinary
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: uploadsDirectory,
        filename: (_request, file, callback) => {
          const ext = path.extname(file.originalname).toLowerCase() || ".pdf"
          callback(null, `cv-${crypto.randomUUID()}${ext}`)
        },
      }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!cvTypes.has(file.mimetype) && !ext.match(/\.(pdf|docx?)$/)) {
      return callback(clientError("Upload a PDF or Word document for your CV."))
    }
    callback(null, true)
  },
})

function uploadRawToCloudinary(buffer, originalname) {
  return new Promise((resolve, reject) => {
    const parsed = path.parse(originalname)
    const cleanName = (parsed.name || "cv").replace(/[^a-zA-Z0-9-_]/g, "_")
    const ext = parsed.ext || ".pdf"
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio/docs",
          resource_type: "raw",
          public_id: `${cleanName}-${crypto.randomUUID().slice(0, 8)}${ext}`,
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error("CV upload failed."))
          resolve(result.secure_url)
        }
      )
      .end(buffer)
  })
}

app.post("/api/admin/upload-cv", requireAdmin, cvUpload.single("cv"), async (request, response) => {
  if (!request.file) return response.status(400).json({ error: "Choose a CV file (PDF or Word) to upload." })
  if (!useCloudinary) return response.status(201).json({ url: `/uploads/${request.file.filename}` })
  try {
    const url = await uploadRawToCloudinary(request.file.buffer, request.file.originalname)
    response.status(201).json({ url })
  } catch (error) {
    console.error("Cloudinary CV upload failed:", error)
    response.status(502).json({ error: "CV upload failed. You can also paste a direct link." })
  }
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
