"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope)
          
          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available
                  console.log("New version available")
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log("SW registration failed:", error)
        })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "SYNC_REQUESTED") {
          // Trigger sync from the app
          window.dispatchEvent(new CustomEvent("sw-sync-requested"))
        }
      })
    }
  }, [])

  return null
}
