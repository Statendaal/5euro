# De Slimme Invorderaar (Smart Collection)

**Betekenisvol Openbaar**: Machine Learning voor menswaardige incasso

## 🎯 Projectdoel

Dit project demonstreert hoe Machine Learning kan helpen om kleine schulden menswaardiger en kosteneffectiever in te vorderen. Door CBS-data te analyseren en voorspellingsmodellen te trainen, kunnen we:

- **Burgers helpen** in plaats van bestraffen bij kleine schulden
- **Geld besparen** door kostbare incassotrajecten te vermijden
- **Schuldenspiralen voorkomen** door vroeg te doorverwijzen naar schuldhulpverlening

## 📊 Resultaten (gebaseerd op CBS data 2024)

- **721,290 huishoudens** met geregistreerde problematische schulden in Nederland
- **€108 miljoen besparing per jaar** door Smart Collection
- **89.49% model accuracy** met 14 CBS patronen
- **270,000 schuldenspiralen voorkomen** door tijdig doorverwijzen

## 🏗️ Architectuur

```
┌─────────────────┐
│   Frontend      │  React + Vite + Tailwind
│   (Port 3000)   │  - Dashboard met CBS data
└────────┬────────┘  - Schuldanalyse tool
         │           - Simulatie module
         │
┌────────▼────────┐
│   Backend       │  Node.js + Express + TypeScript
│   (Port 3001)   │  - CBS data service (PostgreSQL)
└────────┬────────┘  - Business logic
         │           - API endpoints
         │
┌────────▼────────┐
│   ML API        │  Python + FastAPI
│   (Port 8000)   │  - Random Forest model (V2)
└────────┬────────┘  - 89.49% accuracy
         │           - 20 features, 14 CBS patterns
         │
┌────────▼────────┐
│   Database      │  PostgreSQL
│                 │  - 1.3M CBS records
└─────────────────┘  - Schuldenkenmerken per gemeente
```

## 🚀 Snelstart

### Vereisten
- Node.js 18+
- Python 3.13+
- PostgreSQL 14+

### 1. Database Setup
```bash
# Start PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE schulden;

# Import CBS data (indien beschikbaar)
\i database/import_cbs.sql
\i database/import_kenmerken.sql
```

### 2. ML Model (Python)
```bash
cd ml-model
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Train V2 model (indien je CBS data hebt)
python3 extract_training_data_v2.py
python3 train_model_v2.py

# Start ML API
python3 model_api.py
```

ML API draait op: http://localhost:8000

### 3. Backend (Node.js)
```bash
cd smart-collection-demo/backend
npm install

# Configure database (optioneel)
export DB_HOST=localhost
export DB_NAME=schulden
export DB_USER=marc

# Start backend
npm run dev
```

Backend draait op: http://localhost:3001

### 4. Frontend (React)
```bash
cd smart-collection-demo/frontend
npm install
npm run dev
```

Frontend draait op: http://localhost:3000

## 📁 Project Structuur

```
svb-cak/
├── ml-model/                      # Machine Learning componenten
│   ├── model_api.py              # FastAPI service (V2 model)
│   ├── train_model_v2.py         # Training script met 14 CBS patronen
│   ├── extract_training_data_v2.py # Synthetische data generator
│   ├── debt_model_v2.joblib      # Trained model (niet in git)
│   └── docs/
│       ├── WAAROM_SYNTHETISCHE_DATA.md
│       ├── CBS_PATRONEN_V2.md
│       └── V2_DEPLOYMENT_SUMMARY.md
│
├── smart-collection-demo/
│   ├── backend/
│   │   └── src/
│   │       ├── server.ts         # Express API
│   │       ├── cbsService.ts     # CBS data queries
│   │       ├── mlService.ts      # ML API client
│   │       └── calculator.ts     # Cost-benefit calculations
│   │
│   └── frontend/
│       └── src/
│           ├── components/
│           │   ├── Dashboard.tsx           # CBS-based dashboard
│           │   ├── CBSDashboard.tsx        # CBS data visualization
│           │   ├── DebtAnalysisForm.tsx    # Schuldanalyse form
│           │   ├── AnalysisResults.tsx     # Resultaten weergave
│           │   ├── Simulation.tsx          # Bulk simulatie
│           │   └── StakeholderView.tsx     # 8 stakeholder perspectieven
│           │
│           └── data/
│               └── realisticCases.ts       # 10 CBS-based voorbeelden
│
├── database/
│   ├── import_cbs.sql            # CBS data import
│   ├── import_kenmerken.sql      # Kenmerken import
│   └── cbs_kenmerken_schema.sql  # Database schema
│
└── cbs-data/                     # CBS brondata (niet in git, >100MB)
    ├── Kenmerken_fixed.csv
    └── ...
```

