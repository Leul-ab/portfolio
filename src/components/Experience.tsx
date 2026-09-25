
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  ExternalLink,
  MapPin,
} from "lucide-react"
import Reveal from "./Reveal"

interface Job {
  role: string
  company: string
  companyUrl: string
  period: string
  location: string
  current?: boolean
  description: string
  highlights: string[]
  technologies: string[]
}

const jobs: Job[] = [
  {
    role: "Full Stack Developer",
    company: "Ethio Innovation",
    companyUrl: "https://ethioinnovation.com/",
    period: "May 2026 – Present",
    location: "Addis Ababa, Ethiopia",
    current: true,
    description:
      "Developing and maintaining web applications for government-focused digital services, working across frontend, backend, APIs, and database systems.",
    highlights: [
      "Built and maintained full-stack web applications from development to deployment.",
      "Integrated payment gateways and backend services into application workflows.",
      "Implemented real-time updates and improved application functionality.",
      "Worked on scalable and maintainable application architecture.",
    ],
    technologies: [
      "Laravel",
      "React",
      "TypeScript",
      "PostgreSQL",
    ],
  },
  {
    role: "Backend Developer",
    company: "Arifpay",
    companyUrl: "https://arifpay.net/",
    period: "Oct 2025 – Jan 2026",
    location: "Addis Ababa, Ethiopia",
    description:
      "Worked on ArifMenu backend API development using C#, .NET, PostgreSQL, and Clean Architecture principles.",
    highlights: [
      "Developed backend APIs using C# and ASP.NET Core.",
      "Designed and worked with PostgreSQL database structures.",
      "Applied Clean Architecture principles to organize application layers.",
      "Implemented backend functionality and API integrations.",
    ],
    technologies: [
      "C#",
      ".NET",
      "PostgreSQL",
      "Clean Architecture",
    ],
  },
]

export default function Experience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="experience"
      className="relative overflow-hidden px-4 py-24 md:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-15%] top-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute left-[-15%] bottom-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/[0.04] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Career journey
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>

            <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

            <p className="mt-6 max-w-xl leading-7 text-zinc-400">
              A timeline of the roles and projects where I've developed my
              skills, worked with real-world systems, and continued growing as
              a developer.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute bottom-0 left-[17px] top-0 w-px bg-gradient-to-b from-indigo-500/60 via-purple-500/30 to-transparent md:left-[23px]" />
          <div className="space-y-12">
            {jobs.map((job, i) => (
              <Reveal
                key={`${job.company}-${job.role}`}
                direction="up"
                delay={i * 150}
              >
                <div className="relative pl-12 md:pl-16">
                  {/* Timeline node */}
                  <div className="absolute left-[7px] top-7 flex h-5 w-5 items-center justify-center md:left-[13px]">
                    {job.current && (
                      <span className="absolute h-5 w-5 animate-ping rounded-full bg-indigo-500/30" />
                    )}
                    <span
                      className={`relative h-3 w-3 rounded-full border-2 border-zinc-950 ${
                        job.current
                          ? "bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                          : "bg-zinc-600"
                      }`}
                    />
                  </div>

                  {/* Card wrapper */}
                  <div
                    className="group relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover background */}
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.div
                          layoutId="experience-hover"
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
                      className={`absolute -inset-3 rounded-3xl bg-indigo-500/10 blur-2xl transition-opacity duration-500 ${
                        hoveredIndex === i
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    {/* Card */}
                    <motion.div
                      animate={{
                        y: hoveredIndex === i ? -4 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl md:p-8"
                    >
                      {/* Top section */}
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-2 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-indigo-300">
                              <CalendarDays className="h-3 w-3" />
                              {job.period}
                            </span>

                            {job.current && (
                              <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Current Role
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                            {job.role}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-300">
                              <BriefcaseBusiness className="h-3.5 w-3.5" />
                              {job.company}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                          </div>
                        </div>

                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${job.company} website`}
                          className="group/company inline-flex h-fit shrink-0 items-center gap-1.5 self-start rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-sm font-medium text-indigo-300 transition-all hover:border-indigo-400/60 hover:bg-indigo-500/20 hover:text-indigo-200"
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400/80">
                            Visit website
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-60 transition-transform group-hover/company:-translate-y-0.5 group-hover/company:translate-x-0.5" />
                        </a>
                      </div>

                      {/* Description */}
                      <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-400">
                        {job.description}
                      </p>

                      {/* Highlights */}
                      <div className="mt-7">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                          Key Contributions
                        </p>

                        <div className="grid gap-3 md:grid-cols-2">
                          {job.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex gap-3 text-sm leading-6 text-zinc-400"
                            >
                              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-400/70" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="mt-7 border-t border-white/10 pt-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <Code2 className="mr-1 h-4 w-4 text-zinc-600" />

                          {job.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition-colors duration-300 group-hover:border-indigo-500/20 group-hover:text-zinc-300"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom accent */}
                      <div
                        className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                          hoveredIndex === i
                            ? "w-full opacity-100"
                            : "w-0 opacity-0"
                        }`}
                      />
                    </motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <Reveal delay={300}>
          <div className="mt-14 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 backdrop-blur-sm md:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
              <BriefcaseBusiness className="h-5 w-5 text-indigo-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">
                Always building, learning, and improving.
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Focused on creating practical software that solves real
                problems.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
