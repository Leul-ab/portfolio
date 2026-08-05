import Reveal from "./Reveal"

export default function About() {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="text-indigo-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div className="relative group">
              <div className="aspect-square rounded-2xl glass shine flex items-center justify-center group-hover:border-indigo-500/20 transition-colors">
                <span className="text-6xl">👨‍💻</span>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <div className="space-y-5">
              <p className="text-zinc-300 leading-relaxed">
                I'm a full-stack developer with experience building web
                applications from the ground up. I enjoy turning complex
                problems into simple, elegant solutions.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                My stack spans Laravel, C# .NET,React, TypeScript, Node.js, and modern databases.
                I care about performance, accessibility, and writing maintainable
                code that scales.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Location", value: "Addis Ababa, Ethiopia" },
                  { label: "Email", value: "leulabera321@gmail.com" },
                  { label: "Freelance", value: "Available" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-zinc-200 font-medium mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
