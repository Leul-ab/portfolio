import { useEffect, useState } from "react"

const roles = [
  "Full Stack Developer",
  "React Specialist",
  "Backend Engineer",
  "UI/UX Enthusiast",
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[index]
    let timer: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timer = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && text === "") {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
    } else {
      timer = setTimeout(
        () => {
          setText(
            deleting
              ? current.slice(0, text.length - 1)
              : current.slice(0, text.length + 1)
          )
        },
        deleting ? 40 : 80
      )
    }

    return () => clearTimeout(timer)
  }, [text, deleting, index])

  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 30)
      setMouseY((e.clientY / window.innerHeight - 0.5) * 30)
    }
    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />

      {/* Geometric grid dots */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-zinc-400) 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
          animation: "grid-drift 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-indigo-400) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          animation: "grid-drift 25s ease-in-out infinite reverse",
        }}
      />

      {/* Parallax orbs */}
      <div
        className="absolute top-1/4 left-1/4 size-72 rounded-full bg-indigo-500/10 blur-3xl"
        style={{
          transform: `translate(${mouseX * -0.5}px, ${mouseY * -0.5}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-purple-500/10 blur-3xl"
        style={{
          transform: `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <p className="text-indigo-400 font-mono text-sm mb-4 tracking-widest uppercase">
          <span className="inline-block animate-pulse mr-2">▎</span>
          {text}
          <span className="inline-block animate-pulse ml-0.5">|</span>
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Leul
          </span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          I build full-stack web applications with modern technologies.
          Passionate about clean code, great UX, and bringing ideas to life.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-all hover:scale-105 active:scale-95"
          >
            Get in Touch
          </a>
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium transition-all hover:scale-105 active:scale-95"
          >
            View Projects
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </a>
        </div>

        <div className="flex items-center justify-center gap-5 mt-12">
          {[
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
            { label: "Twitter", href: "https://twitter.com" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm hover:scale-110 inline-block"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
