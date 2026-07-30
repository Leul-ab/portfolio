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
              <div className="rounded-xl glass glass-hover shine transition-all duration-300 p-6">
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
