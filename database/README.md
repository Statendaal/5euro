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
