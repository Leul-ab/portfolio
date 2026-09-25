
import { type FormEvent, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react"
import Reveal from "./Reveal"

const contactInfo = [
  {
    label: "Email",
    value: "leulabera321@gmail.com",
    href: "mailto:leulabera321@gmail.com",
    icon: Mail,
  },
  {
    label: "Location",
    value: "Addis Ababa, Ethiopia",
    icon: MapPin,
  },
  {
    label: "Phone",
    value: "+251 979 254 066",
    href: "tel:+251979254066",
    icon: Phone,
  },
]

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSent(true)

    setTimeout(() => {
      setSent(false)
    }, 3000)
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 py-24 sm:px-6"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <div className="mb-14 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
                Get In Touch
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
              Let&apos;s{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Connect
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Have a project in mind, a job opportunity, or simply want to
              connect? Send me a message and I&apos;ll get back to you.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Contact Information */}
          <Reveal direction="left">
            <div className="h-full rounded-3xl border border-zinc-800/80 bg-zinc-950/50 p-6 shadow-2xl shadow-black/10 sm:p-8">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>

                <h3 className="text-xl font-semibold text-zinc-100">
                  Let&apos;s talk
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  I&apos;m open to discussing new projects, opportunities,
                  collaborations, and interesting ideas.
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon

                  const content = (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 transition-colors duration-300 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10">
                        <Icon className="h-4 w-4 text-zinc-500 transition-colors duration-300 group-hover:text-indigo-400" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          {item.label}
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-zinc-300 transition-colors group-hover:text-zinc-100">
                          {item.value}
                        </p>
                      </div>

                      {item.href && (
                        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-zinc-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                      )}
                    </>
                  )

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/25 hover:bg-indigo-500/5"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="group flex items-center gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-4 transition-all duration-300 hover:border-indigo-500/25 hover:bg-indigo-500/5"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>

              {/* Availability */}
              <div className="mt-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>

                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      Available for opportunities
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Open to freelance and full-time work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal direction="right" delay={100}>
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/50 p-6 shadow-2xl shadow-black/10 sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Send a message
                </p>

                <h3 className="mt-2 text-xl font-semibold text-zinc-100">
                  Tell me about your project
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Your Name
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-zinc-900/70 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Email Address
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-zinc-900/70 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-xs font-medium text-zinc-400"
                  >
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    placeholder="Project inquiry"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-zinc-900/70 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-medium text-zinc-400"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me a little about what you'd like to build..."
                    rows={6}
                    required
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm leading-6 text-zinc-100 outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-zinc-700 focus:border-indigo-500/50 focus:bg-zinc-900/70 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <button
                  type="submit"
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    sent
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:translate-y-0"
                  }`}
                >
                  {sent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Message Sent Successfully
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-5 text-zinc-600">
                  Your message will be handled with care. I&apos;ll respond as
                  soon as possible.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
