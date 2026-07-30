import Reveal from "./Reveal"

const services = [
  {
    icon: "⚡",
    title: "Web Development",
    desc: "Fast, responsive web apps built with React, Next.js, and modern front-end tooling.",
  },
  {
    icon: "🔧",
    title: "API & Backend",
    desc: "Scalable REST and GraphQL APIs with Node.js, Python, PostgreSQL, and cloud deployment.",
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Clean, accessible interfaces designed with Figma and implemented pixel-perfect in code.",
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    desc: "CI/CD pipelines, Docker containerization, and AWS infrastructure for reliable deployments.",
  },
]

export default function Services() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            What I <span className="text-indigo-400">Do</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} direction="up" delay={i * 100}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-indigo-500/30 hover:shadow-[0_0_32px_-8px_rgba(99,102,241,0.15)] transition-all duration-300 group h-full">
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
