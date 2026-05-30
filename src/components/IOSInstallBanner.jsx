import { useState } from 'react'
import { X, Share } from 'lucide-react'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}

export default function IOSInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('sparks_install_dismissed') === '1'
  )

  if (dismissed || !isIOS() || isStandalone()) return null

  function dismiss() {
    localStorage.setItem('sparks_install_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 bg-[#16213E] border border-[#E94560]/40 rounded-2xl p-4 shadow-xl">
      <button onClick={dismiss} className="absolute top-3 right-3 text-[#8892A4]">
        <X size={16} />
      </button>
      <p className="font-display font-bold text-sm text-[#EAEAEA] mb-1">Installeer Sparks op je iPhone</p>
      <p className="text-xs text-[#8892A4] leading-relaxed">
        Tik op <Share size={12} className="inline" /> <strong>Delen</strong> onderaan Safari,
        en kies dan <strong>"Zet op beginscherm"</strong> voor de beste ervaring.
      </p>
    </div>
  )
}
