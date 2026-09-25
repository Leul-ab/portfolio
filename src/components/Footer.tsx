
import {
  ArrowUpRight,
  GitBranch,
  Link,
  Send,
} from "lucide-react"

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Leul-ab",
    icon: GitBranch,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leul-a-0509a9279/",
    icon: Link,
  },
  {
    label: "Telegram",
    href: "https://t.me/leul_abera",
    icon: Send,
  },
]

const navigation = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-800/70 bg-zinc-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Intro */}
          <div className="max-w-md">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                <span className="text-sm font-bold text-indigo-400">
                  LA
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Leul Abera
                </p>

                <p className="text-xs text-zinc-500">
                  Full Stack Developer
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                meaningful.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              I&apos;m always interested in building useful products,
              solving challenging problems, and working with people who care
              about creating great software.
            </p>

            <a
              href="mailto:leulabera321@gmail.com"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              leulabera321@gmail.com
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Navigation
            </p>

            <nav className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  <span className="h-px w-0 bg-indigo-400 transition-all duration-300 group-hover:w-3" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Connect
            </p>

            <div className="flex flex-col gap-3">
              {socials.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-400 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-zinc-100"
                  >
                    <Icon className="h-4 w-4 transition-colors group-hover:text-indigo-400" />

                    <span>{social.label}</span>

                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-1 border-t border-zinc-800/70 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Leul Abera. All rights reserved.
          </p>

          <p className="text-[11px] text-zinc-700">
            Designed & built with React, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}

