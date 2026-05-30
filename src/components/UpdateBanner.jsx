import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      // Elk uur controleren op een nieuwe versie
      if (r) setInterval(() => r.update(), 60 * 60 * 1000)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed top-4 left-3 right-3 z-[300] bg-[#16213E] border border-[#E94560]/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce-once">
      <RefreshCw size={18} className="text-[#E94560] flex-shrink-0" />
      <div className="flex-1">
        <p className="font-display font-bold text-sm text-[#EAEAEA]">Nieuwe versie beschikbaar!</p>
        <p className="text-xs text-[#8892A4]">Sparks is bijgewerkt</p>
      </div>
      <button
        onClick={() => updateServiceWorker(true)}
        className="btn-accent text-sm px-4 py-2 flex-shrink-0"
      >
        Vernieuwen
      </button>
    </div>
  )
}
