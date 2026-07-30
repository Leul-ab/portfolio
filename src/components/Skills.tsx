import Reveal from "./Reveal"

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "HTML/CSS",
      "JavaScript",
    ],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "Django", "REST APIs", "GraphQL"],
  },
  {
    title: "Database & DevOps",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "AWS",
      "Git/GitHub",
    ],
  },
  {
    title: "Tools & More",
    skills: ["Figma", "Linux", "CI/CD", "WebSockets", "JWT/Auth", "Stripe"],
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
                <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                  {cat.title}
                </h3>
                <ul className="space-y-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm text-zinc-400 flex items-center gap-2"
                    >
                      <span className="size-1.5 rounded-full bg-indigo-500/60 shrink-0 group-hover:bg-indigo-400 transition-colors" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
