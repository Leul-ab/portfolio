import { useEffect, useState } from "react"

export default function Spotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-[background] duration-300"
      style={{
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.06), transparent 80%)`,
      }}
    />
  )
}
