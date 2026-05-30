import { useState } from 'react'
import PlannerTab from './PlannerTab'
import FlashcardsTab from './FlashcardsTab'

const tabs = ['Planner', 'Studiekaartjes']

export default function SchoolPage() {
  const [tab, setTab] = useState(0)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-0">
        <h1 className="font-display font-extrabold text-2xl text-[#EAEAEA] mb-4">📚 School</h1>
        <div className="flex gap-2 mb-4">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === i ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {tab === 0 ? <PlannerTab /> : <FlashcardsTab />}
      </div>
    </div>
  )
}