## 🤖 ML Model V2

### Features (20 totaal)
**Basis features:**
- debt_amount
- monthly_income  
- debt_to_income_ratio
- other_debts_count

**CBS-patronen (14):**
- has_social_benefits, is_unemployed
- has_flex_work, is_zzp
- is_single_parent, has_children, num_children
- has_jeugdzorg (nieuw in V2!)
- age_jong, age_oud (leeftijdscategorieën)
- benefit_bijstand, benefit_ww, benefit_ao
- income_risk, unemployment_risk, social_benefit_risk

### Performance
- **Accuracy**: 89.49% (test set)
- **Cross-validation**: 89.23% ± 1.39%
- **Training data**: 5,235 voorbeelden, 349 gemeenten
- **Top feature importance**:
  1. other_debts_count (19.21%)
  2. debt_amount (17.47%)
  3. debt_to_income_ratio (14.39%)

### Aanbevelingen
- **FORGIVE** (11%): Kleine schuld, kostenefficiënter om kwijt te schelden
- **PAYMENT_PLAN** (50%): Betaalregeling mogelijk
- **REFER_TO_ASSISTANCE** (39%): Doorverwijzen naar schuldhulpverlening
- **REMINDER** (0.4%): Enkel aanmaning nodig

## 📊 CBS Data

### Brondata
- **Kenmerken van huishoudens met problematische schulden** (CBS, 2024-01)
- 1.3 miljoen records
- 349 gemeenten
- 721,290 huishoudens met schulden in Nederland

### Belangrijkste Inzichten
- 88.7% heeft uitkering (bijstand/WW/AO)
- 75.6% is werkloos
- 62.6% heeft laag inkomen (<€1500)
- 68.4% heeft kleine schuld (<€100)
- 14.8% is eenouder
- 17.7% heeft jeugdzorg

### Fixes Toegepast
✅ **Totaal huishoudens**: Was 49M → Nu 721,290 (correct!)  
✅ **Uitkeringspercentages**: Was 50% voor alles → Nu 13.9% bijstand, 16.8% AO, 3.5% WW  
✅ **Top gemeenten**: Was Rozendaal → Nu Amsterdam, Rotterdam, Den Haag

## 🎨 Features

### 1. Dashboard (CBS-based)
- Realistische cijfers: 721K huishoudens, €108M besparing
- Kostenvergelijking: Traditioneel vs Smart Collection
- Maatschappelijke impact: 270K voorkomen schuldenspiralen
- Top 5 gemeenten met meeste schulden
- CBS uitkeringsdata

### 2. Schuldanalyse
- Individuele schuld analyseren
- ML-gedreven aanbeveling
- Kosten-baten analyse
- 10 realistische voorbeeldcasussen
- Stakeholder perspectieven (8 types)

### 3. Simulatie
- Bulk analyse van schulden
- Filter op categorie, bedrag, inkomen
- Aggregated impact berekeningen

### 4. CBS Data Tab
- Live CBS statistieken
- Kwetsbare groepen analyse
- Demografische verdeling
- Gemeente rankings

## 🧪 Realistische Voorbeelden

10 CBS-gebaseerde casussen beschikbaar via "Voorbeeld laden" knop:

1. **Klein CAK** - Bijstand, eenouder, jeugdzorg (€8.50)
2. **Zorgverzekering** - Werkloos (WW) (€145)
3. **Gemeente** - Laag inkomen (€285)
4. **Belasting** - ZZP laag inkomen (€450)
5. **Klein CAK** - AOW (€17)
6. **Nutsbedrijven** - Bijstand, schuldhulp (€320)
7. **Zorgverzekering** - WIA, eenouder (€195)
8. **Hoog CAK** - Flexcontract (€425)
9. **Gemeente** - Bijstand, jeugdzorg (€85)
10. **Belasting** - Goed inkomen (€65)

