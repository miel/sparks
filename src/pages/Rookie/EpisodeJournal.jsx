import { useState } from 'react'
import { Quote } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { seasons, getEpisodeId } from '../../data/rookieEpisodes'
import StarRating from '../../components/StarRating'

const STATUS = { unseen: '⬜', seen: '✅', rewatch: '🔁' }
const STATUS_CYCLE = ['unseen', 'seen', 'rewatch']

export default function EpisodeJournal() {
  const [statuses, setStatuses] = useLocalStorage('rookie_episodes', {})
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [expanded, setExpanded] = useState(null)
  const [view, setView] = useState('episodes') // episodes | quotes | best

  const season = seasons.find(s => s.season === selectedSeason)

  function getEp(s, e) {
    return statuses[getEpisodeId(s, e)] || { status: 'unseen', rating: 0, note: '', quote: '' }
  }

  function updateEp(s, e, updates) {
    const id = getEpisodeId(s, e)
    setStatuses(prev => ({ ...prev, [id]: { ...getEp(s, e), ...updates } }))
  }

  function cycleStatus(s, e) {
    const ep = getEp(s, e)
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(ep.status) + 1) % STATUS_CYCLE.length]
    updateEp(s, e, { status: next })
  }

  const allQuotes = seasons.flatMap(s =>
    Array.from({ length: s.episodes }, (_, i) => {
      const ep = getEp(s.season, i + 1)
      return ep.quote ? { season: s.season, episode: i + 1, quote: ep.quote } : null
    }).filter(Boolean)
  )

  const bestEpisodes = seasons.flatMap(s =>
    Array.from({ length: s.episodes }, (_, i) => {
      const ep = getEp(s.season, i + 1)
      return ep.rating === 5 ? { season: s.season, episode: i + 1, ...ep } : null
    }).filter(Boolean)
  )

  if (view === 'quotes') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-title">Quotewall 💬</p>
          <button onClick={() => setView('episodes')} className="text-sm text-[#8892A4]">← Terug</button>
        </div>
        {allQuotes.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Nog geen quotes opgeslagen</p>}
        {allQuotes.map((q, i) => (
          <div key={i} className="card border border-[#E94560]/20">
            <div className="flex gap-2">
              <Quote size={16} className="text-[#E94560] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#EAEAEA] italic text-sm">"{q.quote}"</p>
                <p className="text-xs text-[#8892A4] mt-1">S{q.season}E{q.episode}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (view === 'best') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-title">Beste afleveringen ⭐⭐⭐⭐⭐</p>
          <button onClick={() => setView('episodes')} className="text-sm text-[#8892A4]">← Terug</button>
        </div>
        {bestEpisodes.length === 0 && <p className="text-[#8892A4] text-sm text-center py-8">Nog geen 5-sterren afleveringen</p>}
        {bestEpisodes.map((ep, i) => (
          <div key={i} className="card">
            <p className="font-semibold text-[#EAEAEA]">S{ep.season}E{ep.episode}</p>
            {ep.note && <p className="text-sm text-[#8892A4] mt-1">{ep.note}</p>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setView('quotes')} className="btn-ghost text-xs flex-1">💬 Quotes</button>
        <button onClick={() => setView('best')} className="btn-ghost text-xs flex-1">⭐ Beste</button>
      </div>

      {/* Seizoen selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {seasons.map(s => (
          <button key={s.season} onClick={() => setSelectedSeason(s.season)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${selectedSeason === s.season ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#8892A4]'}`}>
            Seizoen {s.season}
          </button>
        ))}
      </div>

      {/* Afleveringen */}
      <div className="space-y-2">
        {Array.from({ length: season.episodes }, (_, i) => {
          const ep = getEp(selectedSeason, i + 1)
          const isExpanded = expanded === `${selectedSeason}-${i + 1}`
          return (
            <div key={i} className="card space-y-2">
              <div className="flex items-center gap-3">
                <button onClick={() => cycleStatus(selectedSeason, i + 1)} className="text-lg w-6">
                  {STATUS[ep.status]}
                </button>
                <span className="text-sm font-semibold text-[#EAEAEA] flex-1">Aflevering {i + 1}</span>
                <StarRating value={ep.rating} onChange={v => updateEp(selectedSeason, i + 1, { rating: v })} />
                <button onClick={() => setExpanded(isExpanded ? null : `${selectedSeason}-${i + 1}`)}
                  className="text-[#8892A4] text-xs">{isExpanded ? '▲' : '▼'}</button>
              </div>
              {isExpanded && (
                <div className="space-y-2 border-t border-white/10 pt-2">
                  <textarea
                    value={ep.note}
                    onChange={e => updateEp(selectedSeason, i + 1, { note: e.target.value })}
                    placeholder="Notitie..."
                    rows={2}
                    className="input text-sm resize-none"
                  />
                  <input
                    value={ep.quote}
                    onChange={e => updateEp(selectedSeason, i + 1, { quote: e.target.value })}
                    placeholder="Favoriete quote..."
                    className="input text-sm"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
