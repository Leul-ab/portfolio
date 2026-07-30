export default function SectionDivider() {
  return (
    <div className="relative h-24 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
      </div>
    </div>
  )
}
