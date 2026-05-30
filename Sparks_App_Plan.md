# ✨ Sparks — Functioneel & Technisch Plan
**Persoonlijke PWA App · Versie 1.0 · Mei 2025**

---

## 1. Inleiding & Doelstelling

Sparks is een Progressive Web App (PWA) speciaal ontwikkeld voor een creatieve, sportieve 14-jarige. De app combineert vijf domeinen die aansluiten bij haar interesses: dagelijkse inspiratie, kunst & knutselen, hockey, The Rookie en school. De app wordt gehost op GitHub Pages en is installeerbaar als homescreen-app op haar iPhone — zonder App Store en zonder sideloading.

**Kernprincipes:**

- Volledig client-side: geen backend, geen server, geen login
- Alle data opgeslagen in `localStorage` van de browser
- Installeerbaar als PWA via Safari ("Zet op beginscherm")
- Offline bruikbaar na eerste laadbeurt (Service Worker)
- Gratis hosting via GitHub Pages

---

## 2. Functioneel Plan

### 2.1 Navigatiestructuur

De app heeft een vaste navigatiebalk onderaan met vijf tabs. Elke tab is een zelfstandige sectie met eigen sub-navigatie en datastores.

| Tab | Beschrijving |
|---|---|
| ✨ Spark | Dagelijkse startpagina met inspiratie en snelle notitie |
| 🎨 Create | Digitaal sketchbook + craft project tracker |
| 🏑 Hockey | Statistieken per wedstrijd + drill bibliotheek |
| 📺 Rookie | Episode journal + theory board |
| 📚 School | Leerplanner + studiekaartjes |

---

### 2.2 Tab: ✨ Spark

De thuispagina van de app. Wordt elke dag automatisch gevuld met één willekeurige uitdaging uit een van de drie domeinen. Dit is de tab die ze als eerste ziet.

#### Daily Spark

- Elke dag één gegenereerde uitdaging op basis van datum-hash
- Drie categorieën met eigen icoon en kleur:
  - 🎨 Tekenprompt — bijv. "Teken iets dat begint met de letter van vandaag"
  - 🏑 Hockey drill — bijv. "Oefen 5 minuten backhands tegen de muur"
  - ✂️ Knutselidee — bijv. "Maak iets van een lege wc-rol"
- "Spark voltooid" knop met confetti-animatie
- Streak-teller: hoeveel dagen op rij de app geopend

#### Snelle notitie

- Eén groot tekstveld, auto-saved in localStorage
- Tijdstempel per notitie
- Laatste 5 notities zichtbaar als mini-feed

---

### 2.3 Tab: 🎨 Create

Twee sub-tabs: Sketchbook voor digitaal tekenen, en Craft Projects voor knutselprojecten beheren.

#### Sub-tab: Sketchbook

- Canvas tekenoppervlak (HTML5 Canvas API)
- Penseelopties: ronde pen, marker, watercolor-achtig effect
- Kleurenpalet: 20 kleuren + custom kleurkiezer
- Penseeldikte instelbaar via slider
- Gum-tool
- Undo/redo (tot 20 stappen)
- Opslaan als PNG naar galerij (base64 in localStorage)
- Galerij: raster van miniaturen, tap om groot te openen of te verwijderen
- Maximaal 30 opgeslagen tekeningen (FIFO bij overschrijding)

#### Sub-tab: Craft Projects

- Project aanmaken: naam, beschrijving, moeilijkheidsgraad (1–5 sterren)
- Foto toevoegen (via camera of fotoalbum, base64-opslag)
- Materiaallijst: items toevoegen/verwijderen/afvinken
- Voortgangsstatus: Idee → Bezig → Klaar
- Notitieveld per project
- Sorteren op status of datum
- Inspiratiebord: losse afbeeldingen pinnen zonder project

---

### 2.4 Tab: 🏑 Hockey

Twee sub-tabs: persoonlijke wedstrijdstatistieken en een drill bibliotheek.

#### Sub-tab: Stats

- Wedstrijd toevoegen: datum, tegenstander, uitslag (thuis/uit), eigen doelpunten, assists, positie
- Vrij notitieveld per wedstrijd (bijv. "Eerste goal van het seizoen!")
- Seizoensoverzicht dashboard:
  - Totaal gespeeld, gewonnen, verloren, gelijk
  - Totaal doelpunten en assists
  - Persoonlijk doel instellen (bijv. "10 doelpunten") met progress bar
- Lijst van wedstrijden chronologisch, tap om detail te zien of te bewerken

#### Sub-tab: Drills

- Drill bibliotheek met 20 vooringestelde oefeningen
- Categorieën: Aanval · Verdediging · Conditie · Stick Skills · Keeper
- Per drill: naam, beschrijving, duur, niveau (beginner/gevorderd)
- Eigen drills toevoegen
- Favorieten markeren met ster
- Filter op categorie
- "Drill van de dag" knop die willekeurig een favoriet selecteert

---

### 2.5 Tab: 📺 Rookie

Twee sub-tabs: een episode journal om afleveringen bij te houden, en een theory board voor verhaallijnen en karakterverbanden.

#### Sub-tab: Episode Journal

- Seizoen selecteren (1–6, uitbreidbaar)
- Lijst van afleveringen per seizoen
- Per aflevering bijhouden:
  - Gezien / Niet gezien / Rewatch
  - Beoordeling 1–5 sterren
  - Vrije notitie
  - Favoriete quote opslaan
- "Beste afleveringen" overzicht (alles met 5 sterren)
- Quotewall: alle opgeslagen quotes op één pagina

#### Sub-tab: Theory Board

- Kaartjes aanmaken: titel + beschrijving + tag (Nolan, Lucy, Tim, etc.)
- Status per kaartje: Theorie · Bevestigd · Weerlegd
- Filter op karaktertag of status
- Kaartjes in raster weergegeven, tap om te bewerken
- Tijdlijn-weergave: theorieën gerangschikt op datum aangemaakt

---

### 2.6 Tab: 📚 School

Twee sub-tabs: een zelfgestuurde leerplanner passend bij het Montessori-karakter van haar school, en een studiekaartjes-systeem.

#### Sub-tab: Leerplanner

- Vakken aanmaken (bijv. Nederlands, Wiskunde, Frans, Biologie)
- Per vak: kleur en icoon kiezen
- Doelen stellen per vak: vrij tekstveld + zelf-gerapporteerde voortgang (0–100%)
- Voortgang visueel als kleurenbalk per vak
- "Trots op"-logboek: korte dagboekinvoer wat goed ging
- Terugblik: alle trots-notities chronologisch
- Weekplanner: per dag taken/doelen inplannen (eenvoudige checklist)

#### Sub-tab: Studiekaartjes

- Kaartjes aanmaken: voorkant (vraag) + achterkant (antwoord)
- Stapels per vak
- Oefenmodus: kaart omdraaien met tap/klik
- Beoordeling per kaartje: Wist het ✓ · Bijna · Nog niet
- Simpele spaced repetition: kaartjes met "Nog niet" vaker tonen
- Voortgangsindicator per stapel: % geweten

---

## 3. Technisch Plan

### 3.1 Architectuuroverzicht

De app is volledig statisch en client-side. Er is geen backend, geen database, geen API-server en geen authenticatie. Alle persistentie gaat via de Web Storage API (`localStorage`) van de browser. De app wordt gebuild tot een map met statische bestanden die direct op GitHub Pages worden gehost.

```
Browser (Safari iPhone)  →  GitHub Pages (statische bestanden)  →  localStorage (data)
```

> Geen server nodig. Geen database. Geen login. Volledig offline na eerste load.

---

### 3.2 Technische Stack

| Onderdeel | Keuze & Reden |
|---|---|
| Framework | React 18 via Vite — snel builden, kleine output, breed supported |
| Styling | Tailwind CSS — utility-first, geen aparte CSS-bestanden, kleine bundle |
| Icons | Lucide React — lichtgewicht, consistent, tree-shakeable |
| Canvas | Native HTML5 Canvas API — geen extra dependency voor tekenen |
| Animaties | CSS transitions + Framer Motion voor kaartomdraaien etc. |
| PWA | vite-plugin-pwa — genereert manifest + service worker automatisch |
| Routing | React Router v6 (hash-based) — werkt zonder server, ook op GitHub Pages |
| State | React `useState` + `useReducer` per sectie (geen Redux nodig) |
| Persistentie | `localStorage` via custom `useLocalStorage` hook |
| Build tool | Vite — snel, moderne output (ES modules), eenvoudige config |
| Deployment | GitHub Pages — gratis, statisch, custom domein mogelijk |

---

### 3.3 PWA-configuratie

Een PWA vereist twee extra bestanden bovenop de normale webapplicatie: een Web App Manifest en een Service Worker. De Vite PWA plugin genereert beide automatisch.

#### Web App Manifest

Het manifest zorgt ervoor dat Safari de app herkent als installeerbaar:

```json
{
  "name": "Sparks",
  "short_name": "Sparks",
  "start_url": "/sparks/",
  "display": "standalone",
  "background_color": "#1A1A2E",
  "theme_color": "#E94560",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

#### Service Worker

- Gegenereerd door `vite-plugin-pwa` met Workbox
- Strategie: Cache First voor alle statische assets
- Bij eerste load: alle app-bestanden gecached
- Na installatie: app werkt volledig offline
- Update-strategie: bij nieuwe versie melding tonen met "Vernieuwen" knop

> **⚠️ Safari-beperking:** iOS Safari heeft geen automatische installatieprompt (zoals Android). De gebruiker moet zelf via het "Deel"-menu kiezen voor "Zet op beginscherm". Oplossing: bij eerste bezoek een instructiebanner tonen met stap-voor-stap uitleg.

---

### 3.4 Datamodel & localStorage

Alle data wordt opgeslagen in `localStorage` als JSON-strings. Per domein een aparte sleutel, geïsoleerd en makkelijk te debuggen.

| localStorage sleutel | Datatype | Omschrijving |
|---|---|---|
| `sparks_notes` | `Note[]` | Snelle notities met timestamp |
| `sparks_streak` | `{ count, lastDate }` | Streak-teller |
| `sparks_spark_done` | `{ date, done }` | Dagelijkse spark voltooid |
| `create_sketches` | `Sketch[]` | Base64 PNG + datum + titel |
| `create_projects` | `Project[]` | Craft projecten + materialen |
| `create_inspiration` | `Image[]` | Losse inspiratieafbeeldingen |
| `hockey_matches` | `Match[]` | Wedstrijden met stats |
| `hockey_goal` | `{ target, season }` | Seizoensdoel |
| `hockey_drills` | `Drill[]` | Custom drills + favorieten |
| `rookie_episodes` | `EpStatus[]` | Status per aflevering |
| `rookie_theories` | `Theory[]` | Kaartjes op theory board |
| `school_subjects` | `Subject[]` | Vakken + kleur + icoon |
| `school_goals` | `Goal[]` | Doelen per vak |
| `school_proud` | `Proud[]` | Trots-logboek entries |
| `school_flashcards` | `Card[]` | Studiekaartjes + SRS-data |
| `school_weekplan` | `WeekTask[]` | Weekplanner taken |

> **Opslaglimiet:** Safari staat maximaal ~5MB localStorage toe. Schetsen (base64 PNG) zijn de grootste data; bij 30 schetsen van gemiddeld 100KB ≈ 3MB. Dit valt ruim binnen de limiet.

---

### 3.5 Projectstructuur

```
sparks/
├── public/
│   ├── icons/              # PWA-iconen (192px en 512px)
│   └── favicon.ico
├── src/
│   ├── main.jsx            # App entry point
│   ├── App.jsx             # Router + TabBar
│   ├── components/         # Gedeelde componenten
│   │   ├── TabBar.jsx
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   └── StarRating.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js   # Generieke localStorage hook
│   │   └── useStreak.js
│   ├── pages/
│   │   ├── Spark/          # ✨ Spark pagina
│   │   ├── Create/         # 🎨 Sketchbook + Crafts
│   │   ├── Hockey/         # 🏑 Stats + Drills
│   │   ├── Rookie/         # 📺 Journal + Theories
│   │   └── School/         # 📚 Planner + Flashcards
│   ├── data/
│   │   ├── sparkPrompts.js      # Vaste lijst van spark-prompts
│   │   ├── rookieEpisodes.js    # Seizoenen + afleveringen
│   │   └── defaultDrills.js    # Vooringestelde hockey drills
│   └── styles/
│       └── index.css            # Tailwind imports + custom vars
├── vite.config.js
├── tailwind.config.js
└── package.json
```

Na buildstap genereert Vite een `dist/`-map met uitsluitend statische bestanden. Deze map wordt gepubliceerd via GitHub Pages.

---

### 3.6 GitHub Pages Deployment

#### Setup stap voor stap

1. Repository aanmaken op GitHub (bijv. `gebruikersnaam/sparks`)
2. Vite-project initialiseren: `npm create vite@latest sparks -- --template react`
3. `vite.config.js` aanpassen: `base` instellen op `"/sparks/"` (subdirectory op GitHub Pages)
4. Routing: gebruik **hash-based routing** (`/#/hockey`) — werkt zonder server-side redirects
5. GitHub Actions workflow toevoegen (zie hieronder)
6. Repository Settings → Pages → Source: **GitHub Actions**
7. Bij elke `git push` naar `main` automatisch gebuild en gedeployed

#### GitHub Actions workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Sparks

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

Resultaat: de app is bereikbaar op `https://[gebruikersnaam].github.io/sparks/` — volledig gratis, geen server nodig.

---

### 3.7 Beperkingen & Aandachtspunten

| Beperking | Oplossing / Workaround |
|---|---|
| Safari heeft geen install-prompt | Instructiebanner tonen bij eerste bezoek met uitleg voor "Zet op beginscherm" |
| localStorage max ~5MB in Safari | Schetsen beperken tot max 30 stuks; comprimeren bij opslaan |
| Geen cloud sync | Data blijft op apparaat; backup via "Exporteer alles" knop (JSON-download) |
| Geen push notifications in Safari PWA | Streak-reminder werkt alleen als app geopend wordt; geen background notifications |
| GitHub Pages alleen HTTPS | Vereist voor Service Worker — is een voordeel, geen probleem |
| Vite `base`-pad configuratie | Moet exact overeenkomen met GitHub repo-naam; fout hierin breekt de app |

---

## 4. Bouwaanpak & Fasering

| Fase | Inhoud |
|---|---|
| **Fase 1 — Fundament** | Vite + React setup, Tailwind, PWA-manifest, Service Worker, GitHub Actions workflow, TabBar navigatie, `useLocalStorage` hook |
| **Fase 2 — Spark & Create** | ✨ Daily Spark met prompts en streak, snelle notitie, 🎨 Sketchbook canvas + galerij, Craft Projects beheer |
| **Fase 3 — Hockey & Rookie** | 🏑 Wedstrijdstatistieken + seizoensdoel + drill bibliotheek, 📺 Episode journal + quotewall + theory board |
| **Fase 4 — School** | 📚 Vakken + doelen + voortgangsbalk, trots-logboek, weekplanner, studiekaartjes met oefenmodus en SRS-logica |
| **Fase 5 — Afwerking** | Design polish, animaties, iOS-instructiebanner, export/backup functie, edge cases, performance optimalisatie |

---

## 5. Visueel Ontwerp

| Design element | Keuze |
|---|---|
| Primaire kleur | `#E94560` — levendig rood-roze als accentkleur |
| Achtergrond | `#1A1A2E` — donkerblauw als basis (dark mode by default) |
| Secundaire kleur | `#16213E` — iets lichter blauw voor kaarten en secties |
| Tekstkleur | `#EAEAEA` — bijna-wit voor leesbaarheid op donkere achtergrond |
| Lettertypes | Display: Nunito (rond, vriendelijk) · Body: Inter (leesbaar) |
| Iconen | Lucide React — lijnstijl, consistent gewicht |
| Afgeronde hoeken | `border-radius` 12–20px — zacht en modern |
| Animaties | Confetti bij spark-voltooiing, kaartomdraaien bij flashcards, subtiele tab-transities |
| Tab-indicator | Actieve tab: gekleurde dot + icoon in accentkleur |

---

*Sparks — gebouwd met ❤️ als verrassing*
