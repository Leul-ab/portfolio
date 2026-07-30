import type { ReactNode } from "react"
import { useScrollReveal } from "../hooks/useScrollReveal"

type Direction = "up" | "left" | "right"

const dirClasses: Record<Direction, string> = {
  up: "translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
}

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
}) {
  const { ref, revealed } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        revealed
          ? "translate-y-0 translate-x-0 opacity-100"
          : `${dirClasses[direction]} opacity-0`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
