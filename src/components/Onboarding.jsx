import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'

const slides = [
  {
    emoji: '✨',
    bg: 'from-[#E94560]/20 to-transparent',
    title: 'Hé Isabel! Welkom bij Sparks ✨',
    text: 'Dit is jouw eigen persoonlijke app — speciaal voor jou gemaakt. Hier vind je dagelijkse inspiratie, een plek om te tekenen, bij te houden hoe het gaat met hockey, The Rookie te volgen en je school te plannen.',
  },
  {
    emoji: '✨',
    bg: 'from-[#FFD700]/20 to-transparent',
    title: 'Dagelijkse Spark',
    text: 'Elke dag krijg je een nieuwe uitdaging: een tekenprompt, een hockey-oefening of een knutselidee. Voltooi hem en bouw een streak op! Hoe langer de reeks, hoe groter het vuur 🔥',
  },
  {
    emoji: '🎨',
    bg: 'from-[#C77DFF]/20 to-transparent',
    title: 'Create — Sketchbook & Projecten',
    text: 'Teken direct op je scherm met penselen, kleuren en gum. Sla je tekeningen op in je eigen galerij. Of houd je knutselprojecten bij: van idee tot klaar, met materiaallijst en foto.',
  },
  {
    emoji: '🏑',
    bg: 'from-[#6BCB77]/20 to-transparent',
    title: 'Hockey — Stats & Drills',
    text: 'Houd elke wedstrijd bij met score, doelpunten en assists. Stel een seizoensdoel in en zie hoe je vordert. In de drill-bibliotheek staan 20 oefeningen — of voeg je eigen toe en markeer favorieten.',
  },
  {
    emoji: '📺',
    bg: 'from-[#4D96FF]/20 to-transparent',
    title: 'The Rookie — Journal & Theories',
    text: 'Markeer afleveringen als gezien, geef ze een beoordeling en sla je favoriete quotes op. Op het theory board kun je je eigen theorieën bijhouden — en later zien of ze uitkwamen!',
  },
  {
    emoji: '📚',
    bg: 'from-[#FF9A3C]/20 to-transparent',
    title: 'School — Planner & Studiekaartjes',
    text: 'Voeg je vakken toe, stel doelen en houd je voortgang bij. Schrijf op waar je trots op bent. Plan je week. En oefen met studiekaartjes — de app onthoudt welke je nog moeilijk vindt.',
  },
  {
    emoji: '🚀',
    bg: 'from-[#E94560]/20 to-transparent',
    title: 'Alles staat klaar voor jou!',
    text: 'Jouw Sparks-app werkt ook zonder internet, onthoudt alles op jouw telefoon en heeft geen wachtwoord nodig. Zet hem op je beginscherm voor de beste ervaring. Veel plezier, Isabel! 💖',
    isLast: true,
  },
]

export default function Onboarding({ onComplete }) {
  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStart = useRef(null)

  const slide = slides[idx]

  function next() {
    if (idx === slides.length - 1) {
      onComplete()
      return
    }
    setDirection(1)
    setIdx(i => i + 1)
  }

  function prev() {
    if (idx === 0) return
    setDirection(-1)
    setIdx(i => i - 1)
  }

  function skip() {
    onComplete()
  }

  function onTouchStart(e) {
    touchStart.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    touchStart.current = null
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#1A1A2E] flex flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Skip knop */}
      {!slide.isLast && (
        <button onClick={skip} className="absolute top-6 right-5 text-[#8892A4] text-sm font-medium z-10">
          Overslaan
        </button>
      )}

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-5 pt-safe"
        >
          {/* Achtergrond glow */}
          <div className={`absolute inset-0 bg-gradient-to-b ${slide.bg} pointer-events-none`} />

          {/* Emoji */}
          <div className="text-6xl drop-shadow-lg">{slide.emoji}</div>

          {/* Titel */}
          <h1 className="font-display font-extrabold text-xl text-[#EAEAEA] leading-tight relative">
            {slide.title}
          </h1>

          {/* Tekst */}
          <p className="text-[#8892A4] text-sm leading-relaxed max-w-sm relative">
            {slide.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Onderkant: dots + knop — met safe area voor home indicator */}
      <div className="px-8 pb-8 space-y-5" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom, 0px) + 16px)' }}>
        {/* Voortgangsdots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? 'w-6 h-2 bg-[#E94560]'
                  : i < idx
                  ? 'w-2 h-2 bg-[#E94560]/40'
                  : 'w-2 h-2 bg-[#16213E]'
              }`}
            />
          ))}
        </div>

        {/* Knop */}
        <button
          onClick={next}
          className="btn-accent w-full flex items-center justify-center gap-2 py-4 text-base"
        >
          {slide.isLast ? (
            <>
              <Sparkles size={18} />
              Start met Sparks!
            </>
          ) : (
            <>
              Volgende
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
