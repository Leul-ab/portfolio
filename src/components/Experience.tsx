import Reveal from "./Reveal"

const jobs = [
  {
    role: "Senior Full Stack Developer",
    company: "Tech Corp",
    period: "Jan 2024 – Present",
    description:
      "Led development of a SaaS platform serving 10K+ users. Built microservices architecture, designed REST/GraphQL APIs, and optimized database queries for 40% performance gain.",
  },
  {
    role: "Full Stack Developer",
    company: "StartupXYZ",
    period: "Jun 2022 – Dec 2023",
    description:
      "Developed and maintained multiple client-facing web apps. Integrated payment gateways, real-time features with WebSockets, and automated CI/CD pipelines.",
  },
  {
    role: "Junior Developer",
    company: "Agency Co.",
    period: "Sep 2021 – May 2022",
    description:
      "Built responsive landing pages and admin dashboards. Collaborated in agile teams using Git, code reviews, and sprint planning.",
  },
]

export default function Experience() {
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
                  <div className="rounded-xl glass glass-hover shine transition-all duration-300 p-6">
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
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
