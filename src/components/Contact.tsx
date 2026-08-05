import { type FormEvent, useState } from "react"
import Reveal from "./Reveal"

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Get in <span className="text-indigo-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-500 rounded-full mb-10" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12">
          <Reveal direction="left">
            <div className="space-y-6">
              <p className="text-zinc-400 leading-relaxed">
                Whether you have a project in mind, a job opportunity, or just
                want to say hi — I'm always open to new connections.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Email", value: "leulabera321@gmail.com" },
                  { label: "Location", value: "Addis Ababa, Ethiopia" },
                  { label: "Phone", value: "+251 979 254 066" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-zinc-300 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-lg glass text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-lg glass text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-lg glass text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg glass text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm resize-none"
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg font-medium transition-all text-sm cursor-pointer ${
                  sent
                    ? "bg-emerald-500 text-white"
                    : "bg-indigo-500 hover:bg-indigo-400 text-white hover:scale-105 active:scale-95"
                }`}
              >
                {sent ? "✓ Message Sent!" : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
