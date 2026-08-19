import { useEffect } from "react"
import { motion } from "framer-motion"

interface Project {
  title: string
  desc: string
  tags: string[]
  image: string
  links?: { github?: string; live?: string }
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const githubLink = project.links?.github || "https://github.com/Leul-ab"
  const liveLink = project.links?.live

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handler)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-lg rounded-2xl glass-strong border border-zinc-800/20 p-8 shadow-2xl shine"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 glass glass-hover transition-all cursor-pointer"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="h-52 overflow-hidden rounded-xl border border-zinc-800/20 mb-6 bg-gradient-to-br from-indigo-500/15 to-purple-500/15">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-xl font-bold text-zinc-100 mb-3">{project.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-5">
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center gap-3 ${liveLink ? "" : "justify-center"}`}>
          <a
            href={githubLink}
            target="_blank"
            rel="noreferrer"
            className={`${liveLink ? "flex-1" : "w-full"} text-center px-4 py-2.5 rounded-lg glass glass-hover text-zinc-300 hover:text-white text-sm font-medium transition-all`}
          >
            View on GitHub
          </a>

          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all"
            >
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
