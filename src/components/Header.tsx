import { FloatingDock } from "./ui/floating-dock"
import { useActiveSection } from "../hooks/useActiveSection"
import { useTheme } from "../context/ThemeContext"
import { Home, User, Code2, Briefcase, Layers, Mail, Sun, Moon } from "lucide-react"

const navLinks = [
  { title: "Home", href: "#hero", icon: <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
  { title: "About", href: "#about", icon: <User className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
  { title: "Skills", href: "#skills", icon: <Code2 className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
  { title: "Experience", href: "#experience", icon: <Briefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
  { title: "Projects", href: "#projects", icon: <Layers className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
  { title: "Contact", href: "#contact", icon: <Mail className="h-full w-full text-neutral-500 dark:text-neutral-300" /> },
]

export default function Header() {
  const { theme, toggle } = useTheme()
  const active = useActiveSection()

  const items = [
    ...navLinks.map((link) => ({
      ...link,
      active: active === link.href.slice(1),
    })),
    {
      title: theme === "dark" ? "Light Mode" : "Dark Mode",
      icon:
        theme === "dark" ? (
          <Sun className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ) : (
          <Moon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
      onClick: toggle,
    },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-10 pointer-events-none">
      <div className="relative flex w-full max-w-5xl items-center justify-center pointer-events-auto">
        <FloatingDock items={items} />
      </div>
    </header>
  )
}
