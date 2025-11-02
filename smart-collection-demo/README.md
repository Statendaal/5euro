# Smart Collection Demo

Een full-stack demo applicatie die inzichtelijk maakt wanneer het voor invorderaars niet de moeite loont om een kleine schuld te innen omdat de uitvoeringskosten te hoog zijn. Inclusief maatschappelijke kosten en baten analyse.

## 🎯 Over dit Project

Deze demo applicatie implementeert de aanbevelingen uit het IBO-rapport "De maatschappelijke kosten van schuldenproblematiek" en lost specifiek het **"5 Euro Klanten" probleem** op:

- **Probleem:** Een schuld van €8,50 kan oplopen tot €500+ door administratie/incassokosten
- **Kernissue:** Uitvoeringskosten (~€826 miljoen) > Schulden (~€590 miljoen)
- **Maatschappelijke impact:** Kleine schulden veroorzaken €20.000+ aan maatschappelijke schade

## ✨ Functionaliteiten

### 1. **Schuld Analyse Tool**
- Analyseer individuele schulden real-time
- Bereken directe invorderingskosten (€660 gemiddeld)
- Voorspel succeskans met ML-algoritmes
- Bereken maatschappelijke impact:
  - Gezondheidszorg (GGZ, huisarts, medicijnen)
  - Werkgerelateerde kosten (verzuim, uitval)
  - Schuldhulpverlening
  - Juridische escalatie
  - Huiselijk geweld (correlatie)
- Automatische aanbeveling: innen, betalingsregeling, consolideren, of kwijtschelden

### 2. **Bulk Analyse Dashboard**
- Analyseer 100+ kleine schulden in één keer
- Vergelijk traditionele vs Smart Collection aanpak
- Visualiseer besparingen per maand/jaar
- Top 5 meest verspillende schuldentypen
- KPI's: besparingen, burgers geholpen, effectiviteit

### 3. **Maatschappelijke Kosten Calculator**
- Berekent volledige maatschappelijke impact per schuld
- Risicoprofiel scoring (0-100)
- Kans-berekening per kostendomein
- Totale kosten-ratio (schade vs schuld)

## 🏗️ Architectuur

