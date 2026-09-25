
import { useRef, useState, type ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { cn } from "../../lib/utils"

export interface FloatingDockItem {
  title: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
}

export function FloatingDock({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  return <FloatingDockDesktop items={items} className={className} />
}

function FloatingDockDesktop({
  items,
  className,
}: {
  items: FloatingDockItem[]
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(event) => {
        mouseX.set(event.clientX)
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity)
      }}
      className={cn(
        "relative mx-auto flex h-16 items-end gap-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 px-2.5 pb-2.5 shadow-2xl shadow-black/20 backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-indigo-400/30 before:to-transparent",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          {...item}
        />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  active,
}: FloatingDockItem & { mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  /*
   * Wider influence range = smoother movement between icons.
   *
   * Instead of:
   * [-150, 0, 150]
   *
   * we use:
   * [-200, 0, 200]
   *
   * This prevents the dock from jumping when the cursor
   * moves from one icon to another.
   */
  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect()

    if (!bounds) return Infinity

    return value - (bounds.left + bounds.width / 2)
  })

  /*
   * Smaller size difference makes the animation feel
   * much more natural and less "bouncy".
   */
  const widthTransform = useTransform(
    distance,
    [-200, -100, 0, 100, 200],
    [40, 45, 64, 45, 40]
  )

  const heightTransform = useTransform(
    distance,
    [-200, -100, 0, 100, 200],
    [40, 45, 64, 45, 40]
  )

  const iconWidthTransform = useTransform(
    distance,
    [-200, -100, 0, 100, 200],
    [19, 21, 30, 21, 19]
  )

  const iconHeightTransform = useTransform(
    distance,
    [-200, -100, 0, 100, 200],
    [19, 21, 30, 21, 19]
  )

  /*
   * Softer spring:
   * - lower stiffness
   * - higher damping
   *
   * This removes the sudden snapping effect.
   */
  const springConfig = {
    mass: 0.18,
    stiffness: 120,
    damping: 18,
  }

  const width = useSpring(widthTransform, springConfig)
  const height = useSpring(heightTransform, springConfig)

  const iconWidth = useSpring(iconWidthTransform, springConfig)
  const iconHeight = useSpring(iconHeightTransform, springConfig)

  const dockButton = (
    <motion.div
      ref={ref}
      style={{
        width,
        height,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-xl",
        "transition-colors duration-300 ease-out",
        active
          ? "bg-indigo-500/15 text-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.18)]"
          : hovered
            ? "bg-white/[0.04] text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            : "text-zinc-500"
      )}
    >
      {/* Active indicator */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]"
          />
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{
              opacity: 0,
              y: 5,
              x: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: "-50%",
            }}
            exit={{
              opacity: 0,
              y: 3,
              x: "-50%",
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 whitespace-nowrap rounded-lg border border-zinc-700/80 bg-zinc-900/95 px-2.5 py-1.5 text-[11px] font-medium text-zinc-200 shadow-xl shadow-black/30 backdrop-blur-md"
          >
            {title}

            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-700/80 bg-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        style={{
          width: iconWidth,
          height: iconHeight,
        }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  )

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={title}
        className="bg-transparent p-0"
        whileTap={{ scale: 0.94 }}
      >
        {dockButton}
      </motion.button>
    )
  }

  return (
    <a
      href={href}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className="block"
    >
      {dockButton}
    </a>
  )
}

