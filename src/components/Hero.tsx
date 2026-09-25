
import { useEffect, useState } from "react"

const GitHubIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.005-.404c1.02.005 2.045.138 3.005.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.813 1.102.813 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const LinkedInIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.722v20.555C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.277V1.722C24 .771 23.208 0 22.225 0z" />
  </svg>
)

const TelegramIcon = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.74 7.743-1.038 8.703c-.084.706-.48.87-1.282.54l-2.788-1.869-1.347 1.297c-.148.148-.272.273-.553.273l.206-2.868 5.22-4.718c.227-.206 0-.33-.18-.125L8.796 12.742 6.298 11.6c-.6-.207-.61-.6.128-.86l10.352-3.983c.46-.176.86.105.68.986z" />
  </svg>
)

const roles = [
  "Full Stack Developer",
  "Backend Engineer",
  "Database Designer",
]

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Leul-ab",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leul-a-0509a9279/",
    icon: LinkedInIcon,
  },
  {
    label: "Telegram",
    href: "https://t.me/leul_abera",
    icon: TelegramIcon,
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  /* Typing animation */
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

  /* Mouse parallax */
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      setMouseX((event.clientX / window.innerWidth - 0.5) * 24)
      setMouseY((event.clientY / window.innerHeight - 0.5) * 24)
    }

    window.addEventListener("mousemove", handler, { passive: true })

    return () => window.removeEventListener("mousemove", handler)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />

        {/* Indigo blob */}
        <div
          className="absolute -right-1/4 -top-1/4 size-[500px] rounded-full bg-indigo-500/10 blur-3xl md:size-[700px]"
          style={{
            transform: `translate(${mouseX * -0.35}px, ${
              mouseY * -0.35
            }px)`,
          }}
        />

        {/* Purple blob */}
        <div
          className="absolute -bottom-1/4 -left-1/4 size-[500px] rounded-full bg-purple-500/10 blur-3xl md:size-[700px]"
          style={{
            transform: `translate(${mouseX * 0.2}px, ${
              mouseY * 0.2
            }px)`,
          }}
        />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.03] blur-3xl md:size-[600px]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(161 161 170) 0.5px, transparent 0.5px)",
            backgroundSize: "40px 40px",
            animation: "grid-drift 20s ease-in-out infinite",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.35)_100%)]" />
      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Availability */}
        

        {/* Animated role */}
        <div
          className="mb-5 flex min-h-6 items-center justify-center"
          aria-live="polite"
          aria-label={text}
        >
          <span className="mr-2 font-mono text-sm text-indigo-400">
            {"<"}
          </span>

          <span className="font-mono text-sm font-medium tracking-wide text-indigo-300">
            {text}
          </span>

          <span className="ml-0.5 animate-pulse font-mono text-indigo-400">
            _
          </span>

          <span className="ml-2 font-mono text-sm text-indigo-400">
            {"/>"}
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Hi, I'm{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              Leul
            </span>

            {/* Underline */}
            <span className="absolute -bottom-1 left-1/2 h-1 w-2/3 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm" />
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg md:text-xl md:leading-8">
          Full-stack developer focused on building{" "}
          <span className="text-zinc-200">
            reliable, scalable, and modern web applications
          </span>{" "}
          that turn ideas into practical digital experiences.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {/* Primary */}
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-400 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0"
          >
            Get in Touch

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          {/* Projects */}
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white active:translate-y-0"
          >
            View Projects

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </a>

          {/* Resume */}
          <a
            href={`${import.meta.env.BASE_URL}LEUL_ABERA_CV.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-6 py-3.5 text-sm font-semibold text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:text-zinc-100 active:translate-y-0"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            Resume
          </a>
        </div>

        {/* Socials */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {socials.map((social) => {
            const Icon = social.icon

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-zinc-500 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
              >
                <Icon />

                <span className="hidden text-xs font-medium sm:block">
                  {social.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          aria-label="Scroll to About section"
          className="group absolute left-1/2 mt-16 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-600 transition-colors hover:text-zinc-400 md:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>

          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-zinc-700 p-1">
            <span className="h-1.5 w-1 rounded-full bg-zinc-500 animate-bounce" />
          </span>
        </a>
      </div>
    </section>
  )
}
