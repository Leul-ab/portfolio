import { useState, type ComponentType, type SVGProps } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Atom,
  Code2,
  FileCode,
  Wind,
  Zap,
  GitBranch,
  Database,
  Server,
  Hash,
  Cpu,
  Link,
  ShieldCheck,
  RefreshCcw,
  FileText,
  Box,
} from "lucide-react"
import Reveal from "./Reveal"

interface Skill {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  color: string
}

const skillCategories: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: Atom, color: "#61DAFB" },
      { name: "TypeScript", icon: FileCode, color: "#3178C6" },
      { name: "Tailwind CSS", icon: Wind, color: "#06B6D4" },
      { name: "HTML/CSS", icon: Code2, color: "#E34F26" },
      { name: "JavaScript", icon: Zap, color: "#F7DF1E" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "PHP Laravel", icon: Server, color: "#3776AB" },
      { name: "C#", icon: Hash, color: "#092E20" },
      { name: "Node.js", icon: Cpu, color: "#339933" },
      { name: "Express", icon: Link, color: "#fff" },
      { name: "REST APIs", icon: Link, color: "#fff" },
    ],
  },
  {
    title: "Database & DevOps",
    skills: [
      { name: "PostgreSQL", icon: Database, color: "#4169E1" },
      { name: "MySQL", icon: Database, color: "#47A248" },
      { name: "Git", icon: GitBranch, color: "#F05032" },
    ],
  },
  {
    title: "Tools & More",
    skills: [
      { name: "Docker", icon: Box, color: "#2496ED" },
      { name: "Swagger", icon: FileText, color: "#007ACC" },
      { name: "Linux", icon: Atom, color: "#fff" },
      { name: "CI/CD", icon: RefreshCcw, color: "#fff" },
      { name: "JWT/Auth", icon: ShieldCheck, color: "#fff" },
    ],
  },
]

export default function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            My <span className="text-indigo-400">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, ci) => (
            <Reveal key={cat.title} direction="up" delay={ci * 100}>
              <div
                className="relative h-full w-full"
                onMouseEnter={() => setHoveredIndex(ci)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === ci && (
                    <motion.span
                      className="absolute inset-0 h-full w-full block rounded-3xl bg-indigo-500/10 border border-indigo-500/20"
                      layoutId="hoverBackgroundSkills"
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
                <div className="relative z-20 rounded-xl glass glass-hover shine transition-all duration-300 p-6 group h-full">
                <h3 className="text-lg font-semibold text-zinc-100 mb-5 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                  {cat.title}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-3 text-sm text-zinc-400 group/skill"
                    >
                      <span
                        className="size-7 rounded-md flex items-center justify-center text-base shrink-0 glass group-hover/skill:scale-110 transition-transform"
                        style={{ color: skill.color }}
                      >
                            <skill.icon className="size-4" />
                      </span>
                      <span className="group-hover/skill:text-zinc-300 transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
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
