import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import Modal from '../../components/Modal'

const TAGS = ['Nolan', 'Lucy', 'Tim', 'Celina', 'Wesley', 'Lopez', 'Andere']
const STATUSES = { theory: { label: 'Theorie', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' }, confirmed: { label: 'Bevestigd ✅', color: 'text-green-400 bg-green-400/10 border-green-400/30' }, debunked: { label: 'Weerlegd ❌', color: 'text-red-400 bg-red-400/10 border-red-400/30' } }

const emptyForm = { title: '', description: '', tag: 'Andere', status: 'theory' }

export default function TheoryBoard() {
  const [theories, setTheories] = useLocalStorage('rookie_theories', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filterTag, setFilterTag] = useState('Alle')
  const [filterStatus, setFilterStatus] = useState('Alle')
  const [editing, setEditing] = useState(null)

  function save() {
    if (!form.title.trim()) return
    if (editing) {
      setTheories(prev => prev.map(t => t.id === editing ? { ...t, ...form } : t))
      setEditing(null)
    } else {
      setTheories(prev => [{ ...form, id: Date.now(), date: new Date().toISOString() }, ...prev])
    }
    setForm(emptyForm)
    setShowModal(false)
  }

  function deleteTheory(id) {
    setTheories(prev => prev.filter(t => t.id !== id))
  }

  function openEdit(t) {
    setForm({ title: t.title, description: t.description, tag: t.tag, status: t.status })
    setEditing(t.id)
    setShowModal(true)
  }

  const filtered = theories.filter(t =>
    (filterTag === 'Alle' || t.tag === filterTag) &&
    (filterStatus === 'Alle' || t.status === filterStatus)
  )

  return (
    <div className="space-y-4">
      <button onClick={() => { setForm(emptyForm); setEditing(null); setShowModal(true) }} className="btn-accent w-full flex items-center justify-center gap-2">
        <Plus size={16} /> Nieuwe theorie
      </button>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Alle', ...TAGS].map(t => (
            <button key={t} onClick={() => setFilterTag(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${filterTag === t ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['Alle', ...Object.keys(STATUSES)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${filterStatus === s ? 'bg-[#16213E] border border-[#E94560] text-[#E94560]' : 'bg-[#16213E] text-[#8892A4]'}`}>
              {s === 'Alle' ? 'Alle' : STATUSES[s].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Geen theorieën gevonden</p>}

      <div className="grid grid-cols-1 gap-3">
        {filtered.map(t => (
          <div key={t.id} className="card space-y-2 cursor-pointer" onClick={() => openEdit(t)}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-display font-bold text-[#EAEAEA] text-sm">{t.title}</p>
                {t.description && <p className="text-xs text-[#8892A4] mt-0.5 line-clamp-2">{t.description}</p>}
              </div>
              <button onClick={e => { e.stopPropagation(); deleteTheory(t.id) }} className="text-[#E94560] flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUSES[t.status].color}`}>
                {STATUSES[t.status].label}
              </span>
              <span className="text-xs bg-[#0F0F23] px-2 py-0.5 rounded-full text-[#8892A4]">{t.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Theorie bewerken' : 'Nieuwe theorie'} onClose={() => { setShowModal(false); setEditing(null) }}>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titel" className="input" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Beschrijving" rows={3} className="input resize-none" />
            <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="input">
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
            <div className="flex gap-2">
              {Object.entries(STATUSES).map(([key, val]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, status: key }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border ${form.status === key ? val.color : 'bg-[#16213E] text-[#8892A4] border-transparent'}`}>
                  {val.label}
                </button>
              ))}
            </div>
            <button onClick={save} disabled={!form.title.trim()} className="btn-accent w-full disabled:opacity-40">Opslaan</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
