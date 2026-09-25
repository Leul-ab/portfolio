import { useEffect, useState } from "react"

const sections = ["hero", "about", "skills", "experience", "projects", "contact"]

export function useActiveSection() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    // Cache section offsets so scrolling doesn't force synchronous layout
    // reads (which can jank other animations, e.g. the floating dock).
    let positions: number[] = []
    let ticking = false

    const measure = () => {
      positions = sections.map((id) => {
        const el = document.getElementById(id)
        return el ? el.offsetTop : Infinity
      })
    }

    const update = () => {
      ticking = false

      const scrollPos = window.scrollY + 100
      let current = "hero"
      let minDistance = Infinity

      for (let i = 0; i < sections.length; i++) {
        const distance = Math.abs(positions[i] - scrollPos)
        if (distance < minDistance) {
          minDistance = distance
          current = sections[i]
        }
      }

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    measure()
    update()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    // Re-measure after images/fonts settle so cached offsets stay accurate
    window.addEventListener("load", measure)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
    }
  }, [])

  return active
}