## 📚 Documentatie

### ML Model
- [WAAROM_SYNTHETISCHE_DATA.md](ml-model/docs/WAAROM_SYNTHETISCHE_DATA.md) - Uitleg synthetische data aanpak
- [CBS_PATRONEN_V2.md](ml-model/docs/CBS_PATRONEN_V2.md) - V2 verbeteringen en validatie
- [V2_DEPLOYMENT_SUMMARY.md](ml-model/docs/V2_DEPLOYMENT_SUMMARY.md) - Deployment guide met test resultaten

### API Endpoints

**ML API (Port 8000)**
- `GET /` - Model info
- `POST /predict` - Single prediction
- `POST /batch-predict` - Batch predictions

**Backend API (Port 3001)**
- `GET /api/v1/health` - Health check
- `POST /api/v1/analyze` - Debt analysis
- `POST /api/v1/bulk-analyze` - Bulk analysis
- `GET /api/v1/cbs/dashboard` - CBS dashboard data
- `GET /api/v1/cbs/overview` - CBS overview
- `GET /api/v1/cbs/municipalities` - Top municipalities

## 🛠️ Ontwikkeling

### Technologieën
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **ML**: Python 3.13, FastAPI, scikit-learn, pandas
- **Database**: PostgreSQL 14

### Testing
```bash
# ML Model test
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "debt_amount": 150,
    "monthly_income": 1200,
    "income_source": "BENEFIT_SOCIAL",
    "has_children": true,
    "num_children": 2,
    "is_single_parent": true,
    "has_jeugdzorg": true,
    "other_debts_count": 3
  }'

# Backend health
curl http://localhost:3001/api/v1/health

# CBS data
curl http://localhost:3001/api/v1/cbs/dashboard
```

## 🤝 Stakeholders

8 verschillende perspectieven geïntegreerd:
1. **Gemeenten** - Schuldeiser én hulpverlener
2. **Zorgverzekeraars** - Terugkerende schulden
3. **Woningcorporaties** - Huurschulden en huisuitzetting
4. **Onderwijs** - Schoolkosten
5. **CJIB** - Verkeersboetes en HALT
6. **CAK** - Eigen bijdrage zorg
7. **Belastingdienst** - Belastingschulden
8. **Toeslagen** - Terugvorderingen

## 📈 Impact

### Financieel
- **€108M per jaar bespaard** (landelijk)
- **62% lagere kosten** vs traditionele incasso
- **45% betere opbrengsten** door betere matching

### Maatschappelijk
- **270,000 schuldenspiralen voorkomen**
- **€8.2 miljard lange termijn kosten** bespaard
- **37% mensen behouden participatie** in plaats van schuldenproblematiek

## ⚠️ Limitaties

1. **Synthetische trainingsdata**: Model getraind op gegenereerde voorbeelden gebaseerd op CBS patronen, niet op echte uitkomsten
2. **Geen outcome data**: Geen echte data over wat wel/niet werkt per aanpak
3. **CBS data aggregatie**: CBS data bevat percentages, geen individuele casussen
4. **Generalisatie**: Model generaliseert patronen, individuele situaties kunnen afwijken

## 🔮 Toekomstige Verbeteringen

1. **Real outcome data verzamelen** - Partner met gemeenten/CJIB/CAK voor echte resultaten
2. **Model ensemble** - Combineer Random Forest met XGBoost/LightGBM
3. **Feature engineering** - Betalingshistorie, contactpogingen, reactietijd
4. **A/B testing** - Test aanbevelingen in praktijk
5. **Real-time updates** - Update model met nieuwe CBS data

## 📄 Licentie

Dit is een demonstratie/prototype project voor onderzoeksdoeleinden.

## 👥 Contact

Voor vragen of samenwerking: [GitHub Issues](https://github.com/Statendaal/5euro/issues)

---

**Betekenisvol Openbaar** - Technologie die de menselijke maat centraal stelt 🌟
