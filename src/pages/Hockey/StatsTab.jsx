import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Target } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import Modal from '../../components/Modal'

const POSITIONS = ['Aanval', 'Middenveld', 'Verdediging', 'Keeper']

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  opponent: '',
  scoreUs: '',
  scoreThem: '',
  home: true,
  goals: 0,
  assists: 0,
  position: 'Middenveld',
  note: '',
}

export default function StatsTab() {
  const [matches, setMatches] = useLocalStorage('hockey_matches', [])
  const [goal, setGoal] = useLocalStorage('hockey_goal', { target: 10, season: new Date().getFullYear() })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [expanded, setExpanded] = useState(null)

  const won = matches.filter(m => m.scoreUs > m.scoreThem).length
  const lost = matches.filter(m => m.scoreUs < m.scoreThem).length
  const draw = matches.filter(m => m.scoreUs === m.scoreThem).length
  const totalGoals = matches.reduce((s, m) => s + (m.goals || 0), 0)
  const totalAssists = matches.reduce((s, m) => s + (m.assists || 0), 0)

  function addMatch() {
    if (!form.opponent.trim()) return
    const match = { ...form, id: Date.now(), scoreUs: +form.scoreUs || 0, scoreThem: +form.scoreThem || 0, goals: +form.goals, assists: +form.assists }
    setMatches(prev => [match, ...prev])
    setForm(emptyForm)
    setShowModal(false)
  }

  function deleteMatch(id) {
    setMatches(prev => prev.filter(m => m.id !== id))
  }

  const progress = Math.min((totalGoals / (goal.target || 1)) * 100, 100)

  return (
    <div className="space-y-4">
      {/* Dashboard */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-3xl font-display font-extrabold text-[#E94560]">{matches.length}</p>
          <p className="text-xs text-[#8892A4]">Gespeeld</p>
          <p className="text-xs text-[#EAEAEA] mt-1">{won}W · {draw}G · {lost}V</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-display font-extrabold text-[#E94560]">{totalGoals}</p>
          <p className="text-xs text-[#8892A4]">Doelpunten</p>
          <p className="text-xs text-[#EAEAEA] mt-1">{totalAssists} assists</p>
        </div>
      </div>

      {/* Seizoensdoel */}
      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#EAEAEA] flex items-center gap-1.5">
            <Target size={14} className="text-[#E94560]" />
            Seizoensdoel
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8892A4]">doel:</span>
            <input
              type="number"
              value={goal.target}
              onChange={e => setGoal(g => ({ ...g, target: +e.target.value }))}
              className="w-14 input text-xs text-center py-1"
              min={1}
            />
          </div>
        </div>
        <div className="w-full bg-[#0F0F23] rounded-full h-3">
          <div className="bg-[#E94560] h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[#8892A4] text-right">{totalGoals} / {goal.target} doelpunten</p>
      </div>

      <button onClick={() => setShowModal(true)} className="btn-accent w-full flex items-center justify-center gap-2">
        <Plus size={16} /> Wedstrijd toevoegen
      </button>

      {/* Wedstrijdlijst */}
      <div className="space-y-2">
        {matches.length === 0 && <p className="text-[#8892A4] text-sm text-center py-4">Nog geen wedstrijden</p>}
        {matches.map(m => (
          <div key={m.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#EAEAEA]">{m.home ? 'Thuis' : 'Uit'} vs {m.opponent}</p>
                <p className="text-xs text-[#8892A4]">{new Date(m.date).toLocaleDateString('nl-NL')} · {m.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-display font-bold text-lg ${m.scoreUs > m.scoreThem ? 'text-green-400' : m.scoreUs < m.scoreThem ? 'text-red-400' : 'text-[#8892A4]'}`}>
                  {m.scoreUs}–{m.scoreThem}
                </span>
                <button onClick={() => setExpanded(e => e === m.id ? null : m.id)} className="text-[#8892A4]">
                  {expanded === m.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => deleteMatch(m.id)} className="text-[#E94560]"><Trash2 size={14} /></button>
              </div>
            </div>
            {expanded === m.id && (
              <div className="border-t border-white/10 pt-2 space-y-1">
                <p className="text-sm text-[#EAEAEA]">⚽ {m.goals} doelpunten · 🅰 {m.assists} assists</p>
                {m.note && <p className="text-sm text-[#8892A4] italic">"{m.note}"</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Wedstrijd toevoegen" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input" />
            <input value={form.opponent} onChange={e => setForm(f => ({ ...f, opponent: e.target.value }))} placeholder="Tegenstander" className="input" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={form.scoreUs} onChange={e => setForm(f => ({ ...f, scoreUs: e.target.value }))} placeholder="Jouw team" className="input" min={0} />
              <input type="number" value={form.scoreThem} onChange={e => setForm(f => ({ ...f, scoreThem: e.target.value }))} placeholder="Tegenstander" className="input" min={0} />
            </div>
            <div className="flex gap-2">
              {['Thuis', 'Uit'].map((t, i) => (
                <button key={t} onClick={() => setForm(f => ({ ...f, home: i === 0 })) }
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold ${(form.home && i === 0) || (!form.home && i === 1) ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-[#8892A4] mb-1">Doelpunten</p>
                <input type="number" value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} className="input" min={0} />
              </div>
              <div>
                <p className="text-xs text-[#8892A4] mb-1">Assists</p>
                <input type="number" value={form.assists} onChange={e => setForm(f => ({ ...f, assists: e.target.value }))} className="input" min={0} />
              </div>
            </div>
            <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="input">
              {POSITIONS.map(p => <option key={p}>{p}</option>)}
            </select>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Notitie (optioneel)" rows={2} className="input resize-none" />
            <button onClick={addMatch} disabled={!form.opponent.trim()} className="btn-accent w-full disabled:opacity-40">Opslaan</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
