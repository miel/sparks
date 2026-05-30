import { NavLink } from 'react-router-dom'
import { Sparkles, Palette, Target, Tv, BookOpen } from 'lucide-react'

const tabs = [
  { to: '/',        icon: Sparkles,  label: 'Spark',   emoji: '✨' },
  { to: '/create',  icon: Palette,   label: 'Create',  emoji: '🎨' },
  { to: '/hockey',  icon: Target,    label: 'Hockey',  emoji: '🏑' },
  { to: '/rookie',  icon: Tv,        label: 'Rookie',  emoji: '📺' },
  { to: '/school',  icon: BookOpen,  label: 'School',  emoji: '📚' },
]

export default function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#16213E] border-t border-white/10 safe-bottom z-50">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                isActive ? 'text-[#E94560]' : 'text-[#8892A4]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">{emoji}</span>
                <span className={`text-[10px] font-semibold font-display ${isActive ? 'text-[#E94560]' : 'text-[#8892A4]'}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#E94560] mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
