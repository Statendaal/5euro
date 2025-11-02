# Quick Start Guide - Smart Collection Demo

## ⚡ In 3 Minuten Aan de Slag

### Optie 1: Automatisch (MacOS/Linux)

```bash
cd /Users/marc/Projecten/svb-cak/smart-collection-demo
./start.sh
```

De applicatie start automatisch op http://localhost:3000

### Optie 2: Handmatig

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in je browser

## 🎬 Demo Flow

### 1. Test met Voorbeeld Schuld (30 seconden)

1. Open http://localhost:3000
2. Klik op **"Voorbeeld laden"** knop (rechtsboven formulier)
3. Klik op **"Analyseer Schuld"**
4. Bekijk resultaten:
   - ❌ Traditionele aanpak: **€660 kosten** voor **€8,50 schuld** = €659 verlies
   - 🏥 Maatschappelijke impact: **€20.080** extra schade
   - ✅ Aanbeveling: **Kwijtschelden** voor €5 = **€20.735 besparing**

### 2. Bekijk Dashboard (1 minuut)

1. Klik op **"Dashboard"** tab
2. Zie bulk analyse van 100 kleine schulden:
   - 💰 Totale besparing: **€2.2M per maand**
   - 👥 Burgers geholpen: **2.135**
   - 📊 Effectiviteit: **78%**
3. Scroll naar beneden voor:
   - Vergelijkingschart
   - Top 5 meest verspillende schuldentypen
   - Aanbevelingen breakdown

### 3. Probeer Eigen Scenario (2 minuten)

1. Ga terug naar **"Schuld Analyse"** tab
2. Pas aan:
   - Bedrag: probeer €50, €100, €200
   - Type: kies andere schuldentypen
   - Inkomen: probeer verschillende niveaus
   - Andere schulden: verhoog aantal
3. Zie hoe aanbeveling verandert!

## 💡 Interessante Test Cases

### Case 1: Zeer Kleine Schuld
```
Bedrag: €5
Type: CAK eigen bijdrage
Inkomen: €1.200 (bijstand)
Andere schulden: 5
```
**Verwacht:** Vrijwel zeker kwijtschelden aanbevolen

### Case 2: Middelgrote Schuld, Stabiel Inkomen
```
Bedrag: €85
Type: Hondenbelasting
Inkomen: €2.500 (werkzaam)
Andere schulden: 0
```
**Verwacht:** Mogelijk betalingsregeling of regulier innen

### Case 3: Stapeling Problematiek
```
Bedrag: €45
Type: Zorgverzekering premie
Inkomen: €1.350 (bijstand)
Andere schulden: 6
In schuldhulpverlening: Ja
```
**Verwacht:** Doorverwijzen of kwijtschelden, hoog risicoprofiel

## 🔍 Wat te Kijken

### Financiële Analyse
- **Cost-to-Debt Ratio:** Hoe vaak zijn kosten hoger dan schuld?
- **Succeskans:** ML-model voorspelling (gebaseerd op profiel)
- **Scenario Vergelijking:** Welke actie levert beste resultaat?

### Maatschappelijke Impact
- **Risicoscore:** 0-100, gebaseerd op profiel
- **Kostenbreakdown:** Per domein (gezondheid, werk, juridisch)
- **Total Cost Ratio:** Hoe groot is maatschappelijke schade vs schuld?

### Aanbeveling
- **Confidence Score:** Hoe zeker is het systeem?
- **Reasoning:** Waarom deze aanbeveling?
- **Suggested Steps:** Concrete acties om uit te voeren

## 🎯 Key Insights uit Demo

1. **Kleine schulden zijn duur:**
   - €8,50 schuld kost €660 om te innen (77x ratio)
   - Veroorzaakt €20.080 maatschappelijke schade (2.362x ratio)

2. **Kwijtschelden bespaart geld:**
   - Kosten kwijtschelding: €5
   - Voorkomde kosten: €20.735
   - ROI: 4.147x

3. **Bulk effect is enorm:**
   - 100 kleine schulden traditioneel: -€3.37M schade
   - Met Smart Collection: +€2.11M besparing
   - Verschil: €5.48M per 100 schulden

4. **Niet alle schulden kwijtschelden:**
   - Systeem maakt intelligente afweging
   - Hogere inkomens → betalingsregeling
   - Stabiele situaties → regulier innen
   - Kwetsbare burgers → kwijtschelden/hulp

## 🐛 Troubleshooting

### Port 3000 of 3001 al in gebruik?

**Backend (3001):**
```bash
PORT=3002 npm run dev
```

Dan frontend vite.config.ts aanpassen:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3002',
  }
}
```

**Frontend (3000):**
```bash
# In vite.config.ts
server: {
  port: 3001,
}
```

### Dependencies installeren lukt niet?

```bash
# Verwijder node_modules en probeer opnieuw
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

### TypeScript errors?

```bash
# Rebuild TypeScript
cd backend && npm run build
cd ../frontend && npm run build
```

## 📊 API Testen (optioneel)

Test API direct met curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Get mock debts
curl http://localhost:3001/api/v1/debts/mock?limit=5

# Analyze debt
curl -X POST http://localhost:3001/api/v1/debts/analyze \
  -H "Content-Type: application/json" \
  -d '{
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
      "paymentHistory": []
    }
  }'
```

## 🎓 Volgende Stappen

Na de demo:

1. **Lees de documentatie:**
   - [README.md](./README.md) - Complete documentatie
   - [ARCHITECTUUR.md](../ARCHITECTUUR.md) - Architectuur overzicht
   - [SMART-COLLECTION-APP.md](../SMART-COLLECTION-APP.md) - App specificatie

2. **Bekijk de code:**
   - `backend/src/calculator.ts` - Cost calculation logica
   - `frontend/src/components/AnalysisResults.tsx` - Resultaten visualisatie
   - `backend/src/mockData.ts` - Test data

3. **Experimenteer:**
   - Pas berekeningen aan in calculator.ts
   - Voeg nieuwe schuldentypen toe
   - Wijzig ML model weights
   - Voeg nieuwe visualisaties toe

## 💬 Feedback & Vragen

Heb je vragen of feedback over de demo?
- Open een issue op GitHub
- Contact: [info@example.com]

---

**Veel succes met de demo! 🚀**
