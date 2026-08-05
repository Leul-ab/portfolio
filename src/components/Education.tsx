import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Reveal from "./Reveal"

const education = [
  {
    degree: "Bachelor's Degree in Computer Science",
    school: "St Mary's University",
    period: "2022 – 2026",
  },
]

export default function Education() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="education" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Education</h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((item, i) => (
            <Reveal key={item.degree} direction="up" delay={i * 120}>
              <div
                className="relative h-full w-full"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.span
                      className="absolute inset-0 h-full w-full block rounded-3xl bg-indigo-500/10 border border-indigo-500/20"
                      layoutId="hoverBackgroundEducation"
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
                    {item.period}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-100 mt-1">
                    {item.degree}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">{item.school}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
