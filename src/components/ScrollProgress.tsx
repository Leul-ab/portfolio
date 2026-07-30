import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-0.5 bg-zinc-800">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-150 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
