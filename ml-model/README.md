# Smart Collection ML Model

Machine Learning model voor intelligente schuldinvordering, gebaseerd op CBS data over problematische schulden in Nederland.

## Overzicht

Dit ML model voorspelt de beste aanpak voor schuldinvordering op basis van kenmerken van de burger en de schuld. Het model is getraind op synthetische data gegenereerd uit CBS statistieken over 1,3 miljoen records van huishoudens met problematische schulden.

## Model Specificaties

- **Type**: Random Forest Classifier
- **Nauwkeurigheid**: 99.8% (cross-validation)
- **Training Data**: 6.860 synthetische voorbeelden gebaseerd op CBS kenmerken
- **Features**: 8 input kenmerken
- **Output**: 4 mogelijke aanbevelingen

### Input Features

1. **debt_amount** - Schuldbedrag in euro's
2. **monthly_income** - Maandelijks inkomen van burger
3. **has_social_benefits** - Heeft sociale uitkering (boolean)
4. **is_unemployed** - Is werkloos (boolean) 
5. **debt_to_income_ratio** - Schuld/inkomen ratio
6. **income_risk** - Geschat inkomensrisico (0-100)
7. **unemployment_risk** - Geschat werkloosheidsrisico (0-100)
8. **social_benefit_risk** - Geschat uitkeringsrisico (0-100)

### Output Aanbevelingen

- **FORGIVE** - Kwijtschelding (kleine schuld, hoge kosten)
- **PAYMENT_PLAN** - Betalingsregeling (kwetsbare burger)
- **REFER_TO_ASSISTANCE** - Doorverwijzen naar schuldhulpverlening (complexe situatie)
- **REMINDER** - Standaard invordering (goede kans op succes)

## Feature Importance

De belangrijkste factoren voor het model zijn:

1. **debt_amount** (30.7%) - Grootte van de schuld
2. **has_social_benefits** (23.9%) - Uitkeringssituatie
3. **debt_to_income_ratio** (23.5%) - Schuldlast ten opzichte van inkomen
4. **is_unemployed** (14.7%) - Werkloosheidsstatus

## Installatie

```bash
cd /Users/marc/Projecten/svb-cak/ml-model

# Maak virtual environment
python3 -m venv venv
source venv/bin/activate

# Installeer dependencies
pip install -r requirements.txt
```

## Training

### 1. Extract Training Data

Genereer synthetische training data uit CBS database:

```bash
source venv/bin/activate
python3 extract_training_data.py
```

Dit genereert `training_data.csv` met ~7000 voorbeelden gebaseerd op CBS kenmerken van 686 gemeenten.

### 2. Train Model

Train het Random Forest model:

```bash
python3 train_model.py
```

Output:
- `debt_model.pkl` - Getraind model
- `scaler.pkl` - Feature scaler
- `label_encoder.pkl` - Label encoder  
- `model_config.json` - Model configuratie

## API Server

Start de ML API server:

```bash
source venv/bin/activate
python3 model_api.py
```

De API draait op http://127.0.0.1:8000

### API Endpoints

#### GET /
Health check en model info
```bash
curl http://127.0.0.1:8000/
```

#### POST /predict
Voorspel beste aanpak voor schuld

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "debt_amount": 15,
    "monthly_income": 1200,
    "income_source": "BENEFIT_SOCIAL",
    "has_children": true,
    "in_debt_assistance": false,
    "other_debts_count": 3
  }'
```

Response:
```json
{
  "recommendation": "PAYMENT_PLAN",
  "confidence": 0.922,
  "probabilities": {
    "FORGIVE": 0.045,
    "PAYMENT_PLAN": 0.922,
    "REFER_TO_ASSISTANCE": 0.019,
    "REMINDER": 0.013
  },
  "features_used": {
    "debt_amount": 15.0,
    "monthly_income": 1200.0,
    "has_social_benefits": true,
    "is_unemployed": false,
    "debt_to_income_ratio": 0.013,
    "income_risk": 85.0,
    "unemployment_risk": 15.0,
    "social_benefit_risk": 90.0
  },
  "ml_model_info": {
    "accuracy": 1.0,
    "cv_mean": 0.998,
    "feature_importance_top": "debt_amount, has_social_benefits, debt_to_income_ratio"
  }
}
```

## Integratie met Backend

Het model is geïntegreerd met de backend via `mlService.ts`:

```typescript
import { getMLRecommendation } from './mlService';

// In je analysis endpoint:
const mlResult = await getMLRecommendation(request);
```

De service heeft automatische fallback naar regel-gebaseerde logica als de ML API niet beschikbaar is.

## Test Cases

### Case 1: Klein schuld, bijstand
```json
{
  "debt_amount": 15,
  "monthly_income": 1200,
  "income_source": "BENEFIT_SOCIAL"
}
```
**Verwacht**: PAYMENT_PLAN (92% confidence)

### Case 2: Middel schuld, goed inkomen
```json
{
  "debt_amount": 500,
  "monthly_income": 3500,
  "income_source": "EMPLOYMENT"
}
```
**Verwacht**: REMINDER (86% confidence)

### Case 3: Grote schuld, zeer laag inkomen
```json
{
  "debt_amount": 2000,
  "monthly_income": 1000,
  "income_source": "BENEFIT_UNEMPLOYMENT"
}
```
**Verwacht**: REFER_TO_ASSISTANCE (68% confidence)

## Data Bronnen

Het model is getraind op basis van:
- **CBS Kenmerken**: 1,3 miljoen records over schuldenaren per gemeente
- **CBS Ontwikkeling**: Trends 2015-2024
- **CBS Schuldregistraties**: Bronnen van schulden
- **CBS Aantal Registraties**: Meerdere schuldbronnen

## Performance

- **Accuracy**: 100% op test set
- **Cross-validation**: 99.8% ± 0.2%
- **Inference tijd**: ~10ms per voorspelling
- **API response tijd**: ~50-100ms (inclusief feature engineering)

## Deployment

### Development
```bash
# Terminal 1: ML API
cd ml-model
source venv/bin/activate
python3 model_api.py

# Terminal 2: Backend
cd smart-collection-demo/backend
npm start

# Terminal 3: Frontend
cd smart-collection-demo/frontend  
npm run dev
```

### Production

Voor productie deployment:
1. Train model op volledige dataset
2. Deploy ML API met uvicorn + gunicorn
3. Configureer load balancer
4. Enable model monitoring

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker model_api:app
```

## Monitoring

Monitor de volgende metrics:
- API response times
- Model confidence scores
- Prediction distribution
- Fallback rate (wanneer ML API niet beschikbaar is)

## Toekomstige Verbeteringen

1. **Echte data**: Train op geanonimiseerde echte schuldendata
2. **Feature engineering**: Voeg postcode, gezinssamenstelling toe
3. **A/B testing**: Vergelijk ML vs regel-based aanpak
4. **Model retraining**: Periodiek hertrain met nieuwe data
5. **Explainability**: Voeg SHAP values toe voor transparantie

## Licentie

Dit model is ontwikkeld voor de "De Slimme Invorderaar" demo applicatie.
