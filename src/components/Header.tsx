
import { FloatingDock } from "./ui/floating-dock"
import { useActiveSection } from "../hooks/useActiveSection"
import {
  Home,
  User,
  Code2,
  Briefcase,
  Layers,
  Mail,
} from "lucide-react"

const navLinks = [
  {
    title: "Home",
    href: "#hero",
    icon: <Home className="h-full w-full" />,
  },
  {
    title: "About",
    href: "#about",
    icon: <User className="h-full w-full" />,
  },
  {
    title: "Skills",
    href: "#skills",
    icon: <Code2 className="h-full w-full" />,
  },
  {
    title: "Experience",
    href: "#experience",
    icon: <Briefcase className="h-full w-full" />,
  },
  {
    title: "Projects",
    href: "#projects",
    icon: <Layers className="h-full w-full" />,
  },
  {
    title: "Contact",
    href: "#contact",
    icon: <Mail className="h-full w-full" />,
  },
]

export default function Header() {
  const active = useActiveSection()

  const items = navLinks.map((link) => ({
    ...link,
    active: active === link.href.slice(1),
  }))

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-5 sm:px-4 sm:pt-7">
      <div className="pointer-events-auto flex w-full max-w-3xl justify-center">
        <FloatingDock items={items} />
      </div>
    </header>
  )
}
