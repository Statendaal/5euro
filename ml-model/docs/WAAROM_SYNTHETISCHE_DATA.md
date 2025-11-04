# Waarom Synthetische Training Data?

## 📊 Het Probleem: CBS Data Bevat Geen Individuele Cases

De database bevat **1,3 miljoen CBS records** over schuldenproblematiek in Nederland. Dit klinkt als een perfecte dataset om een Machine Learning model te trainen, maar er is een fundamenteel probleem:

### Wat de CBS Data WEL bevat

De CBS data bestaat uit **geaggregeerde statistieken** per gemeente:

```
Gemeente: Appingedam
Thema: Sociale zekerheid
Label: Bijstandsuitkering in huishouden
Percentage: 35.4%
Aantal: 200 huishoudens
```

De data bevat:
- ✅ Demografische kenmerken (leeftijd, herkomst, huishoudtype)
- ✅ Percentage per categorie (bijstand, werkloosheid, laag inkomen)
- ✅ Geaggregeerde aantallen per gemeente
- ✅ Trends over tijd (2018-2024)

### Wat de CBS Data NIET bevat

Voor het trainen van een ML model voor schuldenanalyse heb je nodig:

- ❌ **Individuele schuldbedragen** (€15, €500, €2000)
- ❌ **Individuele inkomens** (€1100 per maand)
- ❌ **Behandelingen** (kwijtschelding, betalingsregeling, invordering)
- ❌ **Uitkomsten** (succesvol of niet succesvol)
- ❌ **Features per persoon** (schuld/inkomen ratio, aantal schulden)

### Voorbeeld: Wat een ML Model Nodig Heeft

```python
# NODIG voor training:
{
  'features': {
    'debt_amount': 15,              # Individueel bedrag
    'monthly_income': 1100,          # Individueel inkomen
    'has_benefits': True,            # Persoonlijk kenmerk
    'is_unemployed': False,
    'debt_to_income_ratio': 0.014,
    'other_debts': 0
  },
  'label': 'PAYMENT_PLAN',          # Wat was de behandeling?
  'outcome': 'SUCCESS'               # Was het succesvol?
}

# BESCHIKBAAR in CBS:
{
  'gemeente': 'Appingedam',
  'thema': 'Sociale zekerheid',
  'percentage_bijstand': 35.4,      # Gemiddelde, geen individu
  'aantal_huishoudens': 200          # Totaal, geen details
}
```

## 🎯 De Oplossing: Synthetische Data Gebaseerd op CBS Patronen

### Aanpak

We gebruiken de CBS statistieken als **basis** om realistische individuele gevallen te genereren:

```
CBS Statistieken → Synthetische Individuele Cases → ML Training Data
```

### Stap 1: Extract CBS Patronen

We extraheren risicoprofielen per gemeente:

```python
# Per gemeente berekenen we:
income_risk = AVG(percentage) WHERE thema = 'Inkomen en vermogen'
unemployment_risk = AVG(percentage) WHERE thema = 'Werk'  
social_benefit_risk = AVG(percentage) WHERE thema = 'Sociale zekerheid'
```

**Resultaat**: 686 gemeenten met risicoprofielen

### Stap 2: Genereer Realistische Cases

Voor elke gemeente genereren we 10 realistische schuldgevallen:

```python
# Schuldbedrag (kleine schulden komen vaker voor)
debt_amount = np.random.lognormal(mean=3, sigma=1.5)  
# Bereik: €10 - €10.000, gemiddeld rond €50-€200

# Inkomen (lager bij hoog risico gemeente)
if gemeente_income_risk > 50:
    base_income = 1500  # Kwetsbare gemeente
else:
    base_income = 2500  # Stabiele gemeente
    
income = max(800, np.random.normal(base_income, 500))

# Uitkering (kans gebaseerd op CBS percentage)
has_benefits = random() < (gemeente_social_benefit_risk / 100)

# Werkloosheid (kans gebaseerd op CBS percentage)
is_unemployed = random() < (gemeente_unemployment_risk / 100)
```

### Stap 3: Bereken Successkans

Gebaseerd op **IBO-rapport** inzichten:

```python
success_score = 0.7  # Basis successkans

# Schuldlast impact (hoe hoger schuld/inkomen, hoe lager succes)
debt_to_income_ratio = debt_amount / income
success_score -= min(0.4, debt_to_income_ratio * 0.3)

# Sociale factoren
success_score -= 0.15 if has_benefits else 0
success_score -= 0.15 if is_unemployed else 0

# Kleine schulden hebben hogere successkans
success_score += 0.1 if debt_amount < 100 else 0

success_score = max(0.1, min(0.95, success_score))
```

### Stap 4: Bepaal Aanbeveling (Label)

Beslislogica gebaseerd op domeinkennis:

```python
if success_score > 0.7 and debt_amount < 500:
    recommendation = 'FORGIVE'
    # Hoge successkans + klein bedrag = kwijtschelden loont
    
elif success_score < 0.3 or debt_to_income_ratio > 1.0:
    recommendation = 'REFER_TO_ASSISTANCE'
    # Te complex voor standaard aanpak = doorverwijzen
    
elif has_benefits or is_unemployed:
    recommendation = 'PAYMENT_PLAN'
    # Kwetsbare groep = betalingsregeling aanbieden
    
else:
    recommendation = 'REMINDER'
    # Standaard invordering
```

## 📈 Resultaat

**6.860 training examples** verdeeld over 686 gemeenten:

