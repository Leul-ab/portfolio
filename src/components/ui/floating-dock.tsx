import { useState, useRef, type ReactNode } from "react"
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
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-1.5 sm:gap-4 rounded-2xl px-1.5 sm:px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
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
}: FloatingDockItem & { mouseX: MotionValue }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const dockButton = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full transition-[box-shadow,color,background-color] duration-300",
        active
          ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.6)]"
          : hovered
            ? "bg-transparent text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.55)]"
            : "bg-transparent text-zinc-400 dark:text-neutral-300"
      )}
    >
      {active && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
      )}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute left-1/2 top-full mt-2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs text-white"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
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
        className="bg-transparent p-0"
        whileTap={{ scale: 0.9 }}
      >
        {dockButton}
      </motion.button>
    )
  }

  return <a href={href}>{dockButton}</a>
}
