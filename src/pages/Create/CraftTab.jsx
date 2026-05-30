import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Camera } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import StarRating from '../../components/StarRating'
import Modal from '../../components/Modal'

const STATUS_LABELS = { idea: 'Idee 💡', busy: 'Bezig 🔨', done: 'Klaar ✅' }
const STATUS_ORDER = ['idea', 'busy', 'done']

function ProjectCard({ project, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [newItem, setNewItem] = useState('')

  function toggleMaterial(idx) {
    const mats = project.materials.map((m, i) => i === idx ? { ...m, done: !m.done } : m)
    onUpdate({ ...project, materials: mats })
  }

  function addMaterial() {
    if (!newItem.trim()) return
    onUpdate({ ...project, materials: [...project.materials, { text: newItem.trim(), done: false }] })
    setNewItem('')
  }

  function removeMaterial(idx) {
    onUpdate({ ...project, materials: project.materials.filter((_, i) => i !== idx) })
  }

  function nextStatus() {
    const idx = STATUS_ORDER.indexOf(project.status)
    if (idx < STATUS_ORDER.length - 1)
      onUpdate({ ...project, status: STATUS_ORDER[idx + 1] })
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onUpdate({ ...project, photo: ev.target.result })
    reader.readAsDataURL(file)
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-[#EAEAEA]">{project.name}</span>
            <span className="text-xs bg-[#0F0F23] px-2 py-0.5 rounded-full text-[#8892A4]">{STATUS_LABELS[project.status]}</span>
          </div>
          <StarRating value={project.difficulty} readonly />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(o => !o)} className="text-[#8892A4]">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button onClick={onDelete} className="text-[#E94560]"><Trash2 size={16} /></button>
        </div>
      </div>

      {project.photo && (
        <img src={project.photo} alt="" className="w-full rounded-xl max-h-40 object-cover" />
      )}

      {open && (
        <div className="space-y-3">
          {project.description && <p className="text-[#8892A4] text-sm">{project.description}</p>}

          {/* Foto toevoegen */}
          <label className="flex items-center gap-2 text-sm text-[#8892A4] cursor-pointer">
            <Camera size={14} />
            Foto toevoegen
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          </label>

          {/* Materiaallijst */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8892A4] uppercase tracking-wide">Materialen</p>
            {project.materials.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => toggleMaterial(i)}
                  className={`w-4 h-4 rounded border flex-shrink-0 ${m.done ? 'bg-[#E94560] border-[#E94560]' : 'border-[#8892A4]'}`}
                />
                <span className={`text-sm flex-1 ${m.done ? 'line-through text-[#8892A4]' : 'text-[#EAEAEA]'}`}>{m.text}</span>
                <button onClick={() => removeMaterial(i)} className="text-[#8892A4]"><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMaterial()}
                placeholder="Materiaal toevoegen..."
                className="input text-sm"
              />
              <button onClick={addMaterial} className="btn-accent text-sm px-3">+</button>
            </div>
          </div>

          {/* Notitie */}
          <textarea
            value={project.note || ''}
            onChange={e => onUpdate({ ...project, note: e.target.value })}
            placeholder="Notities..."
            rows={2}
            className="input text-sm resize-none"
          />

          {project.status !== 'done' && (
            <button onClick={nextStatus} className="btn-ghost text-sm w-full">
              Zet door naar: {STATUS_LABELS[STATUS_ORDER[STATUS_ORDER.indexOf(project.status) + 1]]}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function CraftTab() {
  const [projects, setProjects] = useLocalStorage('create_projects', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', difficulty: 3 })
  const [sortBy, setSortBy] = useState('date')

  function addProject() {
    if (!form.name.trim()) return
    const project = {
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      status: 'idea',
      materials: [],
      note: '',
      photo: null,
      date: new Date().toISOString(),
    }
    setProjects(prev => [project, ...prev])
    setForm({ name: '', description: '', difficulty: 3 })
    setShowModal(false)
  }

  function updateProject(updated) {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const sorted = [...projects].sort((a, b) => {
    if (sortBy === 'status') return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    return new Date(b.date) - new Date(a.date)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['date', 'status'].map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-3 py-1 rounded-full ${sortBy === s ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}
            >
              {s === 'date' ? 'Datum' : 'Status'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm flex items-center gap-1">
          <Plus size={14} /> Project
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-[#8892A4] text-sm text-center py-8">Nog geen projecten. Maak je eerste knutselproject aan!</p>
      )}

      <div className="space-y-3">
        {sorted.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            onUpdate={updateProject}
            onDelete={() => deleteProject(p.id)}
          />
        ))}
      </div>

      {showModal && (
        <Modal title="Nieuw project" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Naam van het project" className="input" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Beschrijving (optioneel)" rows={2} className="input resize-none" />
            <div>
              <p className="text-sm text-[#8892A4] mb-1">Moeilijkheid</p>
              <StarRating value={form.difficulty} onChange={v => setForm(f => ({ ...f, difficulty: v }))} />
            </div>
            <button onClick={addProject} disabled={!form.name.trim()} className="btn-accent w-full disabled:opacity-40">
              Project aanmaken
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
