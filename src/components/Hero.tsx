import { useEffect, useState } from "react"

const GitHubIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.005-.404c1.02.005 2.045.138 3.005.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.813 1.102.813 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.722v20.555C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.277V1.722C24 .771 23.208 0 22.225 0z" />
  </svg>
)

const TelegramIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm5.74 7.743-1.038 8.703c-.084.706-.48.87-1.282.54l-2.788-1.869-1.347 1.297c-.148.148-.272.273-.553.273l.206-2.868 5.22-4.718c.227-.206 0-.33-.18-.125L8.796 12.742 6.298 11.6c-.6-.207-.61-.6.128-.86l10.352-3.983c.46-.176.86.105.68.986z" />
  </svg>
)

const roles = [
  "Full Stack Developer",
  "Database Designer",
  "Backend Engineer",
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
      {/* Gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />

      {/* Liquid blobs */}
      <div
        className="absolute -top-1/4 -right-1/4 size-[500px] md:size-[700px] bg-indigo-500/10 blur-3xl animate-blob"
        style={{
          transform: `translate(${mouseX * -0.3}px, ${mouseY * -0.3}px)`,
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 size-[500px] md:size-[700px] bg-purple-500/10 blur-3xl animate-blob2"
        style={{
          transform: `translate(${mouseX * 0.2}px, ${mouseY * 0.2}px)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] md:size-[600px] bg-pink-500/5 blur-3xl animate-blob3"
      />

      {/* Geometric grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-zinc-400) 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
          animation: "grid-drift 20s ease-in-out infinite",
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
          Passionate about clean code and bringing ideas to life.
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
            className="px-6 py-3 rounded-lg glass glass-hover shine text-zinc-300 hover:text-zinc-100 font-medium transition-all hover:scale-105 active:scale-95"
          >
            View Projects
          </a>
          <a
            href="../../public/Leul_Abera_CV.pdf"
            className="px-6 py-3 rounded-lg glass glass-hover shine text-zinc-300 hover:text-zinc-100 font-medium transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </a>
        </div>

        <div className="flex items-center justify-center gap-5 mt-12">
          {[
            { label: "GitHub", href: "https://github.com/Leul-ab", icon: GitHubIcon },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/leul-a-0509a9279/", icon: LinkedInIcon },
            { label: "Telegram", href: "https://t.me/leul_abera", icon: TelegramIcon },
          ].map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-9 rounded-full text-zinc-500 transition-all hover:text-indigo-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] dark:text-zinc-400 dark:hover:text-indigo-300"
                aria-label={s.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
