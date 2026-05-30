import { useState, useRef, useEffect } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'

const slides = [
  {
    emoji: '✨',
    bg: '#E94560',
    title: 'Hé Isabel! Welkom bij Sparks ✨',
    text: 'Dit is jouw eigen persoonlijke app — speciaal voor jou gemaakt. Hier vind je dagelijkse inspiratie, een plek om te tekenen, bij te houden hoe het gaat met hockey, The Rookie te volgen en je school te plannen.',
  },
  {
    emoji: '✨',
    bg: '#FFD700',
    title: 'Dagelijkse Spark',
    text: 'Elke dag krijg je een nieuwe uitdaging: een tekenprompt, een hockey-oefening of een knutselidee. Voltooi hem en bouw een streak op! Hoe langer de reeks, hoe groter het vuur 🔥',
  },
  {
    emoji: '🎨',
    bg: '#C77DFF',
    title: 'Create — Sketchbook & Projecten',
    text: 'Teken direct op je scherm met penselen, kleuren en gum. Sla je tekeningen op in je eigen galerij. Of houd je knutselprojecten bij: van idee tot klaar, met materiaallijst en foto.',
  },
  {
    emoji: '🏑',
    bg: '#6BCB77',
    title: 'Hockey — Stats & Drills',
    text: 'Houd elke wedstrijd bij met score, doelpunten en assists. Stel een seizoensdoel in en zie hoe je vordert. In de drill-bibliotheek staan 20 oefeningen — of voeg je eigen toe en markeer favorieten.',
  },
  {
    emoji: '📺',
    bg: '#4D96FF',
    title: 'The Rookie — Journal & Theories',
    text: 'Markeer afleveringen als gezien, geef ze een beoordeling en sla je favoriete quotes op. Op het theory board kun je je eigen theorieën bijhouden — en later zien of ze uitkwamen!',
  },
  {
    emoji: '📚',
    bg: '#FF9A3C',
    title: 'School — Planner & Studiekaartjes',
    text: 'Voeg je vakken toe, stel doelen en houd je voortgang bij. Schrijf op waar je trots op bent. Plan je week. En oefen met studiekaartjes — de app onthoudt welke je nog moeilijk vindt.',
  },
  {
    emoji: '🚀',
    bg: '#E94560',
    title: 'Alles staat klaar voor jou!',
    text: 'Jouw Sparks-app werkt ook zonder internet, onthoudt alles op jouw telefoon en heeft geen wachtwoord nodig. Zet hem op je beginscherm voor de beste ervaring. Veel plezier, Isabel! 💖',
    isLast: true,
  },
]

export default function Onboarding({ onComplete }) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const touchStart = useRef(null)

  const slide = slides[idx]

  function goTo(next) {
    setVisible(false)
    setTimeout(() => {
      setIdx(next)
      setVisible(true)
    }, 180)
  }

  function next() {
    if (idx === slides.length - 1) { onComplete(); return }
    goTo(idx + 1)
  }

  function prev() {
    if (idx === 0) return
    goTo(idx - 1)
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
    <div
      className="fixed inset-0 z-[200] bg-[#1A1A2E] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Overslaan */}
      {!slide.isLast && (
        <button
          onClick={onComplete}
          className="self-end px-5 pt-4 pb-2 text-[#8892A4] text-sm font-medium"
        >
          Overslaan
        </button>
      )}

      {/* Slide-inhoud */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.18s ease',
        }}
      >
        {/* Achtergrond glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${slide.bg}28 0%, transparent 70%)`,
          }}
        />

        <div className="text-6xl">{slide.emoji}</div>

        <h1 className="font-display font-extrabold text-xl text-[#EAEAEA] leading-tight relative">
          {slide.title}
        </h1>

        <p className="text-[#8892A4] text-sm leading-relaxed max-w-sm relative">
          {slide.text}
        </p>
      </div>

      {/* Onderkant */}
      <div className="px-8 space-y-5 pb-10">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                background: i === idx ? '#E94560' : i < idx ? '#E9456066' : '#16213E',
              }}
            />
          ))}
        </div>

        {/* Knop */}
        <button
          onClick={next}
          className="btn-accent w-full flex items-center justify-center gap-2 py-4 text-base"
        >
          {slide.isLast ? (
            <><Sparkles size={18} /> Start met Sparks!</>
          ) : (
            <>Volgende <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  )
}
