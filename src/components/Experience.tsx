import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"

const jobs = [
  {
    role: "Full Stack Developer",
    company: "Ethio Innovation",
    period: "May 2026 – Present",
    description:
      "Developed and maintained multiple Governmental web apps. Integrated payment gateways, real-time features updates.",
  },
  {
    role: "Backend Developer",
    company: "Arifpay (Internship)",
    period: "Oct 2025 – Jan 2026",
    description:
      "Worked on ArifMenu full backend API development using C#, .NET, PostgreSQL and Clean Architecture.",
  },
]

export default function Experience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Experience</h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="relative">
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-purple-500/30 to-transparent" />

          <div className="space-y-10">
            {jobs.map((job, i) => (
              <Reveal key={job.role} direction="up" delay={i * 120}>
                <div className="relative pl-12 md:pl-16">
                  <div className="absolute left-2.5 md:left-4.5 top-1.5 size-3 rounded-full bg-indigo-500 border-2 border-zinc-950 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.span
                          className="absolute inset-0 h-full w-full block rounded-3xl bg-indigo-500/10 border border-indigo-500/20"
                          layoutId="hoverBackgroundExperience"
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
                    <div className="relative z-20 rounded-xl glass glass-hover shine transition-all duration-300 p-6">
                      <span className="text-xs text-indigo-400 font-mono">
                        {job.period}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-100 mt-1">
                        {job.role}
                      </h3>
                      <p className="text-sm text-zinc-500 mb-3">{job.company}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
