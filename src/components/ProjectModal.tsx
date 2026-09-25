
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Layers3,
  X,
} from "lucide-react"

interface Project {
  title: string
  desc: string
  tags: string[]
  image: string
  category?: string
  links?: {
    github?: string
    live?: string
  }
  imageFit?: "cover" | "contain"
  imageBg?: string
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const githubLink =
    project.links?.github || "https://github.com/Leul-ab"

  const liveLink = project.links?.live

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const imageSrc = `${import.meta.env.BASE_URL}${project.image.replace(
    /^\//,
    ""
  )}`

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close project modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 24,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 12,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 28,
        }}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/95 shadow-2xl shadow-black/60"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-400 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-black/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Image */}
          <div
            className={`relative h-56 overflow-hidden sm:h-72 ${
              project.imageBg ?? "bg-zinc-900"
            }`}
          >
            <img
              src={imageSrc}
              alt={project.title}
              className={`h-full w-full ${
                project.imageFit === "contain"
                  ? "object-contain scale-95 -translate-x-1"
                  : "object-cover"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-black/10" />

            {/* Category */}
            <div className="absolute bottom-5 left-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
                <Layers3 className="h-3.5 w-3.5 text-indigo-400" />

                {project.category === "backend"
                  ? "Backend Project"
                  : "Full Stack Project"}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Heading */}
            <div className="mb-6 pr-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Project Details
              </p>

              <h3 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                {project.title}
              </h3>
            </div>

            {/* Description */}
            <p className="mb-7 text-sm leading-7 text-zinc-400 sm:text-base">
              {project.desc}
            </p>

            {/* Technologies */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                Technologies
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-5 py-3 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white ${
                  liveLink
                    ? "sm:flex-1"
                    : "w-full sm:mx-auto sm:max-w-xs"
                }`}
              >
                <GitBranch className="h-4 w-4" />

                View on GitHub

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-indigo-400 hover:shadow-indigo-500/30"
                >
                  <ExternalLink className="h-4 w-4" />

                  Live Demo

                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

