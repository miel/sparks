import { useState } from 'react'
import { Plus, Trash2, RotateCcw } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useLocalStorage as useLS } from '../../hooks/useLocalStorage'
import Modal from '../../components/Modal'

export default function FlashcardsTab() {
  const [cards, setCards] = useLocalStorage('school_flashcards', [])
  const [subjects] = useLS('school_subjects', [])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ front: '', back: '', subjectId: '' })
  const [practiceSubject, setPracticeSubject] = useState(null)
  const [practiceCards, setPracticeCards] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  function addCard() {
    if (!form.front.trim() || !form.back.trim()) return
    setCards(prev => [...prev, { id: Date.now(), ...form, score: 0, nextDate: null }])
    setForm(f => ({ ...f, front: '', back: '' }))
    setShowModal(false)
  }

  function deleteCard(id) {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function startPractice(subjectId) {
    const pool = cards.filter(c => subjectId === 'all' ? true : c.subjectId === subjectId)
    const sorted = [...pool].sort((a, b) => (a.score || 0) - (b.score || 0))
    setPracticeCards(sorted)
    setCurrentIdx(0)
    setFlipped(false)
    setPracticeSubject(subjectId)
  }

  function answer(result) {
    const card = practiceCards[currentIdx]
    const scoreMap = { knew: 2, almost: 1, not: 0 }
    const newScore = Math.max(0, (card.score || 0) + scoreMap[result] - (result === 'not' ? 1 : 0))
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, score: newScore } : c))
    setPracticeCards(prev => prev.map((c, i) => i === currentIdx ? { ...c, score: newScore } : c))
    setFlipped(false)
    if (currentIdx + 1 < practiceCards.length) {
      setCurrentIdx(i => i + 1)
    } else {
      setPracticeSubject(null)
    }
  }

  if (practiceSubject !== null) {
    const card = practiceCards[currentIdx]
    if (!card) {
      return (
        <div className="text-center py-12 space-y-4">
          <p className="text-4xl">🎉</p>
          <p className="font-display font-bold text-xl text-[#EAEAEA]">Klaar!</p>
          <p className="text-[#8892A4]">Je hebt alle kaartjes geoefend.</p>
          <button onClick={() => setPracticeSubject(null)} className="btn-accent">Terug naar overzicht</button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8892A4]">{currentIdx + 1} / {practiceCards.length}</p>
          <button onClick={() => setPracticeSubject(null)} className="text-sm text-[#8892A4]">Stop</button>
        </div>

        <div
          className="card min-h-44 flex items-center justify-center cursor-pointer select-none active:scale-98"
          onClick={() => setFlipped(f => !f)}
          style={{ transition: 'transform 0.2s' }}
        >
          <div className="text-center space-y-2">
            <p className="text-xs text-[#8892A4] uppercase tracking-wide">{flipped ? 'Antwoord' : 'Vraag'}</p>
            <p className="font-display font-bold text-lg text-[#EAEAEA] leading-snug">
              {flipped ? card.back : card.front}
            </p>
            {!flipped && <p className="text-xs text-[#8892A4] mt-4">Tik om het antwoord te zien</p>}
          </div>
        </div>

        {flipped && (
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => answer('not')} className="py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-semibold">Nog niet 😅</button>
            <button onClick={() => answer('almost')} className="py-2 rounded-xl bg-yellow-500/20 text-yellow-400 text-sm font-semibold">Bijna 🤔</button>
            <button onClick={() => answer('knew')} className="py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-semibold">Wist het ✅</button>
          </div>
        )}
      </div>
    )
  }

  const subjectGroups = subjects.map(s => ({
    ...s,
    cards: cards.filter(c => c.subjectId === String(s.id)),
  }))
  const unknownCards = cards.filter(c => !subjects.find(s => String(s.id) === c.subjectId))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-title">Studiekaartjes</p>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm flex items-center gap-1">
          <Plus size={14} /> Kaartje
        </button>
      </div>

      {cards.length > 0 && (
        <button onClick={() => startPractice('all')} className="btn-ghost w-full flex items-center justify-center gap-2 text-sm">
          <RotateCcw size={14} /> Alle kaartjes oefenen ({cards.length})
        </button>
      )}

      {cards.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Maak je eerste studiekaartje aan</p>}

      {subjectGroups.filter(g => g.cards.length > 0).map(g => {
        const known = g.cards.filter(c => (c.score || 0) >= 2).length
        const pct = Math.round((known / g.cards.length) * 100)
        return (
          <div key={g.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{g.icon}</span>
                <span className="font-display font-bold text-[#EAEAEA] text-sm">{g.name}</span>
                <span className="text-xs text-[#8892A4]">{g.cards.length} kaartjes</span>
              </div>
              <button onClick={() => startPractice(String(g.id))} className="btn-accent text-xs px-3 py-1">Oefenen</button>
            </div>
            <div className="w-full bg-[#0F0F23] rounded-full h-2">
              <div className="h-2 rounded-full bg-[#E94560]" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-[#8892A4]">{pct}% geweten</p>
            <div className="space-y-1">
              {g.cards.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${(c.score || 0) >= 2 ? 'bg-green-400' : (c.score || 0) >= 1 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-[#EAEAEA] flex-1 truncate">{c.front}</span>
                  <button onClick={() => deleteCard(c.id)} className="text-[#8892A4]"><Trash2 size={11} /></button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {showModal && (
        <Modal title="Nieuw kaartje" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <textarea value={form.front} onChange={e => setForm(f => ({ ...f, front: e.target.value }))} placeholder="Voorkant (vraag)" rows={2} className="input resize-none" />
            <textarea value={form.back} onChange={e => setForm(f => ({ ...f, back: e.target.value }))} placeholder="Achterkant (antwoord)" rows={2} className="input resize-none" />
            <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))} className="input">
              <option value="">Geen vak</option>
              {subjects.map(s => <option key={s.id} value={String(s.id)}>{s.icon} {s.name}</option>)}
            </select>
            <button onClick={addCard} disabled={!form.front.trim() || !form.back.trim()} className="btn-accent w-full disabled:opacity-40">Aanmaken</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
