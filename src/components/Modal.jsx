import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-[#16213E] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-[#EAEAEA]">{title}</h2>
          <button onClick={onClose} className="text-[#8892A4] p-1">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
