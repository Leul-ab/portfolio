import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { ArrowLeft, Check, Eye, EyeOff, LogOut, Mail, Plus, Save, Trash2 } from "lucide-react"
import type { SiteContent } from "../context/SiteContentContext"
import { apiRequest } from "../lib/api"

type Project = {
  id: number
  title: string
  desc: string
  tags: string[]
  category: "fullstack" | "backend"
  image: string
  links: { github?: string; live?: string }
  imageFit?: "cover" | "contain"
  imageBg?: string
}

type ProjectDraft = Omit<Project, "id" | "tags" | "links"> & {
  tags: string
  github: string
  live: string
}

type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean | number
  createdAt: string
}

const emptyProject: ProjectDraft = {
  title: "",
  desc: "",
  tags: "",
  category: "fullstack",
  image: "",
  github: "",
  live: "",
  imageFit: "cover",
  imageBg: "",
}

const contentFields: { key: keyof SiteContent; label: string; multiline?: boolean }[] = [
  { key: "heroName", label: "Name shown in the hero" },
  { key: "heroIntro", label: "Hero introduction", multiline: true },
  { key: "aboutText", label: "About text", multiline: true },
  { key: "profileImage", label: "Profile image path" },
  { key: "resumeUrl", label: "Resume URL or path" },
  { key: "email", label: "Contact email" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone number" },
  { key: "availability", label: "Availability label" },
  { key: "contactDescription", label: "Contact introduction", multiline: true },
]

const inputClass = "mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-3 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
const labelClass = "block text-sm font-medium text-zinc-300"

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className={labelClass}>{label}{children}</label>
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [tab, setTab] = useState<"content" | "projects" | "messages">("content")
  const [draft, setDraft] = useState<ProjectDraft>(emptyProject)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  async function loadDashboard() {
    const [nextContent, nextProjects, nextMessages] = await Promise.all([
      apiRequest<SiteContent>("/api/content"),
      apiRequest<Project[]>("/api/projects"),
      apiRequest<Message[]>("/api/admin/messages"),
    ])
    setContent(nextContent)
    setProjects(nextProjects)
    setMessages(nextMessages)
  }

  useEffect(() => {
    apiRequest("/api/admin/session")
      .then(async () => {
        setAuthenticated(true)
        await loadDashboard()
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false))
  }, [])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })
      setAuthenticated(true)
      setPassword("")
      await loadDashboard()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.")
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    await apiRequest("/api/admin/logout", { method: "POST" }).catch(() => undefined)
    setAuthenticated(false)
    setContent(null)
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content) return
    setBusy(true)
    setError("")
    try {
      setContent(await apiRequest<SiteContent>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify(content),
      }))
      setNotice("Site details saved")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save site details.")
    } finally {
      setBusy(false)
    }
  }

  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.set("image", file)
    const result = await apiRequest<{ url: string }>("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
    return result.url
  }

  async function uploadForContent(file?: File) {
    if (!file || !content) return
    setBusy(true)
    setError("")
    try {
      const url = await uploadImage(file)
      setContent({ ...content, profileImage: url })
      setNotice("Image uploaded. Save site details to publish it.")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Image upload failed.")
    } finally {
      setBusy(false)
    }
  }

  async function uploadForProject(file?: File) {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const url = await uploadImage(file)
      setDraft((current) => ({ ...current, image: url }))
      setNotice("Image uploaded. Save the project to publish it.")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Image upload failed.")
    } finally {
      setBusy(false)
    }
  }

  function beginEdit(project: Project) {
    setEditingId(project.id)
    setDraft({
      title: project.title,
      desc: project.desc,
      tags: project.tags.join(", "),
      category: project.category,
      image: project.image,
      github: project.links.github || "",
      live: project.links.live || "",
      imageFit: project.imageFit || "cover",
      imageBg: project.imageBg || "",
    })
    setTab("projects")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")
    const body = JSON.stringify({
      ...draft,
      tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      links: { github: draft.github, live: draft.live },
    })
    try {
      const saved = await apiRequest<Project>(editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects", {
        method: editingId ? "PUT" : "POST",
        body,
      })
      setProjects((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [...current, saved])
      setDraft(emptyProject)
      setEditingId(null)
      setNotice(editingId ? "Project updated" : "Project added")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save project.")
    } finally {
      setBusy(false)
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete “${project.title}”?`)) return
    try {
      await apiRequest(`/api/admin/projects/${project.id}`, { method: "DELETE" })
      setProjects((current) => current.filter((item) => item.id !== project.id))
      setNotice("Project deleted")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete project.")
    }
  }

  async function toggleRead(message: Message) {
    try {
      await apiRequest(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: !message.isRead }),
      })
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, isRead: !item.isRead } : item))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update message.")
    }
  }

  async function deleteMessage(message: Message) {
    try {
      await apiRequest(`/api/admin/messages/${message.id}`, { method: "DELETE" })
      setMessages((current) => current.filter((item) => item.id !== message.id))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete message.")
    }
  }

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-zinc-950 text-sm text-zinc-400">Loading administration...</div>
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-5 text-zinc-100">
        <form onSubmit={handleLogin} className="w-full max-w-sm border border-zinc-800 bg-zinc-900/70 p-7">
          <a href="/" className="mb-9 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"><ArrowLeft size={16} /> Portfolio</a>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Administration</p>
          <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Use the administrator credentials configured for this server.</p>
          <div className="mt-7 space-y-4">
            <Field label="Username"><input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} /></Field>
            <Field label="Password">
              <span className="relative mt-2 block">
                <input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} mt-0 pr-12`} />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-400 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </Field>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50">{busy ? "Signing in..." : "Sign in"}</button>
        </form>
      </main>
    )
  }

  const unreadCount = messages.filter((message) => !message.isRead).length

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Portfolio</p>
            <h1 className="mt-1 text-lg font-semibold">Admin workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 sm:inline-flex"><ArrowLeft size={15} /> View site</a>
            <button onClick={handleLogout} title="Sign out" className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600"><LogOut size={15} /><span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <nav className="mb-7 flex gap-1 border-b border-zinc-800" aria-label="Admin sections">
          {([
            ["content", "Site content"],
            ["projects", `Projects (${projects.length})`],
            ["messages", `Inbox (${unreadCount})`],
          ] as const).map(([value, label]) => (
            <button key={value} onClick={() => setTab(value)} className={`border-b-2 px-4 py-3 text-sm transition ${tab === value ? "border-emerald-400 text-emerald-300" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>{label}</button>
          ))}
        </nav>

        {notice && <p role="status" className="mb-4 flex items-center gap-2 text-sm text-emerald-300"><Check size={15} />{notice}</p>}
        {error && <p role="alert" className="mb-4 rounded-md border border-rose-900/60 bg-rose-950/30 px-4 py-3 text-sm text-rose-300">{error}</p>}

        {tab === "content" && content && (
          <section className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Site content</h2>
              <p className="mt-1 text-sm text-zinc-500">Update the public profile, copy, contact details, and images.</p>
            </div>
            <form onSubmit={saveContent} className="space-y-5 border border-zinc-800 bg-zinc-900/30 p-5 sm:p-7">
              {contentFields.map(({ key, label, multiline }) => (
                <Field key={key} label={label}>
                  {multiline ? (
                    <textarea rows={3} value={content[key]} onChange={(event) => setContent({ ...content, [key]: event.target.value })} className={inputClass} />
                  ) : (
                    <input value={content[key]} onChange={(event) => setContent({ ...content, [key]: event.target.value })} className={inputClass} />
                  )}
                </Field>
              ))}
              <Field label="Upload a new profile image (JPG, PNG, WebP, GIF; 5 MB max)">
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => void uploadForContent(event.target.files?.[0])} className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-200 hover:file:bg-zinc-700" />
              </Field>
              {content.profileImage && <img src={content.profileImage} alt="Current profile" className="h-28 w-28 rounded-md border border-zinc-700 object-cover" />}
              <button disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"><Save size={16} />Save site content</button>
            </form>
          </section>
        )}

        {tab === "projects" && (
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Projects <span className="text-sm font-normal text-zinc-500">{projects.length} total</span></h2>
              <div className="divide-y divide-zinc-800 border-y border-zinc-800">
                {projects.map((project) => (
                  <article key={project.id} className="flex gap-4 py-4">
                    <img src={project.image} alt="" className="h-16 w-20 shrink-0 rounded border border-zinc-800 bg-zinc-900 object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{project.desc}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-emerald-400">{project.category}</p>
                    </div>
                    <div className="flex shrink-0 items-start gap-1">
                      <button onClick={() => beginEdit(project)} className="rounded-md border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-zinc-600">Edit</button>
                      <button onClick={() => void deleteProject(project)} title="Delete project" className="rounded-md border border-zinc-800 p-1.5 text-zinc-500 hover:border-rose-800 hover:text-rose-300"><Trash2 size={15} /></button>
                    </div>
                  </article>
                ))}
                {!projects.length && <p className="py-8 text-sm text-zinc-500">No projects yet.</p>}
              </div>
            </section>

            <form onSubmit={saveProject} className="space-y-4 border border-zinc-800 bg-zinc-900/30 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? "Edit project" : "Add a project"}</h2>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(emptyProject) }} className="text-xs text-zinc-500 hover:text-white">Cancel edit</button>}
              </div>
              <Field label="Title"><input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} /></Field>
              <Field label="Description"><textarea required rows={3} value={draft.desc} onChange={(event) => setDraft({ ...draft, desc: event.target.value })} className={inputClass} /></Field>
              <Field label="Tags, separated by commas"><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} className={inputClass} /></Field>
              <Field label="Category"><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as ProjectDraft["category"] })} className={inputClass}><option value="fullstack">Full stack</option><option value="backend">Backend</option></select></Field>
              <Field label="Image path or URL"><input required value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="Upload below, or /image-in-public.png, or https://..." className={inputClass} /></Field>
              <Field label="Upload project image (5 MB max)"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => void uploadForProject(event.target.files?.[0])} className="mt-2 block w-full text-sm text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:text-zinc-200" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="GitHub URL"><input type="url" value={draft.github} onChange={(event) => setDraft({ ...draft, github: event.target.value })} className={inputClass} /></Field>
                <Field label="Live URL"><input type="url" value={draft.live} onChange={(event) => setDraft({ ...draft, live: event.target.value })} className={inputClass} /></Field>
              </div>
              <Field label="Image fit"><select value={draft.imageFit} onChange={(event) => setDraft({ ...draft, imageFit: event.target.value as ProjectDraft["imageFit"] })} className={inputClass}><option value="cover">Cover</option><option value="contain">Contain</option></select></Field>
              <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50">{editingId ? <Save size={16} /> : <Plus size={16} />}{editingId ? "Save project" : "Add project"}</button>
            </form>
          </div>
        )}

        {tab === "messages" && (
          <section>
            <div className="mb-5 flex items-center gap-3"><Mail className="text-emerald-400" size={19} /><div><h2 className="text-xl font-semibold">Contact inbox</h2><p className="mt-1 text-sm text-zinc-500">Messages submitted through the public contact form.</p></div></div>
            <div className="divide-y divide-zinc-800 border-y border-zinc-800">
              {messages.map((message) => (
                <article key={message.id} className={`py-5 ${message.isRead ? "opacity-70" : ""}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2"><h3 className="font-semibold">{message.name}</h3>{!message.isRead && <span className="rounded-sm bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">New</span>}</div>
                      <a href={`mailto:${message.email}`} className="mt-1 inline-block text-sm text-emerald-300 hover:text-emerald-200">{message.email}</a>
                      <p className="mt-2 text-sm font-medium text-zinc-200">{message.subject || "No subject"}</p>
                    </div>
                    <time className="text-xs text-zinc-500">{new Date(message.createdAt.replace(" ", "T") + "Z").toLocaleString()}</time>
                  </div>
                  <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-zinc-400">{message.message}</p>
                  <div className="mt-3 flex gap-2">
                    <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Your message"}`)}`} className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-600">Reply by email</a>
                    <button onClick={() => void toggleRead(message)} className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600">Mark as {message.isRead ? "unread" : "read"}</button>
                    <button onClick={() => void deleteMessage(message)} className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-900">Delete</button>
                  </div>
                </article>
              ))}
              {!messages.length && <div className="py-14 text-center"><Mail className="mx-auto text-zinc-700" size={24} /><p className="mt-3 text-sm text-zinc-500">Your inbox is empty.</p></div>}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}