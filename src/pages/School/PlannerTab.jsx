import { useState } from 'react'
import { Plus, Trash2, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import Modal from '../../components/Modal'

const SUBJECT_ICONS = ['📖','🔢','🌍','🔬','🎨','🏃','💻','🎵','📝','🌿']
const SUBJECT_COLORS = ['#E94560','#4D96FF','#6BCB77','#FFD93D','#C77DFF','#FF9A3C','#00C9FF','#F72585','#A8FF78','#FF6B6B']
const DAYS = ['Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag']

export default function PlannerTab() {
  const [subjects, setSubjects] = useLocalStorage('school_subjects', [])
  const [goals, setGoals] = useLocalStorage('school_goals', [])
  const [proud, setProud] = useLocalStorage('school_proud', [])
  const [weekPlan, setWeekPlan] = useLocalStorage('school_weekplan', {})
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showProudModal, setShowProudModal] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '📖', color: '#E94560' })
  const [proudText, setProudText] = useState('')
  const [view, setView] = useState('subjects') // subjects | week | proud

  function addSubject() {
    if (!form.name.trim()) return
    const subject = { id: Date.now(), name: form.name.trim(), icon: form.icon, color: form.color }
    setSubjects(prev => [...prev, subject])
    const goal = { subjectId: subject.id, text: '', progress: 0 }
    setGoals(prev => [...prev, goal])
    setForm({ name: '', icon: '📖', color: '#E94560' })
    setShowSubjectModal(false)
  }

  function deleteSubject(id) {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setGoals(prev => prev.filter(g => g.subjectId !== id))
  }

  function updateGoal(subjectId, updates) {
    setGoals(prev => prev.map(g => g.subjectId === subjectId ? { ...g, ...updates } : g))
  }

  function getGoal(subjectId) {
    return goals.find(g => g.subjectId === subjectId) || { text: '', progress: 0 }
  }

  function addProud() {
    if (!proudText.trim()) return
    setProud(prev => [{ id: Date.now(), text: proudText.trim(), date: new Date().toISOString() }, ...prev])
    setProudText('')
    setShowProudModal(false)
  }

  function toggleWeekTask(day, idx) {
    const tasks = weekPlan[day] || []
    const updated = tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t)
    setWeekPlan(w => ({ ...w, [day]: updated }))
  }

  function addWeekTask(day, text) {
    if (!text.trim()) return
    const tasks = weekPlan[day] || []
    setWeekPlan(w => ({ ...w, [day]: [...tasks, { text: text.trim(), done: false }] }))
  }

  function removeWeekTask(day, idx) {
    const tasks = (weekPlan[day] || []).filter((_, i) => i !== idx)
    setWeekPlan(w => ({ ...w, [day]: tasks }))
  }

  if (view === 'proud') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-title">Trots op 💛</p>
          <div className="flex gap-2">
            <button onClick={() => setShowProudModal(true)} className="btn-accent text-xs">+ Toevoegen</button>
            <button onClick={() => setView('subjects')} className="text-sm text-[#8892A4]">← Terug</button>
          </div>
        </div>
        {proud.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Schrijf op waar je trots op bent!</p>}
        {proud.map(p => (
          <div key={p.id} className="card border border-yellow-400/20">
            <div className="flex gap-2">
              <Heart size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#EAEAEA]">{p.text}</p>
                <p className="text-xs text-[#8892A4] mt-1">{new Date(p.date).toLocaleDateString('nl-NL')}</p>
              </div>
            </div>
          </div>
        ))}
        {showProudModal && (
          <Modal title="Trots op…" onClose={() => setShowProudModal(false)}>
            <div className="space-y-3">
              <textarea value={proudText} onChange={e => setProudText(e.target.value)} placeholder="Schrijf op wat goed ging..." rows={3} className="input resize-none" />
              <button onClick={addProud} disabled={!proudText.trim()} className="btn-accent w-full disabled:opacity-40">Opslaan</button>
            </div>
          </Modal>
        )}
      </div>
    )
  }

  if (view === 'week') {
    return (
      <WeekView weekPlan={weekPlan} onAddTask={addWeekTask} onToggle={toggleWeekTask} onRemove={removeWeekTask} onBack={() => setView('subjects')} />
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setView('week')} className="btn-ghost text-sm">📅 Weekplanner</button>
        <button onClick={() => setView('proud')} className="btn-ghost text-sm">💛 Trots op</button>
      </div>

      <button onClick={() => setShowSubjectModal(true)} className="btn-accent w-full flex items-center justify-center gap-2">
        <Plus size={16} /> Vak toevoegen
      </button>

      {subjects.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Voeg je vakken toe om te beginnen</p>}

      <div className="space-y-3">
        {subjects.map(s => {
          const goal = getGoal(s.id)
          return (
            <div key={s.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-display font-bold text-[#EAEAEA]">{s.name}</span>
                </div>
                <button onClick={() => deleteSubject(s.id)} className="text-[#E94560]"><Trash2 size={14} /></button>
              </div>
              <input
                value={goal.text}
                onChange={e => updateGoal(s.id, { text: e.target.value })}
                placeholder="Doel voor dit vak..."
                className="input text-sm"
              />
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#8892A4]">
                  <span>Voortgang</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-[#0F0F23] rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${goal.progress}%`, background: s.color }} />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={e => updateGoal(s.id, { progress: +e.target.value })}
                  className="w-full accent-[#E94560]"
                />
              </div>
            </div>
          )
        })}
      </div>

      {showSubjectModal && (
        <Modal title="Vak toevoegen" onClose={() => setShowSubjectModal(false)}>
          <div className="space-y-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Vaknaam" className="input" />
            <div>
              <p className="text-xs text-[#8892A4] mb-2">Icoon</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_ICONS.map(icon => (
                  <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))}
                    className={`text-xl w-10 h-10 rounded-xl ${form.icon === icon ? 'bg-[#E94560]' : 'bg-[#0F0F23]'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8892A4] mb-2">Kleur</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-white' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <button onClick={addSubject} disabled={!form.name.trim()} className="btn-accent w-full disabled:opacity-40">Toevoegen</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function WeekView({ weekPlan, onAddTask, onToggle, onRemove, onBack }) {
  const [inputs, setInputs] = useState({})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-title">Weekplanner</p>
        <button onClick={onBack} className="text-sm text-[#8892A4]">← Terug</button>
      </div>
      {DAYS.map(day => {
        const tasks = weekPlan[day] || []
        return (
          <div key={day} className="card space-y-2">
            <p className="font-display font-bold text-sm text-[#EAEAEA]">{day}</p>
            {tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => onToggle(day, i)}
                  className={`w-4 h-4 rounded border flex-shrink-0 ${t.done ? 'bg-[#E94560] border-[#E94560]' : 'border-[#8892A4]'}`}
                />
                <span className={`text-sm flex-1 ${t.done ? 'line-through text-[#8892A4]' : 'text-[#EAEAEA]'}`}>{t.text}</span>
                <button onClick={() => onRemove(day, i)} className="text-[#8892A4]"><Trash2 size={12} /></button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                value={inputs[day] || ''}
                onChange={e => setInputs(inp => ({ ...inp, [day]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { onAddTask(day, inputs[day] || ''); setInputs(inp => ({ ...inp, [day]: '' })) } }}
                placeholder="Taak toevoegen..."
                className="input text-xs"
              />
              <button onClick={() => { onAddTask(day, inputs[day] || ''); setInputs(inp => ({ ...inp, [day]: '' })) }} className="btn-accent text-xs px-3">+</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
