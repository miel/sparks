import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full bg-[#16213E] rounded-t-3xl flex flex-col"
        style={{ maxHeight: '88vh' }}
      >
        {/* Vaste header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="font-display font-bold text-lg text-[#EAEAEA]">{title}</h2>
          <button onClick={onClose} className="text-[#8892A4] p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollbare inhoud */}
        <div
          className="overflow-y-auto px-5 pb-5 flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>

        {/* Ruimte voor home indicator */}
        <div style={{ height: 'env(safe-area-inset-bottom, 16px)', minHeight: '16px' }} className="flex-shrink-0" />
      </div>
    </div>
  )
}