```
smart-collection-demo/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── server.ts       # Express server & routes
│   │   ├── calculator.ts   # Cost calculation engine
│   │   ├── types.ts        # TypeScript types
│   │   └── mockData.ts     # Mock debts for testing
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── DebtAnalysisForm.tsx    # Input formulier
    │   │   ├── AnalysisResults.tsx     # Resultaten visualisatie
    │   │   └── Dashboard.tsx           # Bulk analyse dashboard
    │   ├── App.tsx          # Main app component
    │   ├── api.ts           # API client
    │   ├── types.ts         # TypeScript types
    │   └── main.tsx         # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🚀 Aan de Slag

### Vereisten

- Node.js 18+ 
- npm of yarn

### Installatie

#### 1. Clone het project

```bash
cd /Users/marc/Projecten/svb-cak/smart-collection-demo
```

#### 2. Installeer Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Installeer Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Development

#### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend draait op: http://localhost:3001

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend draait op: http://localhost:3000

### Open de Applicatie

Open je browser en ga naar: **http://localhost:3000**

## 📖 Gebruik

### Schuld Analyse

1. **Klik op "Voorbeeld laden"** om een voorgevulde schuld te laden
2. Of vul handmatig in:
   - Schuldbedrag (bijv. €8,50)
   - Type schuld (CAK, parkeerboete, etc.)
   - Datums
   - Burger informatie (BSN, inkomen, andere schulden)
3. **Klik "Analyseer Schuld"**
4. Bekijk complete kosten-baten analyse met:
   - Financiële impact
   - Maatschappelijke kosten
   - Automatische aanbeveling
   - Geschatte besparing

### Dashboard

1. **Klik op "Dashboard" tab**
2. Zie bulk analyse van 100 kleine schulden
3. Vergelijk traditionele vs Smart Collection aanpak
4. Bekijk KPI's en besparingen
5. Zie top 5 meest verspillende schuldentypen

## 🧪 API Endpoints

### POST /api/v1/debts/analyze
Analyseer een enkele schuld

**Request:**
```json
{
  "debt": {
    "amount": 8.50,
    "type": "cak_eigen_bijdrage",
    "originDate": "2024-09-15",
    "dueDate": "2024-09-30"
  },
  "citizen": {
    "bsn": "123456789",
    "income": 1450,
    "incomeSource": "benefit_social",
    "otherDebtsCount": 3,
    "inDebtAssistance": false,
    "paymentHistory": [...]
  }
}
```

**Response:** Complete kosten-baten analyse

### POST /api/v1/debts/bulk-analyze
Bulk analyse van meerdere schulden

**Request:**
```json
{
  "filters": {
    "amountLessThan": 100,
    "limit": 100
  }
}
```

**Response:** Aggregated analysis met savings en recommendations

### GET /api/v1/debts/mock?limit=10
Haal mock schulden op voor testing

### GET /api/v1/dashboard/metrics?period=month
Dashboard metrics en KPI's

## 💰 Voorbeeld Berekening

Voor een schuld van **€8,50** (CAK eigen bijdrage):

### Traditionele Aanpak
- Invorderingskosten: **€660**
- Succeskans: **12%**
- Verwachte opbrengst: **€1,02**
- **Verlies: €658,98** (ratio 77:1)
- Maatschappelijke kosten: **€20.080**
- **Totale schade: €20.739**

### Smart Collection Aanpak
- Aanbeveling: **Kwijtschelden**
- Kosten: **€5**
- Besparing invorderingskosten: **€655**
- Voorkomde maatschappelijke schade: **€20.080**
- **Totale besparing: €20.735**

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualisatie
- **Lucide React** - Icons

## 📊 Berekening Methodologie

### Direct Costs
- Gebaseerd op gemiddelde marktprijzen incassodiensten
- Interne urenregistratie (4 uur × €75/uur)

### Success Probability (ML Model)
Gewogen factoren:
- Inkomensniveau (30%)
- Betalingsgeschiedenis (30%)
- Aantal andere schulden (25%)
- Leeftijd schuld (15%)

### Societal Costs
Gebaseerd op IBO-rapport cijfers:
- **Gezondheidszorg:** €3.000 (25% kans)
- **Werk:** €5.550 (40% kans bij uitkering)
- **Schuldhulp:** €7.400 (65% kans)
- **Huiselijk geweld:** €6.000 (8% kans)
- **Juridisch:** €3.650 (50% kans)

Risk score bepaalt kansen per domein.

## 🔧 Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧰 Development Scripts

### Backend
- `npm run dev` - Start development server met hot reload
- `npm run build` - Compile TypeScript naar JavaScript
- `npm start` - Start productie server

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Demo

### 1. Real-time Cost Calculation
![Cost Calculation]
- Instant berekening bij input wijziging
- Transparante breakdown van alle kosten
- ML-based success probability

### 2. Societal Impact Visualization
![Societal Impact]
- Risico score indicator
- Breakdown per kostendomein
- Kans-berekening met probabiliteit

### 3. Recommendation Engine
![Recommendations]
- Automatisch beste actie voorstellen
- Vergelijk 4 scenario's
- Geschatte besparingen

### 4. Bulk Analysis Dashboard
![Dashboard]
- Process 100+ debts instantly
- Visual comparison charts
- Top wasteful debt types

## 📈 Business Case

### ROI Berekening

**Per organisatie (3.000 kleine schulden/jaar):**
- Traditionele kosten: €1.42M
- Met Smart Collection: €445K
- **Besparing: €975K/jaar**

**Landelijk (100 organisaties):**
- Jaar 3+: €97.5M besparing/jaar
- 5-jaars ROI: 210x

## 🤝 Contributie

Dit is een demo project voor het IBO Schuldenproblematiek rapport. Voor vragen of feedback:

- Email: [info@example.com]
- GitHub: [github.com/username/smart-collection-demo]

## 📄 Licentie

MIT License - Zie LICENSE file voor details

## 🙏 Acknowledgments

- **IBO Werkgroep Problematische Schulden** - Onderzoeksrapport
- **Panteia, Hogeschool Utrecht, Nibud** - Research data
- **Ministerie van BZK** - Programma Open Overheid

## 📚 Gerelateerde Documenten

- [IBO-rapport: De maatschappelijke kosten van schuldenproblematiek](../Onderzoeksrapport+De+maatschappelijke+kosten+van+schuldenproblematiek.pdf)
- [Architectuur Document](../ARCHITECTUUR.md)
- [Smart Collection App Specificatie](../SMART-COLLECTION-APP.md)

---

**Gebouwd met ❤️ voor een betere schuldhulpverlening**

Voor vragen: Open een issue op GitHub of contacteer het team.
