# De Slimme Invorderaar

Een kosten-baten analyse tool voor kleine schulden, gebaseerd op het IBO-rapport "De maatschappelijke kosten van schuldenproblematiek".

## 🌐 Live Demo

**Statische demo:** https://statendaal.github.io/5euro/

De statische demo bevat 10 vooraf berekende simulatie scenarios die direct tonen wanneer invordering niet zinvol is vanwege hoge kosten.

## ✨ Features

### Simulatie Scenarios
- **Kwetsbare Burgers** - Bijstand, WW-uitkering, schuldhulp
- **Financieel Worstelen** - Parttime werk, modaal inkomen, ZZP'er  
- **Werkend - Stabiel** - Fulltime werk, vergeten betalingen
- **Stabiel - Klein Verzuim** - Hoog inkomen, administratieve fouten

### Kosten-Baten Analyse
Voor elk scenario berekent de tool:
- **Directe invoerkosten** - Aanmaning, dagvaarding, incasso, deurwaarder
- **Slagingskans** - Op basis van burger profiel
- **Maatschappelijke kosten** - Gezondheidszorg, werkgelegenheid, schuldhulp, huiselijk geweld, juridisch
- **Risico score** - 0-100 schaal voor escalatie kans
- **Aanbeveling** - Kwijtschelden, betalingsregeling, consolideren, doorverwijzen

### Impact Visualisatie
- Totale besparing per scenario
- Aantal kwijtgescholden schulden
- Maatschappelijke impact voorkomen
- Vergelijking traditionele vs slimme invordering

## 🏗️ Architectuur

### Frontend
- **React 18** met TypeScript
- **Vite** voor snelle development
- **Tailwind CSS** voor styling
- **Recharts** voor visualisaties
- **Lucide React** voor iconen

### Backend (optioneel voor locale development)
- **Node.js** met Express
- **TypeScript**
- Cost calculation engine
- Mock data generator

## 🚀 Locale Development

### Installatie
```bash
# Frontend
cd smart-collection-demo/frontend
npm install
npm run dev

# Backend (optioneel)
cd smart-collection-demo/backend  
npm install
npm run dev
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📊 Voorbeeldresultaten

### Scenario: Alleenstaande Ouder - Bijstand
- **Schuld:** €15
- **Invoerkosten:** €660 (44x de schuld!)
- **Risico score:** 85/100
- **Maatschappelijke kosten:** €13,061 bij doorinnen
- **Aanbeveling:** Kwijtschelden (kost €5)
- **Totale besparing:** €13,716

### Scenario: In Schuldhulpverlening  
- **Schuld:** €8
- **Invoerkosten:** €660 (82x de schuld!)
- **Risico score:** 95/100
- **Maatschappelijke kosten:** €15,551 bij doorinnen
- **Aanbeveling:** Kwijtschelden (kost €5)
- **Totale besparing:** €16,206

## 📚 Bronnen

Gebaseerd op:
- **IBO-rapport** "De maatschappelijke kosten van schuldenproblematiek" (2024)
- **PowerPoint** "Kleine schulden problematiek - 5 euro klanten"

### Kernbevindingen IBO
- Minimaal **€8,5 miljard** maatschappelijke kosten per jaar
- **43 kostencategorieën** over 7 hoofddomeinen
- Werkelijke kosten waarschijnlijk veel hoger
- Uitvoeringskosten (€826M) > Inbare schulden (€590M)

## 🎯 Use Cases

1. **Beleidsmakers** - Inzicht in maatschappelijke impact van invordering
2. **Invorderaars** - Beslisondersteuning voor kwijtschelding
3. **Gemeentes** - Optimalisatie van schuldhulpverlening
4. **Onderzoek** - Demonstratie van kosten-baten analyse

## 📄 Licentie

Demo applicatie voor onderzoeks- en beleidsdoeleinden.

## 🔗 Links

- **GitHub Repository:** https://github.com/Statendaal/5euro
- **Live Demo:** https://statendaal.github.io/5euro/
