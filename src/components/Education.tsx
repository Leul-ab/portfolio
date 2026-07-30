import Reveal from "./Reveal"

const education = [
  {
    degree: "MSc in Computer Science",
    school: "University of Technology",
    period: "2023 – 2025",
  },
  {
    degree: "BSc in Software Engineering",
    school: "Addis Ababa University",
    period: "2018 – 2022",
  },
]

export default function Education() {
  return (
    <section id="education" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Education</h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((item, i) => (
            <Reveal key={item.degree} direction="up" delay={i * 120}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 hover:shadow-[0_0_24px_-4px_rgba(99,102,241,0.1)] transition-all duration-300">
                <span className="text-xs text-indigo-400 font-mono">
                  {item.period}
                </span>
                <h3 className="text-lg font-semibold text-zinc-100 mt-1">
                  {item.degree}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{item.school}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
