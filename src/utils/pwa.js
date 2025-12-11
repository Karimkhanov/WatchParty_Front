// Register service worker
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("[PWA] Service Worker registered:", registration)
      return registration
    } catch (error) {
      console.error("[PWA] Service Worker registration failed:", error)
    }
  }
}

// Check if app is installable and request install
export function setupInstallPrompt() {
  let deferredPrompt

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e
    // Show install button
    const installButton = document.getElementById("install-app-btn")
    if (installButton) {
      installButton.style.display = "block"
      installButton.addEventListener("click", async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`[PWA] User response to the install prompt: ${outcome}`)
          deferredPrompt = null
        }
      })
    }
  })

  window.addEventListener("appinstalled", () => {
    console.log("[PWA] App installed successfully")
    deferredPrompt = null
  })
}

// Check if app is in standalone mode (installed as PWA)
export function isInstalledPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  )
}

// Request to update service worker
export async function updateServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        registration.update()
      }
    } catch (error) {
      console.error("[PWA] Failed to update service worker:", error)
    }
  }
}
