import { useEffect, useState } from "react"

const sections = ["hero", "about", "skills", "experience", "projects", "contact"]

export function useActiveSection() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + 100
      let current = "hero"
      let minDistance = Infinity

      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const distance = Math.abs(el.offsetTop - scrollPos)
        if (distance < minDistance) {
          minDistance = distance
          current = id
        }
      }

      setActive(current)
    }

    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return active
}
