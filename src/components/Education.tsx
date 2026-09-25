
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
} from "lucide-react"
import Reveal from "./Reveal"

const education = [
  {
    degree: "Bachelor's Degree in Computer Science",
    school: "St Mary's University",
    period: "2022 – 2026",
    status: "Completed",
  },
]

export default function Education() {
  return (
    <section
      id="education"
      className="relative overflow-hidden px-4 py-24 sm:px-6"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-indigo-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
                Academic Background
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Education
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              My academic background has given me a strong foundation in
              computer science, software engineering, and problem solving.
            </p>
          </div>
        </Reveal>

        {/* Education timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute bottom-0 left-[22px] top-0 hidden w-px bg-gradient-to-b from-indigo-500/60 via-zinc-800 to-transparent md:block" />

          {education.map((item, index) => (
            <Reveal
              key={item.degree}
              direction="up"
              delay={index * 120}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group relative md:pl-16"
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-8 hidden md:flex">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-indigo-500/30 bg-zinc-950 shadow-lg shadow-indigo-500/10">
                    <div className="absolute inset-1 rounded-full bg-indigo-500/10" />
                    <GraduationCap className="relative z-10 h-5 w-5 text-indigo-400" />
                  </div>
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/50 p-6 shadow-2xl shadow-black/10 transition-all duration-500 hover:border-indigo-500/30 hover:bg-zinc-950/70 sm:p-8">
                  {/* Glow */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl transition-opacity duration-500 group-hover:bg-indigo-500/10" />

                  <div className="relative">
                    {/* Top row */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                        <CalendarDays className="h-4 w-4" />
                        {item.period}
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {item.status}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      {/* Mobile icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 md:hidden">
                        <GraduationCap className="h-6 w-6 text-indigo-400" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold leading-snug text-zinc-100 sm:text-2xl">
                          {item.degree}
                        </h3>

                        <p className="mt-2 text-sm font-medium text-zinc-400">
                          {item.school}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {[
                            "Computer Science",
                            "Software Engineering",
                            "Problem Solving",
                          ].map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors group-hover:border-indigo-500/20 group-hover:text-zinc-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-all duration-300 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 sm:flex">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Bottom academic statement */}
        <Reveal delay={200}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="group rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-indigo-500/20">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <BookOpen className="h-4 w-4" />
              </div>

              <h4 className="text-sm font-semibold text-zinc-200">
                Continuous Learning
              </h4>

              <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                Continuously developing my skills through practical projects,
                new technologies, and real-world software development.
              </p>
            </div>

            <div className="group rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-indigo-500/20">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <GraduationCap className="h-4 w-4" />
              </div>

              <h4 className="text-sm font-semibold text-zinc-200">
                Academic Foundation
              </h4>

              <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                Building a strong foundation in software engineering,
                algorithms, databases, and computer science fundamentals.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
