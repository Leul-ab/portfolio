const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Leul-ab",
    path: "M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.005-.404c1.02.005 2.045.138 3.005.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.813 1.102.813 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leul-a-0509a9279/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.722v20.555C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.277V1.722C24 .771 23.208 0 22.225 0z",
  },
  {
    label: "Telegram",
    href: "https://t.me/leul_abera",
    path: "M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm5.74 7.743-1.038 8.703c-.084.706-.48.87-1.282.54l-2.788-1.869-1.347 1.297c-.148.148-.272.273-.553.273l.206-2.868 5.22-4.718c.227-.206 0-.33-.18-.125L8.796 12.742 6.298 11.6c-.6-.207-.61-.6.128-.86l10.352-3.983c.46-.176.86.105.68.986z",
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/20 glass-strong py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Leul Abera. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="inline-flex items-center justify-center size-9 rounded-full text-zinc-500 transition-all hover:text-indigo-400 hover:scale-110 dark:text-zinc-400"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
