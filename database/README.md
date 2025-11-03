# Schulden Database

PostgreSQL database voor "De Slimme Invorderaar" - Kosten-Baten Analyse voor Kleine Schulden.

## Database Structuur

### Tables

#### `organizations`
Creditor organisaties (CAK, DUO, CJIB, gemeentes, etc.)
- `id` - Primary key
- `name` - Naam organisatie
- `type` - Type organisatie (Healthcare, Education, Justice, etc.)

#### `citizens`
Burger profielen voor schuld analyse
- `id` - Primary key
- `bsn` - Burger Service Nummer (uniek)
- `age` - Leeftijd
- `has_children` - Heeft kinderen
- `number_of_children` - Aantal kinderen
- `income_source` - Bron van inkomen
- `monthly_income` - Maandelijks inkomen
- `in_debt_assistance` - In schuldhulpverlening

#### `debts`
Individuele schulden met bedragen en types
- `id` - Primary key
- `citizen_id` - Foreign key naar citizens
- `organization_id` - Foreign key naar organizations
- `amount` - Schuldbedrag
- `debt_type` - Type schuld (cak_eigen_bijdrage, parkeerboete, etc.)
- `origin_date` - Ontstaan datum
- `due_date` - Vervaldatum
- `status` - Status (open, in_collection, paid, forgiven, payment_plan)

#### `analysis_results`
Kosten-baten analyse resultaten per schuld
- `debt_id` - Foreign key naar debts
- `collection_costs_total` - Totale invoerkosten
- `success_probability` - Slagingskans (0.0-1.0)
- `expected_revenue` - Verwachte opbrengst
- `risk_score` - Risico score (0-100)
- `societal_costs_total` - Totale maatschappelijke kosten
- `healthcare_costs` - Gezondheidszorg kosten
- `employment_costs` - Werkgelegenheid kosten
- `debt_assistance_costs` - Schuldhulp kosten
- `domestic_violence_costs` - Huiselijk geweld kosten
- `legal_costs` - Juridische kosten
- `recommended_action` - Aanbevolen actie
- `confidence` - Betrouwbaarheid (0-100)
- `estimated_total_savings` - Geschatte totale besparing

## Installatie

```bash
# Create database
createdb schulden

# Create schema
psql -d schulden -f schema.sql

# Load sample data
psql -d schulden -f sample_data.sql
```

## Sample Data

De database bevat 10 voorbeeldschulden met volledige analyses:

| ID | Bedrag | Type | Risico | Aanbeveling | Besparing |
|----|--------|------|--------|-------------|-----------|
| 3 | €8 | Verkeersboete | 95 | Kwijtschelden | €16,206 |
| 1 | €15 | CAK eigen bijdrage | 85 | Kwijtschelden | €13,716 |
| 2 | €45 | Zorgverzekering | 70 | Kwijtschelden | €11,440 |
| 4 | €25 | Studiefinanciering | 55 | Betalingsregeling | €7,040 |
| 6 | €35 | Hondenbelasting | 50 | Betalingsregeling | €4,260 |
| 5 | €120 | Afvalstoffenheffing | 45 | Betalingsregeling | €5,300 |
| 7 | €75 | Parkeerboete | 25 | Standaard innen | €1,950 |
| 8 | €150 | Verkeersboete | 20 | Standaard innen | €1,560 |
| 9 | €12 | CAK eigen bijdrage | 15 | Kwijtschelden | €1,591 |
| 10 | €5 | Afvalstoffenheffing | 10 | Kwijtschelden | €1,045 |

## Useful Queries

### Overzicht per risico score
```sql
SELECT 
    d.amount,
    d.debt_type,
    c.income_source,
    a.risk_score,
    a.recommended_action,
    a.estimated_total_savings
FROM debts d
JOIN citizens c ON d.citizen_id = c.id
JOIN analysis_results a ON d.id = a.debt_id
ORDER BY a.risk_score DESC;
```

### Totale besparing per aanbeveling
```sql
SELECT 
    a.recommended_action,
    COUNT(*) as aantal_schulden,
    SUM(d.amount) as totaal_schuld,
    SUM(a.estimated_total_savings) as totale_besparing,
    AVG(a.risk_score) as gemiddelde_risico
FROM analysis_results a
JOIN debts d ON a.debt_id = d.id
GROUP BY a.recommended_action
ORDER BY totale_besparing DESC;
```

### Burgers met hoogste risico
```sql
SELECT 
    c.bsn,
    c.income_source,
    c.monthly_income,
    c.in_debt_assistance,
    COUNT(d.id) as aantal_schulden,
    SUM(d.amount) as totaal_schuld,
    AVG(a.risk_score) as gemiddeld_risico
FROM citizens c
JOIN debts d ON c.id = d.citizen_id
LEFT JOIN analysis_results a ON d.id = a.debt_id
GROUP BY c.id
ORDER BY gemiddeld_risico DESC;
```

### Maatschappelijke kosten per domein
```sql
SELECT 
    SUM(a.healthcare_costs) as totaal_gezondheidszorg,
    SUM(a.employment_costs) as totaal_werkgelegenheid,
    SUM(a.debt_assistance_costs) as totaal_schuldhulp,
    SUM(a.domestic_violence_costs) as totaal_huiselijk_geweld,
    SUM(a.legal_costs) as totaal_juridisch,
    SUM(a.societal_costs_total) as totaal_maatschappelijk
FROM analysis_results a;
```

