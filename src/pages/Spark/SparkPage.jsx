import { useState, useEffect, useRef } from 'react'
import { Flame, CheckCircle2, Plus, Clock } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useStreak } from '../../hooks/useStreak'
import { getDailySpark } from '../../data/sparkPrompts'

function Confetti({ active }) {
  const colors = ['#E94560', '#FFD700', '#00C9FF', '#A8FF78', '#FF9A9E']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.5 + Math.random()}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function SparkPage() {
  const today = new Date().toISOString().split('T')[0]
  const spark = getDailySpark()
  const [sparkDone, setSparkDone] = useLocalStorage('sparks_spark_done', { date: null, done: false })
  const [notes, setNotes] = useLocalStorage('sparks_notes', [])
  const [noteText, setNoteText] = useState('')
  const [confetti, setConfetti] = useState(false)
  const { streak, checkAndUpdateStreak } = useStreak()
  const textareaRef = useRef(null)

  useEffect(() => { checkAndUpdateStreak() }, [])

  const isDone = sparkDone.date === today && sparkDone.done

  function completeSpark() {
    setSparkDone({ date: today, done: true })
    setConfetti(true)
    setTimeout(() => setConfetti(false), 2000)
  }

  function saveNote() {
    const trimmed = noteText.trim()
    if (!trimmed) return
    const newNote = { id: Date.now(), text: trimmed, date: new Date().toISOString() }
    setNotes(prev => [newNote, ...prev].slice(0, 50))
    setNoteText('')
  }

  const typeColors = { draw: 'text-purple-400', hockey: 'text-green-400', craft: 'text-yellow-400' }
  const typeBg    = { draw: 'bg-purple-400/10 border-purple-400/30', hockey: 'bg-green-400/10 border-green-400/30', craft: 'bg-yellow-400/10 border-yellow-400/30' }

  function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <Confetti active={confetti} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#EAEAEA]">Goedemorgen ✨</h1>
          <p className="text-[#8892A4] text-sm">{new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#E94560]/15 border border-[#E94560]/30 rounded-xl px-3 py-2">
          <Flame size={16} className="text-[#E94560]" />
          <span className="font-display font-bold text-[#E94560] text-sm">{streak.count}</span>
        </div>
      </div>

      {/* Daily Spark */}
      <div className={`card border ${typeBg[spark.type]} space-y-3`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Spark van vandaag</p>
        <p className="text-4xl">{spark.emoji}</p>
        <p className="font-display font-bold text-xl text-[#EAEAEA] leading-snug">{spark.text}</p>

        {isDone ? (
          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <CheckCircle2 size={20} />
            <span>Spark voltooid! Goed gedaan 🎉</span>
          </div>
        ) : (
          <button onClick={completeSpark} className="btn-accent w-full">
            Spark voltooid ✓
          </button>
        )}
      </div>

      {/* Snelle notitie */}
      <div className="card space-y-3">
        <p className="section-title">Snelle notitie</p>
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Schrijf hier snel iets op..."
          rows={3}
          className="input resize-none"
        />
        <button onClick={saveNote} disabled={!noteText.trim()} className="btn-accent flex items-center gap-2 disabled:opacity-40">
          <Plus size={16} />
          Opslaan
        </button>
      </div>

      {/* Recente notities */}
      {notes.length > 0 && (
        <div className="space-y-2">
          <p className="section-title">Recente notities</p>
          {notes.slice(0, 5).map(note => (
            <div key={note.id} className="card space-y-1">
              <p className="text-[#EAEAEA] text-sm leading-relaxed">{note.text}</p>
              <p className="text-[#8892A4] text-xs flex items-center gap-1">
                <Clock size={11} />
                {formatDate(note.date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
