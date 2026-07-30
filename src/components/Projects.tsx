import { useState } from "react"
import Reveal from "./Reveal"

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-stack marketplace with real-time inventory, Stripe payments, admin dashboard, and role-based authentication.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "fullstack",
    links: { github: "#", live: "#" },
  },
  {
    title: "Real-Time Chat App",
    desc: "Messaging app with WebSockets, typing indicators, file sharing, and message persistence using MongoDB.",
    tags: ["Next.js", "Socket.io", "MongoDB", "Redis"],
    category: "fullstack",
    links: { github: "#", live: "#" },
  },
  {
    title: "Task Management Tool",
    desc: "Kanban-style project management with drag-and-drop, team collaboration, and analytics dashboards.",
    tags: ["React", "TypeScript", "Django", "Docker"],
    category: "frontend",
    links: { github: "#", live: "#" },
  },
  {
    title: "AI Content Generator",
    desc: "AI-powered writing assistant with OpenAI integration, template library, and export to multiple formats.",
    tags: ["Next.js", "Python", "OpenAI", "AWS"],
    category: "fullstack",
    links: { github: "#", live: "#" },
  },
]

const filters = [
  { label: "All", value: "all" },
  { label: "Full Stack", value: "fullstack" },
  { label: "Frontend", value: "frontend" },
] as const

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="py-24 px-4 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured <span className="text-indigo-400">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-8" />
        </Reveal>

        <Reveal delay={100}>
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeFilter === f.value
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <Reveal key={project.title} direction="up" delay={i * 100}>
              <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 hover:shadow-[0_0_32px_-8px_rgba(99,102,241,0.15)] transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border-b border-zinc-800 overflow-hidden">
                  <span className="text-5xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">
                    📁
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={project.links.github}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 group/link"
                    >
                      GitHub
                      <span className="group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                    <a
                      href={project.links.live}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 group/link"
                    >
                      Live Demo
                      <span className="group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