### ROI per organisatie
```sql
SELECT 
    o.name,
    COUNT(d.id) as aantal_schulden,
    SUM(d.amount) as totaal_schuld,
    SUM(a.collection_costs_total) as totaal_invoerkosten,
    SUM(a.estimated_total_savings) as totale_besparing,
    ROUND(SUM(a.estimated_total_savings) / NULLIF(SUM(d.amount), 0), 2) as roi_ratio
FROM organizations o
JOIN debts d ON o.id = d.organization_id
JOIN analysis_results a ON d.id = a.debt_id
GROUP BY o.id
ORDER BY totale_besparing DESC;
```

## Connection String

Voor backend integratie:
```
postgresql://localhost:5432/schulden
```

## Backup & Restore

```bash
# Backup
pg_dump schulden > schulden_backup.sql

# Restore
psql schulden < schulden_backup.sql
```

## Database Schema Diagram

```
organizations (1) ─── (N) debts (N) ─── (1) citizens
                           │
                           │
                          (1)
                           │
                  analysis_results
```

## Notes

- Alle bedragen in Euro's met 2 decimalen
- Risk score: 0-100 (hoger = kwetsbaarder)
- Success probability: 0.0-1.0 (decimaal percentage)
- Timestamps: automatisch bijgehouden
- Constraints: positive amounts, referential integrity

## CBS Statistics Data

### CBS Tables

De database bevat nu ook CBS statistieken over schuldenproblematiek in Nederland:

#### `cbs_ontwikkeling`
Ontwikkeling aantal schuldenaren 2015-2024
- 25 records met jaarlijkse cijfers
- Totaal huishoudens en instromers

#### `cbs_aantal_registraties`  
Verdeling schulden over aantal bronnen
- 84 records (2018-2024)
- 1 tot 10+ verschillende schuldbronnen per huishouden

#### `cbs_schuldregistraties`
Schuldregistraties per type/organisatie
- 94 records (2018-2024)
- BKR, ZvW, Belastingdienst, CJIB, DUO, etc.

### Key Statistics (2024)

| Metric | Aantal | Percentage |
|--------|--------|------------|
| **Totaal huishoudens met schulden** | 747,560 | 8.9% |
| Huishoudens zonder schulden | 7,628,340 | 91.1% |
| Nieuwe instromers 2024 | 138,760 | 1.9% |

### Top Schuldbronnen (2024)

| Rank | Bron | Huishoudens | % |
|------|------|-------------|---|
| 1 | Belastingdienst - overige aanslagen | 336,150 | 45.0% |
| 2 | BKR betalingsachterstand | 255,150 | 34.1% |
| 3 | Belastingdienst - toeslagen | 199,450 | 26.7% |
| 4 | ZvW wanbetaler | 196,110 | 26.2% |
| 5 | CJIB boetes | 127,760 | 17.1% |

### Risico Verdeling (Aantal Schuldbronnen)

| Bronnen | Huishoudens | % | Risico |
|---------|-------------|---|--------|
| 1 bron | 428,380 | 57.3% | Laag |
| 2-3 bronnen | 231,510 | 31.0% | Gemiddeld |
| 4-5 bronnen | 74,660 | 10.0% | Hoog |
| 6+ bronnen | 13,010 | 1.7% | Zeer hoog |

### CBS Views

```sql
-- Laatste statistieken
SELECT * FROM v_latest_stats;

-- Top schuldbronnen 2024
SELECT * FROM v_top_schuldbronnen_2024 LIMIT 10;

-- Trend over tijd
SELECT * FROM v_trend_schuldenaren;

-- Meerdere schulden met risico
SELECT * FROM v_meerdere_bronnen_2024;
```

### CBS Analysis Queries

```sql
-- Groei 2018-2024
SELECT 
    jaar,
    TO_CHAR(schuldenaren, 'FM999,999') as schuldenaren,
    aandeel_schuldenaren || '%' as percentage
FROM cbs_ontwikkeling
WHERE groep = 'Totaal huishoudens' 
  AND jaar IN ('2018', '2024-01');

-- Impact per schuldbron
SELECT 
    bron_label,
    aantal,
    ROUND(aantal * 13061.25) as geschatte_maatschappelijke_kosten_euro
FROM cbs_schuldregistraties
WHERE jaar = '2024-01'
ORDER BY aantal DESC
LIMIT 5;

-- Hoogrisico huishoudens (4+ schuldbronnen)
SELECT 
    SUM(aantal) as totaal_hoogrisico,
    ROUND(SUM(percentage), 1) || '%' as percentage
FROM cbs_aantal_registraties
WHERE jaar = '2024-01'
  AND aantal_bronnen IN ('4 bronnen', '5 bronnen', '6 bronnen', '7 bronnen', '8 bronnen', '9 bronnen', '10 bronnen');
```

## Combined Analysis

Combinatie van CBS data met simulatie resultaten:

```sql
-- Potentiële impact Smart Collection op CBS cijfers
WITH cbs_stats AS (
    SELECT schuldenaren FROM cbs_ontwikkeling 
    WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
),
sim_stats AS (
    SELECT 
        AVG(estimated_total_savings) as avg_saving_per_debt
    FROM analysis_results
    WHERE recommended_action = 'forgive'
)
SELECT 
    'Totaal schuldenaren' as metric,
    TO_CHAR(schuldenaren, 'FM999,999,999') as value
FROM cbs_stats
UNION ALL
SELECT 
    'Geschatte besparing bij 50% kwijtschelding',
    '€' || TO_CHAR(ROUND(schuldenaren * 0.5 * avg_saving_per_debt / 1000000), 'FM999,999') || 'M'
FROM cbs_stats, sim_stats;
```

