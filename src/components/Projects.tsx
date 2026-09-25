
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Layers3,
} from "lucide-react"
import Reveal from "./Reveal"
import ProjectModal from "./ProjectModal"

type Project = {
  title: string
  desc: string
  tags: string[]
  category: "fullstack" | "backend"
  image: string
  links: {
    github?: string
    live?: string
  }
  imageFit?: "cover" | "contain"
  imageBg?: string
}

const projects: Project[] = [
  {
    title: "Landlord Tenant Management System",
    desc: "End-to-end governmental web application for managing tenants, leases, and payments of Addis Ababa houses with a secure administrative dashboard.",
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
    desc: "Governmental web application for managing budget requests and cashflow with a centralized dashboard and structured financial management workflows.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/financebureau.png",
    links: {
      github: "https://github.com/Robani-G/Budget-Request-and-Cashflow-",
    },
  },

  {
    title: "Menschen fuer Menschen",
    desc: "A web application for managing Tender, bids, projects, and beneficiaries for the NGO Menschen fuer Menschen, with a secure administrative dashboard and reporting features.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/MFM-logo.jpg",
    links: {
      github: "https://github.com/Robani-G/MFM",
    },
  },

  {
    title: "Digital Menu Management System",
    desc: "Restaurant web application for managing digital menus and customer orders, supported by a secure administration dashboard for restaurant owners.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/mamaskitchen-logo.png",
    imageFit: "contain",
    imageBg: "bg-white",
    links: {
      github: "https://github.com/Leul-ab/DMMS",
      live: "https://mamaskitchen.ethioinnovation.com/",
    },
  },
  {
    title: "NIB Insurance API",
    desc: "RESTful API for handling insurance claims and policy management with authentication and data validation.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "backend",
    image: "/nibinsurance.png",
    links: {
      github: "https://github.com/Leul-ab/NIB-Insurance",
      live: "https://nib-insurance-1.onrender.com",
    },
  },
  {
    title: "ArifMenu",
    desc: "Restaurant menu web application with dynamic menu management, order tracking, and responsive design for mobile and desktop.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "backend",
    image: "/arifmenu.webp",
    links: {},
  },
]

const filters = [
  { label: "All Projects", value: "all" },
  { label: "Full Stack", value: "fullstack" },
  { label: "Backend", value: "backend" },
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter)

  return (
    <section
      id="projects"
      className="relative overflow-hidden px-4 py-24 sm:px-6"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-indigo-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
                Selected Work
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              A selection of applications and backend systems I&apos;ve worked
              on, combining modern frontend experiences with reliable backend
              development.
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={100}>
          <div className="mb-10 flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-zinc-100"
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Projects */}
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.article
                layout
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                onClick={() => setSelected(project)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/50 shadow-2xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-indigo-500/5"
              >
                {/* Image */}
                <div
                  className={`relative h-72 overflow-hidden sm:h-80 ${
                    project.imageBg ?? "bg-zinc-900"
                  }`}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${project.image.replace(
                      /^\//,
                      ""
                    )}`}
                    alt={project.title}
                    className={`h-full w-full ${
                      project.imageFit === "contain"
                        ? "object-contain scale-95 -translate-x-1"
                        : "object-cover"
                    } transition-transform duration-700 ease-out group-hover:scale-105`}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Category */}
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
                    <Layers3 className="h-3.5 w-3.5 text-indigo-400" />

                    {project.category === "backend"
                      ? "Backend"
                      : "Full Stack"}
                  </div>

                  {/* Number */}
                  <span className="absolute right-5 top-5 text-xs font-semibold tracking-widest text-white/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Image title */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">
                      {project.title}
                    </h3>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-indigo-500">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-400">
                    {project.desc}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-indigo-500/15 bg-indigo-500/5 px-2.5 py-1 text-[11px] font-medium text-indigo-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-zinc-800/70 pt-4">
                    <span className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-indigo-300">
                      Explore project
                    </span>

                    <div className="flex items-center gap-2">
                      {project.links.github && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-all group-hover:border-zinc-700 group-hover:text-zinc-200">
                          <GitBranch className="h-3.5 w-3.5" />
                        </span>
                      )}

                      {project.links.live && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-all group-hover:border-indigo-500/30 group-hover:text-indigo-300">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <Reveal delay={200}>
          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6 sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Building more than interfaces.
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                I focus on practical applications, clean architecture, and
                reliable software.
              </p>
            </div>

            <a
              href="https://github.com/Leul-ab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
            >
              <GitBranch className="h-4 w-4" />
              More on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
