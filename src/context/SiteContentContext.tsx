import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiRequest } from "../lib/api"

export type SiteContent = {
  heroName: string
  heroIntro: string
  aboutText: string
  profileImage: string
  resumeUrl: string
  email: string
  location: string
  phone: string
  availability: string
  contactDescription: string
}

const defaultContent: SiteContent = {
  heroName: "Leul Abera",
  heroIntro:
    "Full-stack developer focused on building reliable, scalable, and modern web applications that turn ideas into practical digital experiences.",
  aboutText:
    "I build practical digital experiences, from thoughtful interfaces to dependable backend systems.",
  profileImage: "/leul_image.png",
  resumeUrl: "/LEUL_ABERA_CV.pdf",
  email: "leulabera321@gmail.com",
  location: "Addis Ababa, Ethiopia",
  phone: "+251 979 254 066",
  availability: "Available for opportunities",
  contactDescription:
    "Have a project in mind, a job opportunity, or simply want to connect? Send me a message and I'll get back to you.",
}

const SiteContentContext = createContext<SiteContent>(defaultContent)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    apiRequest<SiteContent>("/api/content")
      .then(setContent)
      .catch(() => undefined)
  }, [])

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}