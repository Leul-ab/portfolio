import Reveal from "./Reveal"

const services = [
  {
    icon: "⚡",
    title: "Web Development",
    desc: "Fast, responsive web apps built with Laravel, React, TypeScript, and modern front-end tooling.",
  },
  {
    icon: "🔧",
    title: "API & Backend",
    desc: "Scalable REST and GraphQL APIs with C#, PostgreSQL, Swagger and cloud deployment.",
  },
  {
    icon: "🗄️",
    title: "Database Design",
    desc: "Efficient, well-structured database schemas designed for performance and scalability.",
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    desc: "CI/CD pipelines, Docker containerization, and AWS infrastructure for reliable deployments.",
  },
]

export default function Services() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            What I <span className="text-indigo-400">Do</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} direction="up" delay={i * 100}>
              <div className="rounded-xl glass glass-hover shine transition-all duration-300 p-6 group h-full">
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform origin-left">
                  {s.icon}
                </span>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
