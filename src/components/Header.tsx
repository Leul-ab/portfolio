import { useState } from "react"
import { useActiveSection } from "../hooks/useActiveSection"
import { useTheme } from "../context/ThemeContext"
import { Home, User, Code2, Briefcase, Layers, Mail, Menu, X, Sun, Moon } from "lucide-react"

const navLinks = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: Layers },
  { label: "Contact", href: "#contact", icon: Mail },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const { theme, toggle } = useTheme()

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      {/* Ambient blobs for glass refraction */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-white-100 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 pointer-events-auto">
        {/* Specular highlight — rim light reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />

        <div className="flex items-center justify-between px-3 h-14">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/20 backdrop-blur-md shadow-inner text-white font-bold text-sm">
              L
            </div>
            <span className="text-base font-semibold tracking-wide text-white drop-shadow-sm max-sm:hidden">
              Leul<span className="text-white/50">.dev</span>
            </span>
          </a>

          {/* Desktop nav link group */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = active === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] bg-white/15 border border-white/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/70 transition-all hover:bg-white/15 hover:text-white backdrop-blur-md shrink-0"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <a
              href="#contact"
              className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-white/15 to-white/5 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all hover:brightness-125 max-sm:hidden"
            >
              <span className="relative z-10">Let&apos;s Talk</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/70 backdrop-blur-md"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="flex flex-col gap-1.5 border-t border-white/5 px-4 py-4 md:hidden">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = active === link.href.slice(1)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              )
            })}
            <div className="mt-2 border-t border-white/5 pt-3">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/15 py-2.5 text-center text-sm font-medium text-white shadow-md backdrop-blur-md"
              >
                <Mail className="size-4" />
                Let&apos;s Talk
              </a>
            </div>
          </div>
        )}
      </nav>

      
    </header>
  )
}
