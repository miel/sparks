export const sparkPrompts = [
  // 🎨 Tekenprompts
  { type: 'draw', emoji: '🎨', text: 'Teken iets dat begint met de eerste letter van vandaag' },
  { type: 'draw', emoji: '🎨', text: 'Teken je favoriete plek ter wereld' },
  { type: 'draw', emoji: '🎨', text: 'Teken een dier dat er nooit heeft bestaan' },
  { type: 'draw', emoji: '🎨', text: 'Teken hoe je je nu voelt in een kleur of vorm' },
  { type: 'draw', emoji: '🎨', text: 'Teken iets dat je blij maakt zonder woorden' },
  { type: 'draw', emoji: '🎨', text: 'Teken een droomkamer' },
  { type: 'draw', emoji: '🎨', text: 'Teken een personage uit een boek of serie dat je kent' },
  { type: 'draw', emoji: '🎨', text: 'Teken iets dat je vandaag hebt gegeten' },
  { type: 'draw', emoji: '🎨', text: 'Teken een bloem die bestaat uit geometrische vormen' },
  { type: 'draw', emoji: '🎨', text: 'Teken een zonsondergang op een vreemde planeet' },
  { type: 'draw', emoji: '🎨', text: 'Teken iets kleins dat je om je heen ziet, maar dan heel groot' },
  { type: 'draw', emoji: '🎨', text: 'Teken een kat die iets doet dat katten normaal niet doen' },
  { type: 'draw', emoji: '🎨', text: 'Teken je ideale hockeyschoenen' },
  { type: 'draw', emoji: '🎨', text: 'Teken een portret van iemand die je dierbaar is' },
  { type: 'draw', emoji: '🎨', text: 'Teken iets wat je graag zou willen leren' },

  // 🏑 Hockey drills
  { type: 'hockey', emoji: '🏑', text: 'Oefen 5 minuten backhands tegen de muur' },
  { type: 'hockey', emoji: '🏑', text: 'Doe 20 push-ups en 20 squats voor kracht' },
  { type: 'hockey', emoji: '🏑', text: 'Oefen slalomren tussen 5 willekeurige punten in de tuin' },
  { type: 'hockey', emoji: '🏑', text: 'Doe 3 minuten stickhandling met één hand' },
  { type: 'hockey', emoji: '🏑', text: 'Visualiseer een wedstrijdsituatie en bedenk 3 opties' },
  { type: 'hockey', emoji: '🏑', text: 'Oefen je vrije slag 10 keer op een doel (of muur)' },
  { type: 'hockey', emoji: '🏑', text: 'Doe een 5-minuten warming-up routine zelf bedenken' },
  { type: 'hockey', emoji: '🏑', text: 'Schrijf 3 dingen op die je in de vorige wedstrijd goed deed' },
  { type: 'hockey', emoji: '🏑', text: 'Oefen pasnauwkeurigheid: raak 10 keer een klein doel' },
  { type: 'hockey', emoji: '🏑', text: 'Doe 2 minuten touwtjespringen voor conditie' },

  // ✂️ Knutselideeën
  { type: 'craft', emoji: '✂️', text: 'Maak iets van een lege wc-rol' },
  { type: 'craft', emoji: '✂️', text: 'Versier een oud notitieboekje met washi tape of stickers' },
  { type: 'craft', emoji: '✂️', text: 'Maak een miniboekenlegger van karton' },
  { type: 'craft', emoji: '✂️', text: 'Vouw een origami hart of vogel' },
  { type: 'craft', emoji: '✂️', text: 'Maak een mood board van tijdschrift-uitsnijdsels' },
  { type: 'craft', emoji: '✂️', text: 'Maak een klein cadeautje voor iemand thuis' },
  { type: 'craft', emoji: '✂️', text: 'Versier een steen met verf of stiften' },
  { type: 'craft', emoji: '✂️', text: 'Maak een sleutelhanger van draad of touw' },
  { type: 'craft', emoji: '✂️', text: 'Maak een mini-plant-label voor een kamer- of tuinplant' },
  { type: 'craft', emoji: '✂️', text: 'Maak een foto-collage op papier van jouw favoriete herinneringen' },
]

export function getDailySpark(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0]
  let hash = 0
  for (const ch of dateStr) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return sparkPrompts[Math.abs(hash) % sparkPrompts.length]
}
