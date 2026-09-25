
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
  Terminal,
  Layers,
} from "lucide-react"
import Reveal from "./Reveal"

interface Skill {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  color: string
}

interface SkillCategory {
  title: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  skills: Skill[]
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    description: "Interfaces that are responsive, accessible, and intuitive.",
    icon: Atom,
    skills: [
      { name: "React", icon: Atom, color: "#61DAFB" },
      { name: "TypeScript", icon: FileCode, color: "#3178C6" },
      { name: "Tailwind CSS", icon: Wind, color: "#06B6D4" },
      { name: "HTML / CSS", icon: Code2, color: "#E34F26" },
      { name: "JavaScript", icon: Zap, color: "#F7DF1E" },
    ],
  },
  {
    title: "Backend",
    description: "APIs and server-side systems built for reliability.",
    icon: Server,
    skills: [
      { name: "PHP Laravel", icon: Server, color: "#FF2D20" },
      { name: "C# / .NET", icon: Hash, color: "#9B4F96" },
      { name: "Node.js", icon: Cpu, color: "#339933" },
      { name: "Express", icon: Link, color: "#E5E7EB" },
      { name: "REST APIs", icon: Link, color: "#8B5CF6" },
    ],
  },
  {
    title: "Database",
    description: "Structured data models designed for performance and scale.",
    icon: Database,
    skills: [
      { name: "PostgreSQL", icon: Database, color: "#4169E1" },
      { name: "MySQL", icon: Database, color: "#4479A1" },
      { name: "Prisma", icon: Layers, color: "#5A67D8" },
      { name: "Eloquent ORM", icon: Database, color: "#FF2D20" },
    ],
  },
  {
    title: "Tools & DevOps",
    description: "Development workflows and tools for reliable delivery.",
    icon: Terminal,
    skills: [
      { name: "Git", icon: GitBranch, color: "#F05032" },
      { name: "Docker", icon: Box, color: "#2496ED" },
      { name: "Swagger", icon: FileText, color: "#85EA2D" },
      { name: "Linux", icon: Terminal, color: "#F7DF1E" },
      { name: "CI / CD", icon: RefreshCcw, color: "#8B5CF6" },
      { name: "JWT / Auth", icon: ShieldCheck, color: "#F59E0B" },
    ],
  },
]

export default function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section
      id="skills"
      className="relative overflow-hidden px-4 py-24 md:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-[-15%] bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/[0.04] via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Technical toolkit
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>

            <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

            <p className="mt-6 max-w-xl leading-7 text-zinc-400">
              A collection of technologies and tools I use to design,
              develop, connect, and deploy modern applications.
            </p>
          </div>
        </Reveal>

        {/* Skill categories */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, ci) => {
            const CategoryIcon = category.icon

            return (
              <Reveal
                key={category.title}
                direction="up"
                delay={ci * 100}
              >
                <div
                  className="group relative h-full"
                  onMouseEnter={() => setHoveredIndex(ci)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Hover glow */}
                  <AnimatePresence>
                    {hoveredIndex === ci && (
                      <motion.div
                        layoutId="skill-category-hover"
                        className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/30 via-indigo-500/10 to-purple-500/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    className={`absolute -inset-3 rounded-3xl bg-indigo-500/10 blur-2xl transition-opacity duration-500 ${
                      hoveredIndex === ci
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />

                  {/* Card */}
                  <motion.div
                    animate={{
                      y: hoveredIndex === ci ? -5 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl sm:min-h-[390px]"
                  >
                    {/* Category header */}
                    <div className="mb-7 flex items-start justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                          hoveredIndex === ci
                            ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-300"
                            : "border-white/10 bg-white/[0.04] text-zinc-500"
                        }`}
                      >
                        <CategoryIcon className="h-5 w-5" />
                      </div>

                      <span className="font-mono text-xs text-zinc-700 transition-colors group-hover:text-indigo-400/60">
                        {String(ci + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-white">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {category.description}
                    </p>

                    {/* Divider */}
                    <div className="my-6 h-px bg-white/10" />

                    {/* Skills */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                      {category.skills.map((skill) => {
                        const SkillIcon = skill.icon
                        const isHovered = hoveredSkill === skill.name

                        return (
                          <div
                            key={skill.name}
                            onMouseEnter={() =>
                              setHoveredSkill(skill.name)
                            }
                            onMouseLeave={() =>
                              setHoveredSkill(null)
                            }
                            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-300 hover:bg-white/[0.04]"
                          >
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-all duration-300"
                              style={{
                                color: skill.color,
                                boxShadow: isHovered
                                  ? `0 0 18px ${skill.color}25`
                                  : "none",
                              }}
                            >
                              <SkillIcon className="h-4 w-4" />
                            </span>

                            <span
                              className={`min-w-0 text-sm transition-colors duration-300 ${
                                isHovered
                                  ? "text-zinc-100"
                                  : "text-zinc-400"
                              }`}
                            >
                              {skill.name}
                            </span>

                            <motion.span
                              initial={{ opacity: 0, x: -5 }}
                              animate={{
                                opacity: isHovered ? 1 : 0,
                                x: isHovered ? 0 : -5,
                              }}
                              className="ml-auto hidden text-xs text-indigo-400 sm:block"
                            >
                              →
                            </motion.span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Skill count */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                        <span className="text-zinc-700">
                          Technologies
                        </span>

                        <span className="font-mono text-zinc-600">
                          {String(category.skills.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                        hoveredIndex === ci
                          ? "w-full opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    />
                  </motion.div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Development approach */}
        <Reveal delay={400}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <div className="grid md:grid-cols-3">
              {[
                {
                  title: "Clean Architecture",
                  text: "Organized codebases that are easier to maintain and extend.",
                },
                {
                  title: "API First",
                  text: "Well-structured APIs that connect frontend and backend systems cleanly.",
                },
                {
                  title: "Continuous Learning",
                  text: "Always exploring better tools, patterns, and development practices.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`px-6 py-7 md:px-8 ${
                    index !== 0
                      ? "border-t border-white/10 md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-sm font-semibold text-zinc-200">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-6 text-zinc-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
