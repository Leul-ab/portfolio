import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"
import ProjectModal from "./ProjectModal"

const projects = [
  {
    title: "Lease Tenant Management System",
    desc: "End-to-end governmental web app, solution for managing tenants, leases, and payments of Addis Ababa houses with a secure admin dashboard.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/betochbureau.png",
    links: { github: "https://github.com/Robani-G/LTMS", live: "https://aahdabrhrcas.gov.et/" },
  },
  {
    title: "Budget Request And Cashflow",
    desc: "Another End-to-end governmental web app that am working on currently, solution for managing budget requests and cashflow of Addis Ababa with a secure admin dashboard.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/financebureau.png",
    links: { github: "https://github.com/Robani-G/Budget-Request-and-Cashflow-" },
  },
  {
    title: "Digital Menu Management System",
    desc: "A web app for restaurants to manage their digital menus, allowing customers to view and order from the menu online, with a secure admin dashboard for restaurant owners.",
    tags: ["PHP Laravel", "React", "MySQL", "Tailwind CSS"],
    category: "fullstack",
    image: "/mamaskitchen-logo.png",
    links: { github: "https://github.com/Leul-ab/DMMS"},
  },
  {
    title: "NIB Insurance API",
    desc: "RESTful API for handling insurance claims and policy management with authentication and data validation.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "Backend API",
    image: "/nibinsurance.png",
    links: { github: "https://github.com/Leul-ab/NIB-Insurance", live: "https://nib-insurance-1.onrender.com" },
  },
  {
    title: "ArifMenu",
    desc: "Restaurant menu web app with dynamic menu management, order tracking, and responsive design for mobile and desktop.",
    tags: ["C#", "Entity Framework", "PostgreSQL", "JWT"],
    category: "frontend",
    image: "/arifmenu.webp",
    links: {  },
  },
]

const filters: { label: string; value: string }[] = [
  //{ label: "All", value: "all" },
  // { label: "Full Stack", value: "fullstack" },
  // { label: "Frontend", value: "frontend" },
  // { label: "Backend API", value: "Backend API" }
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<typeof projects[number] | null>(null)

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer shine ${
                  activeFilter === f.value
                    ? "bg-indigo-500 text-white"
                    : "glass glass-hover text-zinc-400 hover:text-zinc-100"
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
              <div
                className="relative h-full w-full"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.span
                      className="absolute inset-0 h-full w-full block rounded-3xl bg-indigo-500/10 border border-indigo-500/20"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setSelected(project)}
                  className="relative z-20 w-full text-left group rounded-2xl glass glass-hover shine overflow-hidden transition-all duration-300 cursor-pointer"
                >
                <div className="h-56 md:h-64 overflow-hidden rounded-t-2xl border-b border-zinc-800/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
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
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                      View Details
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
