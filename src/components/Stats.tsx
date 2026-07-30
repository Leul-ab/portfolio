import { useEffect, useRef, useState } from "react"
import Reveal from "./Reveal"

const stats = [
  { label: "Years Experience", target: 3, suffix: "+" },
  { label: "Projects Completed", target: 20, suffix: "+" },
  { label: "Happy Clients", target: 10, suffix: "+" },
  { label: "Technologies", target: 15, suffix: "+" },
]

function Counter({
  target,
  suffix,
  revealed,
}: {
  target: number
  suffix: string
  revealed: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!revealed) {
      setCount(0)
      return
    }
    let start = 0
    const duration = 1500
    const step = 16
    const totalSteps = duration / step
    const increment = target / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)

    return () => clearInterval(timer)
  }, [target, revealed])

  return (
    <span className="text-4xl md:text-5xl font-bold text-zinc-100 tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 px-4 border-y border-zinc-800/50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <Counter
                  target={stat.target}
                  suffix={stat.suffix}
                  revealed={revealed}
                />
                <p className="text-zinc-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
