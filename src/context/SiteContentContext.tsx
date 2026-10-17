import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiRequest } from "../lib/api"

export type SiteContent = {
  heroName: string
  heroIntro: string
  aboutText: string
  profileImage: string
  resumeUrl: string
  showResume?: boolean
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
  profileImage: "/leul_image.webp",
  resumeUrl: "/LEUL_ABERA_CV.pdf",
  showResume: true,
  email: "leulabera321@gmail.com",
  location: "Addis Ababa, Ethiopia",
  phone: "+251 979 254 066",
  availability: "Available for opportunities",
  contactDescription:
    "Have a project in mind, a job opportunity, or simply want to connect? Send me a message and I'll get back to you.",
}

export function notifyContentUpdated(newContent?: SiteContent) {
  try {
    localStorage.setItem("portfolio_content_sync_ts", Date.now().toString())
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("portfolio_content_sync")
      channel.postMessage({ type: "CONTENT_UPDATED", content: newContent })
      channel.close()
    }
  } catch {
    // Ignore storage/broadcast restrictions
  }
}

const SiteContentContext = createContext<SiteContent>(defaultContent)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    let isMounted = true

    const fetchFreshContent = () => {
      apiRequest<SiteContent>("/api/content")
        .then((fresh) => {
          if (isMounted && fresh) setContent(fresh)
        })
        .catch(() => undefined)
    }

    // Initial load
    fetchFreshContent()

    // Refresh when tab comes back into focus
    const handleFocus = () => fetchFreshContent()
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchFreshContent()
    }
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibility)

    // Cross-tab real-time sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "portfolio_content_sync_ts") {
        fetchFreshContent()
      }
    }
    window.addEventListener("storage", handleStorage)

    let channel: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel("portfolio_content_sync")
        channel.onmessage = (event) => {
          if (isMounted) {
            if (event.data?.content) {
              setContent(event.data.content)
            } else {
              fetchFreshContent()
            }
          }
        }
      } catch {
        // Channel unavailable
      }
    }

    return () => {
      isMounted = false
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("storage", handleStorage)
      if (channel) channel.close()
    }
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