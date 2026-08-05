export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/20 glass-strong py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Leul Abera. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["GitHub", "LinkedIn", "Telegram"].map((s) => (
            <a
              key={s}
              href={`https://${s.toLowerCase()}.com/Leul-ab`}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