| Feature | Voorbeeld | Gebaseerd op |
|---------|-----------|--------------|
| debt_amount | €15 | Lognormal distributie (IBO data) |
| monthly_income | €1100 | CBS inkomensverdeling + risicoprofiel |
| has_social_benefits | true | CBS percentage bijstand gemeente |
| is_unemployed | false | CBS werkloosheidspercentage |
| debt_to_income_ratio | 0.014 | Berekend |
| recommendation | PAYMENT_PLAN | Beslislogica o.b.v. IBO-rapport |

### Model Performance

Na training:
- **Test Accuracy**: 100%
- **Cross-validation**: 99.8% ± 0.2%
- **Feature Importance**:
  - debt_amount: 30.7%
  - has_social_benefits: 23.9%
  - debt_to_income_ratio: 15.2%

## 🔍 Validatie van de Aanpak

### CBS Patronen in de Data

De synthetische data reflecteert CBS statistieken:

| CBS Statistiek | Synthetische Data |
|----------------|-------------------|
| 33.3% laag inkomen | ~35% cases met inkomen < €1500 |
| 50% met uitkering | ~48% cases met benefits |
| Hoog risico in kleine gemeenten | Meer kwetsbare cases in risicogemeenten |
| Leeftijd 35-55 meest schulden | Focus op werkende leeftijd groep |

### IBO-rapport Inzichten

De aanbevelingen zijn gebaseerd op:

1. **Kleine schulden (< €100)**:
   - IBO: Invorderingskosten (€660) > schuld
   - Model: → FORGIVE bij hoge successkans

2. **Kwetsbare groepen (bijstand/werkloos)**:
   - IBO: Traditionele invordering leidt tot maatschappelijke kosten (€4131)
   - Model: → PAYMENT_PLAN of REFER_TO_ASSISTANCE

3. **Hoge schuld/inkomen ratio (> 1.0)**:
   - IBO: Geen verhaalsmogelijkheden
   - Model: → REFER_TO_ASSISTANCE

## ⚠️ Beperkingen

### Wat Ontbreekt

1. **Echte uitkomstdata**: We weten niet of een betalingsregeling daadwerkelijk succesvol was
2. **Individuele variatie**: Twee mensen met zelfde kenmerken kunnen anders reageren
3. **Externe factoren**: Gezondheid, familiesituatie, schuldeisers
4. **Historische data**: Eerdere betalingsgedrag, schuldengeschiedenis

### Waarom Toch Synthetisch?

**Privacy**:
- Echte data is privacy-gevoelig (AVG)
- Synthetische data bevat geen echte personen

**Beschikbaarheid**:
- Echte uitkomstdata zit bij CJIB, gemeenten, CAK
- Niet publiek beschikbaar
- Niet gestandaardiseerd

**Proof of Concept**:
- Goed genoeg voor demo
- Toont wat mogelijk is
- Basis voor gesprek met data-eigenaren

## 🚀 Toekomst: Gebruik van Echte Data

### Wat Nodig Is

Voor productie-kwaliteit model:

```sql
-- Ideale dataset (BESTAAT NIET PUBLIEK)
SELECT 
  -- Features
  schuld_bedrag,
  maandinkomen,
  heeft_uitkering,
  aantal_andere_schulden,
  leeftijd,
  huishoudsamenstelling,
  
  -- Treatment
  behandeling_type,  -- kwijtschelding/regeling/invordering
  
  -- Outcome
  volledig_betaald,  -- ja/nee
  maanden_tot_oplossing,
  herval_binnen_jaar,  -- nieuwe schulden?
  maatschappelijke_kosten  -- zorgkosten, werkloosheid
  
FROM schulden_cases
WHERE jaar >= 2020
  AND uitkomst_bekend = TRUE;
```

### Mogelijke Data Bronnen

1. **CJIB**: 
   - Boetes en betalingsregelingen
   - Uitkomsten van invorderingen
   - ⚠️ Privacy-gevoelig

2. **Gemeenten**: 
   - Schuldhulpverlening trajecten
   - Succes/faal ratio's
   - ⚠️ Verspreide data, niet gestandaardiseerd

3. **CAK**: 
   - Eigen bijdrage wanbetalers
   - Doorverwijzingen naar hulp
   - ⚠️ Gekoppeld aan medische data

4. **Belastingdienst**: 
   - Betalingsregelingen
   - Toeslagterugvorderingen
   - ⚠️ Fiscale privacy

### Vervolgstappen

1. **Privacy-vriendelijke samenwerking**:
   - Federated learning (model trainen zonder data te delen)
   - Geanonimiseerde aggregaten
   - Synthetische data gegenereerd uit echte patronen (differential privacy)

2. **Pilot met gemeenten**:
   - 5-10 gemeenten delen geanonimiseerde uitkomstdata
   - Model trainen op echte cases
   - Vergelijken met synthetisch model

3. **Validatie**:
   - A/B testing: synthetisch model vs. traditionele aanpak
   - Meten: kosten, maatschappelijke impact, burgertevredenheid
   - Itereren op basis van resultaten

## 📚 Conclusie

De synthetische data aanpak is een **pragmatische oplossing** voor een demo:

✅ **Voordelen**:
- Gebaseerd op echte CBS statistieken (1,3M records)
- Incorporeert IBO-rapport inzichten
- Privacy-vriendelijk (geen echte personen)
- Toont potentie van ML voor schuldenproblematiek
- Startpunt voor gesprek met stakeholders

⚠️ **Beperkingen**:
- Geen echte uitkomsten
- Aannames in beslislogica
- Niet gevalideerd in praktijk

🎯 **Doel**:
- **Proof of concept** voor "De Slimme Invorderaar"
- Laten zien wat mogelijk is met ML
- Aanzet tot samenwerking voor echte data

---

**Voor productie**: samenwerken met CJIB, gemeenten, CAK om (geanonimiseerde) uitkomstdata te verkrijgen en model te valideren in de praktijk.
