import Reveal from "./Reveal"

const technologies = [
  "Laravel",
  ".NET",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
]

const details = [
  { label: "Location", value: "Addis Ababa, Ethiopia" },
  { label: "Email", value: "leulabera321@gmail.com" },
  { label: "Availability", value: "Open to opportunities" },
]

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/[0.04] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <Reveal>
          <div className="mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
              Get to know me
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              About{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>

            <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Image */}
          <Reveal direction="left" className="hidden lg:block">
            <div className="group relative mx-auto w-full max-w-md">
              <img
                src={`${import.meta.env.BASE_URL}leul_image.png`}
                alt="Leul Abera"
                className="block h-auto w-full scale-[1.5] rounded-2xl object-contain transition duration-700 ease-out group-hover:scale-[1.6]"
              />

              {/* Floating availability card */}
              <div className="absolute left-4 top-0 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>

                <div>
                  <p className="text-xs font-medium text-white">
                    Available
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    for opportunities
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal direction="right" delay={100}>
            <div>
              <h3 className="mb-6 text-2xl font-semibold leading-tight text-white md:text-3xl">
                Building digital experiences with{" "}
                <span className="text-indigo-400">
                  purpose and precision.
                </span>
              </h3>

              <div className="space-y-5">
                <p className="leading-8 text-zinc-300">
                  I'm a full-stack developer who enjoys turning ideas and
                  complex problems into clean, reliable, and intuitive web
                  applications. I like working across the entire development
                  process — from designing interfaces to building APIs and
                  working with databases.
                </p>

                
              </div>

              {/* Technologies */}
              <div className="mt-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Technologies I work with
                </p>

                <div className="flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="mt-9 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2">
                {details.map((item) => (
                  <div key={item.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                      {item.label}
                    </p>

                    <p className="mt-1.5 break-words text-sm font-medium text-zinc-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal delay={200}>
          <div className="mt-20 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-sm md:grid-cols-4">
            {[
              { value: "Full-Stack", label: "Development" },
              { value: "6+", label: "Core Technologies" },
              { value: "API", label: "Backend Development" },
              { value: "∞", label: "Curiosity to Learn" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`px-5 py-7 text-center transition-colors duration-300 hover:bg-white/[0.04] ${
                  index !== 0
                    ? "border-l border-white/10"
                    : ""
                } ${index === 2 ? "max-md:border-l-0 max-md:border-t" : ""} ${
                  index === 3 ? "max-md:border-t" : ""
                }`}
              >
                <p className="text-xl font-bold text-white md:text-2xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}