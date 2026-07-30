import { useState } from "react"
import { useActiveSection } from "../hooks/useActiveSection"
import { useTheme } from "../context/ThemeContext"

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const { theme, toggle } = useTheme()

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">&lt;</span>
          Leul
          <span className="text-indigo-400">/&gt;</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors relative ${
                  isActive
                    ? "text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-indigo-400" />
                )}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="size-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative size-9 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
          <span
            className={`block h-0.5 w-5 bg-zinc-100 transition-all duration-300 ${
              open ? "rotate-45 translate-y-1" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-100 transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-100 transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </button>
      </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 border-t border-zinc-800" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 gap-3 bg-zinc-950">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
