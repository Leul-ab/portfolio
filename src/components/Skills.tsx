import Reveal from "./Reveal"

interface Skill {
  name: string
  icon: string
  color: string
}

const skillCategories: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "⚛️", color: "#61DAFB" },
      { name: "TypeScript", icon: "📘", color: "#3178C6" },
      { name: "Next.js", icon: "▲", color: "#fff" },
      { name: "Tailwind CSS", icon: "🌊", color: "#06B6D4" },
      { name: "HTML/CSS", icon: "🌐", color: "#E34F26" },
      { name: "JavaScript", icon: "🟨", color: "#F7DF1E" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "💚", color: "#339933" },
      { name: "Express", icon: "⚙️", color: "#fff" },
      { name: "Python", icon: "🐍", color: "#3776AB" },
      { name: "Django", icon: "🎯", color: "#092E20" },
      { name: "REST APIs", icon: "🔗", color: "#fff" },
      { name: "GraphQL", icon: "◈", color: "#E10098" },
    ],
  },
  {
    title: "Database & DevOps",
    skills: [
      { name: "PostgreSQL", icon: "🐘", color: "#4169E1" },
      { name: "MongoDB", icon: "🍃", color: "#47A248" },
      { name: "Redis", icon: "🔴", color: "#DC382D" },
      { name: "Docker", icon: "🐳", color: "#2496ED" },
      { name: "AWS", icon: "☁️", color: "#FF9900" },
      { name: "Git", icon: "🔀", color: "#F05032" },
    ],
  },
  {
    title: "Tools & More",
    skills: [
      { name: "Figma", icon: "🎨", color: "#F24E1E" },
      { name: "Linux", icon: "🐧", color: "#fff" },
      { name: "CI/CD", icon: "🔄", color: "#fff" },
      { name: "WebSockets", icon: "🔌", color: "#fff" },
      { name: "JWT/Auth", icon: "🔐", color: "#fff" },
      { name: "Stripe", icon: "💳", color: "#008CDD" },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            My <span className="text-indigo-400">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, ci) => (
            <Reveal key={cat.title} direction="up" delay={ci * 100}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:shadow-[0_0_24px_-4px_rgba(99,102,241,0.15)] transition-all duration-300 group">
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
                        className="size-7 rounded-md flex items-center justify-center text-base shrink-0 bg-zinc-800/50 group-hover/skill:scale-110 transition-transform"
                        style={{ color: skill.color }}
                      >
                        {skill.icon}
                      </span>
                      <span className="group-hover/skill:text-zinc-300 transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
