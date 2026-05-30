import { Star } from 'lucide-react'

export default function StarRating({ value, onChange, max = 5, readonly = false }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          onClick={() => !readonly && onChange && onChange(i + 1)}
          disabled={readonly}
          className="disabled:cursor-default"
        >
          <Star
            size={18}
            className={i < value ? 'fill-[#E94560] text-[#E94560]' : 'text-[#8892A4]'}
          />
        </button>
      ))}
    </div>
  )
}
