import { useState } from 'react'
import { Star, Plus, Shuffle, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { defaultDrills } from '../../data/defaultDrills'
import Modal from '../../components/Modal'

const CATEGORIES = ['Alle', 'Aanval', 'Verdediging', 'Conditie', 'Stick Skills', 'Keeper']

export default function DrillsTab() {
  const [customDrills, setCustomDrills] = useLocalStorage('hockey_drills', [])
  const [favorites, setFavorites] = useLocalStorage('hockey_drill_favorites', [])
  const [filter, setFilter] = useState('Alle')
  const [showModal, setShowModal] = useState(false)
  const [drillOfDay, setDrillOfDay] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', category: 'Aanval', duration: '10 min', level: 'beginner' })

  const allDrills = [...defaultDrills, ...customDrills]
  const filtered = filter === 'Alle' ? allDrills : allDrills.filter(d => d.category === filter)

  function toggleFav(id) {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  }

  function randomDrillOfDay() {
    const favDrills = allDrills.filter(d => favorites.includes(d.id))
    const pool = favDrills.length > 0 ? favDrills : allDrills
    setDrillOfDay(pool[Math.floor(Math.random() * pool.length)])
  }

  function addCustomDrill() {
    if (!form.name.trim()) return
    const drill = { ...form, id: `c${Date.now()}` }
    setCustomDrills(prev => [...prev, drill])
    setForm({ name: '', description: '', category: 'Aanval', duration: '10 min', level: 'beginner' })
    setShowModal(false)
  }

  function deleteDrill(id) {
    setCustomDrills(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-4">
      <button onClick={randomDrillOfDay} className="btn-accent w-full flex items-center justify-center gap-2">
        <Shuffle size={16} /> Drill van de dag
      </button>

      {drillOfDay && (
        <div className="card border border-[#E94560]/40 space-y-2">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-wide">Drill van de dag</p>
          <p className="font-display font-bold text-[#EAEAEA]">{drillOfDay.name}</p>
          <p className="text-sm text-[#8892A4]">{drillOfDay.description}</p>
          <div className="flex gap-2 text-xs text-[#8892A4]">
            <span>{drillOfDay.duration}</span>
            <span>·</span>
            <span className="capitalize">{drillOfDay.level}</span>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${filter === c ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}>
            {c}
          </button>
        ))}
      </div>

      <button onClick={() => setShowModal(true)} className="btn-ghost text-sm flex items-center justify-center gap-2 w-full">
        <Plus size={14} /> Eigen drill toevoegen
      </button>

      <div className="space-y-2">
        {filtered.map(drill => (
          <div key={drill.id} className="card space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-[#EAEAEA] text-sm">{drill.name}</p>
                <div className="flex gap-2 text-xs text-[#8892A4] mt-0.5">
                  <span>{drill.category}</span>
                  <span>·</span>
                  <span>{drill.duration}</span>
                  <span>·</span>
                  <span className="capitalize">{drill.level}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleFav(drill.id)}>
                  <Star size={16} className={favorites.includes(drill.id) ? 'fill-[#E94560] text-[#E94560]' : 'text-[#8892A4]'} />
                </button>
                {drill.id.startsWith('c') && (
                  <button onClick={() => deleteDrill(drill.id)} className="text-[#E94560]"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
            <p className="text-xs text-[#8892A4]">{drill.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Eigen drill" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Naam" className="input" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Beschrijving" rows={3} className="input resize-none" />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
              {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Duur" className="input" />
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="input">
                <option value="beginner">Beginner</option>
                <option value="gevorderd">Gevorderd</option>
              </select>
            </div>
            <button onClick={addCustomDrill} disabled={!form.name.trim()} className="btn-accent w-full disabled:opacity-40">Opslaan</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
