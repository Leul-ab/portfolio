import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"

const services = [
  {
    number: "01",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
    title: "Web Development",
    desc: "Modern, responsive web applications built with Laravel, React, TypeScript, and scalable front-end architecture.",
    tags: ["React", "Laravel", "TypeScript"],
  },
  {
    number: "02",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path d="M8 9h8" />
        <path d="M8 15h5" />
        <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M7 12h.01" />
      </svg>
    ),
    title: "API & Backend",
    desc: "Reliable REST APIs and backend systems with authentication, authorization, validation, and clean architecture.",
    tags: ["C# .NET", "Node.js", "Swagger"],
  },
  {
    number: "03",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12v7c0 1.66 3.58 3 8 3s8-1.34 8-3v-7" />
      </svg>
    ),
    title: "Database Design",
    desc: "Structured and efficient data models designed for consistency, performance, maintainability, and growth.",
    tags: ["PostgreSQL", "MySQL", "Prisma"],
  },
  {
    number: "04",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 1 9Z" />
        <path d="M12 13v6" />
        <path d="m9.5 16 2.5 3 2.5-3" />
      </svg>
    ),
    title: "Deployment & DevOps",
    desc: "Containerized applications and deployment workflows focused on reliable releases and maintainable infrastructure.",
    tags: ["Docker", "CI/CD", "Cloud"],
  },
]

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-[-15%] bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/[0.04] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              My expertise
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              What I{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Do
              </span>
            </h2>

            <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

            <p className="mt-6 max-w-xl leading-7 text-zinc-400">
              I build reliable digital products across the frontend, backend,
              database, and deployment layers — with a focus on clean
              architecture and practical solutions.
            </p>
          </div>
        </Reveal>

        {/* Services */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.title} direction="up" delay={i * 100}>
              <div
                className="group relative h-full"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated background */}
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      layoutId="service-hover"
                      className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-indigo-500/10 to-purple-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                {/* Glow */}
                <div
                  className={`absolute -inset-2 rounded-3xl bg-indigo-500/10 blur-2xl transition-all duration-500 ${
                    hoveredIndex === i
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                {/* Card */}
                <motion.div
                  animate={{
                    y: hoveredIndex === i ? -6 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl"
                >
                  {/* Top row */}
                  <div className="mb-8 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                        hoveredIndex === i
                          ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                          : "border-white/10 bg-white/[0.04] text-zinc-400"
                      }`}
                    >
                      {service.icon}
                    </div>

                    <span className="font-mono text-xs text-zinc-700 transition-colors duration-300 group-hover:text-indigo-400/60">
                      {service.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white">
                      {service.title}
                    </h3>

                    <p className="text-sm leading-7 text-zinc-400">
                      {service.desc}
                    </p>

                    {/* Tags */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-7">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition-colors duration-300 group-hover:border-indigo-500/20 group-hover:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom arrow */}
                  <div
                    className={`absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                      hoveredIndex === i
                        ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-300"
                        : "border-white/10 text-zinc-700"
                    }`}
                  >
                    <motion.span
                      animate={{
                        x: hoveredIndex === i ? 2 : 0,
                      }}
                    >
                      →
                    </motion.span>
                  </div>

                  {/* Decorative line */}
                  <div
                    className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                      hoveredIndex === i
                        ? "w-full opacity-100"
                        : "w-0 opacity-0"
                    }`}
                  />
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom statement */}
        <Reveal delay={400}>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 backdrop-blur-sm sm:flex-row sm:items-center md:px-8">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Have a project in mind?
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Let's turn your idea into something useful.
              </p>
            </div>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-300 transition-all duration-300 hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              Let's talk
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )}