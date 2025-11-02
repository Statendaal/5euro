# Project Overzicht: Smart Collection & IBO Schuldenproblematiek

## 📁 Repository Structuur

```
svb-cak/
├── README.md                                           # Samenvatting IBO-rapport
├── ARCHITECTUUR.md                                     # Volledige platform architectuur
├── SMART-COLLECTION-APP.md                            # Smart Collection app specificatie
├── OVERZICHT.md                                       # Dit bestand
│
├── Onderzoeksrapport...pdf                            # IBO-rapport (origineel)
├── Kleine schulden problematie...pptx                 # PowerPoint "5 euro klanten"
│
└── smart-collection-demo/                             # ⭐ DEMO APPLICATIE
    ├── README.md                                      # Demo documentatie
    ├── QUICKSTART.md                                  # 3-minuten start guide
    ├── start.sh                                       # Automatisch start script
    │
    ├── backend/                                       # Node.js + Express API
    │   ├── src/
    │   │   ├── server.ts                             # API routes
    │   │   ├── calculator.ts                         # Cost calculation engine
    │   │   ├── types.ts                              # TypeScript types
    │   │   └── mockData.ts                           # 100+ test schulden
    │   ├── package.json
    │   └── tsconfig.json
    │
    └── frontend/                                      # React + TypeScript app
        ├── src/
        │   ├── components/
        │   │   ├── DebtAnalysisForm.tsx              # Schuld input formulier
        │   │   ├── AnalysisResults.tsx               # Kosten-baten resultaten
        │   │   └── Dashboard.tsx                     # Bulk analyse dashboard
        │   ├── App.tsx                               # Main app
        │   ├── api.ts                                # Backend API client
        │   └── types.ts
        ├── package.json
        └── vite.config.ts
```

---

## 🎯 Wat is Wat?

### 1. **Onderzoeksrapport** 
`Onderzoeksrapport+De+maatschappelijke+kosten+van+schuldenproblematiek.pdf`

**IBO-rapport door Panteia, Hogeschool Utrecht, Nibud**

**Kernbevindingen:**
- Maatschappelijke kosten: €8.5+ miljard per jaar
- 43 kostenposten geïdentificeerd, 19 gekwantificeerd
- Kosten verdeeld over: gezondheid, werk, onderwijs, justitie, schuldhulp

**Belangrijkste aanbevelingen:**
1. Preventie door vroegsignalering
2. Tijdige interventie
3. Integrale aanpak (multi-stakeholder)
4. Betere informatiehuishouding

### 2. **PowerPoint Presentatie**
`Kleine schulden problematie - 20251104.pptx`

**"5 Euro Klanten" Probleem**

**Kernproblemen:**
- €5 schuld escaleert naar €500+ door administratie
- Uitvoeringskosten (€826M) > Schulden (€590M)
- Geautomatiseerde processen zonder bagatelgrenzen
- Burgers raken in schuldenspiraal en verliezen vertrouwen

**Getroffen organisaties:**
- Gemeenten, CAK, SVB, DUO, CJIB, Belastingdienst, UWV, Zorgverzekeraars, etc.

### 3. **README.md** (dit directory)
Uitgebreide samenvatting van het IBO-rapport met:
- Belangrijkste bevindingen
- 7 kostendomeinen
- 5 aanbevelingen
- Methodologische beperkingen
- ROI van oplossingen

### 4. **ARCHITECTUUR.md**
Complete architectuur voor **Digitaal Schuldhulp Platform (DSP)**

**Omvang:** 1000+ regels, volledige specificatie

**Bevat:**
- High-level systeem architectuur
- 8 functionele modules (preventie, hulpverlening, case management, etc.)
- **Nieuwe module:** "5 Euro Klanten" Anti-Escalatie
  - Bagatelgrenzen
  - Kosten-baten calculator
  - Cross-organisatie overzicht
  - Smart collection per organisatie (CAK, DUO, CJIB, etc.)
  - Automatische kwijtscheldingsworkflow
- Technische stack (React, Node.js, PostgreSQL, ML/AI)
- Data modellen
- API specificaties
- Security & Privacy (AVG, BIO)
- Implementatie roadmap (3 fases, 2.5 jaar)
- ROI: €300-500M besparing/jaar

### 5. **SMART-COLLECTION-APP.md**
Specifieke app voor het "5 euro klanten" probleem

**Focus:** Beslissingsondersteunend systeem voor invorderaars

**Kernfunctionaliteit:**
- Real-time kosten-baten analyse per schuld
- Maatschappelijke impact calculator
- Automatische aanbevelingen
- Bulk analyse dashboard
- Predictive ML modellen

**Business Case:**
- Investering: €850K ontwikkeling + €200K/jaar operationeel
- Opbrengst: €97.5M/jaar bij 100 organisaties
- ROI: 210x over 5 jaar
- Break-even: Maand 2 van jaar 1

**Bevat:**
- Complete UI wireframes (ASCII art)
- API specificaties met voorbeelden
- Data modellen (TypeScript interfaces)
- ML model beschrijvingen
- Frontend component voorbeelden (React)

### 6. **smart-collection-demo/** ⭐
**Werkende demo applicatie!**

**Dit is de complete implementatie van de Smart Collection App**

**Functionaliteiten:**
- ✅ Schuld analyse tool (individueel)
- ✅ Kosten-baten berekening
- ✅ Maatschappelijke impact calculator
- ✅ Automatische aanbevelingen
- ✅ Bulk analyse dashboard (100+ schulden)
- ✅ Visualisaties met charts
- ✅ Mock data (110 test schulden)

**Tech Stack:**
- Backend: Node.js + Express + TypeScript
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Charts: Recharts
- Icons: Lucide React

**Run in 3 minuten:** Zie `smart-collection-demo/QUICKSTART.md`

---

## 🚀 Snelstart

### Documentatie Lezen
```bash
# Rapport samenvatting
open README.md

# Volledige architectuur
open ARCHITECTUUR.md

# App specificatie
open SMART-COLLECTION-APP.md
```

### Demo Draaien
```bash
cd smart-collection-demo
./start.sh
# → Open http://localhost:3000
```

Zie `smart-collection-demo/QUICKSTART.md` voor 3-minuten demo flow.

---

## 💡 Use Cases per Document

### Je wilt...

**...begrijpen wat het probleem is:**
→ Lees `README.md` (15 min)

**...het "5 euro klanten" probleem snappen:**
→ Bekijk `Kleine schulden problematie...pptx` (5 min)
→ Lees "5 Euro Klanten" sectie in `ARCHITECTUUR.md`

**...een complete oplossing ontwerpen:**
→ Lees `ARCHITECTUUR.md` (45 min)
→ Focus op modules, tech stack, roadmap

**...een specifieke app bouwen voor invorderaars:**
→ Lees `SMART-COLLECTION-APP.md` (30 min)
→ Bevat wireframes, API specs, data modellen

**...de oplossing in actie zien:**
→ Run `smart-collection-demo` (3 min opstarten + 10 min testen)
→ Bekijk code in `backend/src/calculator.ts`

**...presenteren aan stakeholders:**
→ Demo `smart-collection-demo`
→ Gebruik screenshots uit demo
→ Verwijzen naar cijfers in `README.md`

**...development starten:**
→ Start met `smart-collection-demo` als basis
→ Extend met modules uit `ARCHITECTUUR.md`
→ Volg roadmap voor fasering

---

## 📊 Key Cijfers (Quick Reference)

### Probleem Omvang
- **€8.5+ miljard** maatschappelijke kosten per jaar
- **€826 miljoen** uitvoeringskosten invordering
- **€590 miljoen** daadwerkelijke schulden
- **€5 → €500** escalatie kleine schuld

### Oplossing Impact
- **30-50%** reductie uitvoeringskosten = **€250-400M** besparing
- **1% reductie** totale kosten = **€85M** besparing
- **5% reductie** totale kosten = **€425M** besparing

### Demo Voorbeeld (€8,50 schuld)
- Traditioneel: **€660** kosten + **€20.080** maatschappelijk = **€20.740** schade
- Smart Collection: **€5** kwijtschelding = **€20.735** besparing
- **Ratio: 4.147x ROI**

### Platform ROI
- Investering: **€5-7M** ontwikkeling
- Besparing jaar 3+: **€300-500M** per jaar
- ROI: **100-200x** over 5 jaar
- Break-even: **2-3 maanden**

---

## 🎯 Volgende Stappen

### Voor Beleidsmakers
1. Lees `README.md` voor context
2. Bekijk demo voor proof-of-concept
3. Review `ARCHITECTUUR.md` voor implementatieplan
4. Besluit over pilot met 2-5 gemeenten

### Voor Developers
1. Clone en run `smart-collection-demo`
2. Bestudeer `backend/src/calculator.ts` voor logica
3. Lees `SMART-COLLECTION-APP.md` voor volledige spec
4. Extend demo met features uit `ARCHITECTUUR.md`

### Voor Invorderaars (CAK, DUO, etc.)
1. Test demo met eigen voorbeelden
2. Analyseer top verspillende schuldentypen
3. Bereken eigen business case
4. Plan pilot implementatie

### Voor Onderzoekers
1. Lees IBO-rapport PDF
2. Review berekeningen in `calculator.ts`
3. Valideer met eigen data
4. Verbeter ML modellen

---

## 📞 Contact & Feedback

Voor vragen over dit project:
- Open een issue op GitHub
- Email: [contact]

Voor vragen over het IBO-rapport:
- Zie rapport voor contactgegevens werkgroep

---

## 📄 Licentie

- **Documentatie**: Creative Commons BY 4.0
- **Code (demo)**: MIT License
- **IBO-rapport**: Copyright Panteia/Hogeschool Utrecht/Nibud

---

**Laatste update:** November 2024
**Versie:** 1.0

Dit overzicht wordt onderhouden als levend document en wordt bijgewerkt naarmate het project evolueert.
