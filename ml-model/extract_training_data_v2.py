"""
Enhanced Training Data Generator - Version 2
Gebruikt meer CBS patronen voor realistischere synthetische data
"""

import psycopg2
import pandas as pd
import numpy as np
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    dbname="schulden",
    user="marc",
    host="localhost"
)

print("=" * 80)
print("Enhanced Training Data Generator - Version 2")
print("=" * 80)
print()

# Query CBS data met meer detail
query = """
SELECT
    jaar,
    gemeentecode,
    gemeentenaam,
    thema,
    hoofdthema,
    label,
    kenmerken_cat,
    aantal,
    percentage,
    schuldenaren
FROM cbs_kenmerken
WHERE jaar IN ('2023-01', '2024-01')
    AND schuldenaren LIKE '%Met geregistreerde%'
    AND percentage IS NOT NULL
"""

print("📊 Loading CBS data...")
df = pd.read_sql_query(query, conn)
print(f"   Loaded {len(df):,} CBS records")
print()

# === STAP 1: Extract Gedetailleerde Patronen Per Gemeente ===
print("🔍 Extracting detailed patterns per municipality...")

gemeenten = df[['gemeentecode', 'gemeentenaam']].drop_duplicates()

# Inkomen patronen
print("   - Income patterns...")
income_low = df[df['label'] == 'Laag huishoudinkomen'].groupby('gemeentecode')['percentage'].mean()

# Werk patronen
print("   - Employment patterns...")
werkloosheid = df[df['label'] == 'Werkzoekende in huishouden'].groupby('gemeentecode')['percentage'].mean()
flexwerk = df[df['label'] == 'Flexibel contract in huishouden'].groupby('gemeentecode')['percentage'].mean()
zzp_laaginkomen = df[df['label'] == 'ZZP-er in huishouden en laag huishoudinkomen'].groupby('gemeentecode')['percentage'].mean()

# Uitkeringen
print("   - Benefit patterns...")
bijstand = df[df['label'] == 'Bijstandsuitkering in huishouden'].groupby('gemeentecode')['percentage'].mean()
ww = df[df['label'] == 'WW-uitkering in huishouden'].groupby('gemeentecode')['percentage'].mean()
ao = df[df['label'] == 'AO- of ziektewetuitkering in huishouden'].groupby('gemeentecode')['percentage'].mean()

# Huishouden kenmerken
print("   - Household patterns...")
eenouder = df[df['kenmerken_cat'] == '4 Eenouderhuishouden'].groupby('gemeentecode')['percentage'].mean()
kinderen = df[df['label'] == 'Aantal kinderen in huishouden'].groupby('gemeentecode')['percentage'].mean()

# Jeugdzorg (extra risicofactor)
print("   - Youth care patterns...")
jeugdzorg = df[df['label'] == 'Jeugdhulp, -bescherming en/of -reclassering in huishouden'].groupby('gemeentecode')['percentage'].mean()

# Leeftijd patronen
print("   - Age patterns...")
leeftijd_data = df[df['label'] == 'Leeftijd geselecteerd huishoudlid'].copy()
leeftijd_jong = leeftijd_data[leeftijd_data['kenmerken_cat'].str.contains('16 tot 25|25 tot 35', na=False)].groupby('gemeentecode')['percentage'].mean()
leeftijd_mid = leeftijd_data[leeftijd_data['kenmerken_cat'].str.contains('35 tot 45|45 tot 55', na=False)].groupby('gemeentecode')['percentage'].mean()
leeftijd_oud = leeftijd_data[leeftijd_data['kenmerken_cat'].str.contains('55 tot 65|65 jaar', na=False)].groupby('gemeentecode')['percentage'].mean()

# Combine alle patronen
features = pd.DataFrame({
    'gemeentecode': gemeenten['gemeentecode'],
    'gemeentenaam': gemeenten['gemeentenaam'],
    'income_low_pct': gemeenten['gemeentecode'].map(income_low).fillna(30),
    'werkloosheid_pct': gemeenten['gemeentecode'].map(werkloosheid).fillna(45),
    'flexwerk_pct': gemeenten['gemeentecode'].map(flexwerk).fillna(45),
    'zzp_laaginkomen_pct': gemeenten['gemeentecode'].map(zzp_laaginkomen).fillna(30),
    'bijstand_pct': gemeenten['gemeentecode'].map(bijstand).fillna(45),
    'ww_pct': gemeenten['gemeentecode'].map(ww).fillna(45),
    'ao_pct': gemeenten['gemeentecode'].map(ao).fillna(45),
    'eenouder_pct': gemeenten['gemeentecode'].map(eenouder).fillna(15),
    'kinderen_pct': gemeenten['gemeentecode'].map(kinderen).fillna(25),
    'jeugdzorg_pct': gemeenten['gemeentecode'].map(jeugdzorg).fillna(45),
    'leeftijd_jong_pct': gemeenten['gemeentecode'].map(leeftijd_jong).fillna(20),
    'leeftijd_mid_pct': gemeenten['gemeentecode'].map(leeftijd_mid).fillna(45),
    'leeftijd_oud_pct': gemeenten['gemeentecode'].map(leeftijd_oud).fillna(35),
})

print(f"   Created {len(features)} municipality profiles")
print()

# === STAP 2: Genereer Realistischere Cases ===
print("🎲 Generating realistic debt cases...")
print()

np.random.seed(42)
training_data = []

# Meer cases per gemeente voor betere diversiteit
cases_per_gemeente = 15

for idx, row in features.iterrows():
    if idx % 100 == 0:
        print(f"   Processing gemeente {idx}/{len(features)}...")

    gemeente = row['gemeentenaam']

    for case_num in range(cases_per_gemeente):
        # === Leeftijd (beïnvloedt inkomen en schuld) ===
        # Normaliseer percentages zodat ze optellen tot 1
        age_probs = np.array([
            row['leeftijd_jong_pct'],
            row['leeftijd_mid_pct'],
            row['leeftijd_oud_pct']
        ])
        age_probs = age_probs / age_probs.sum()  # Normaliseer naar som=1

        age_category = np.random.choice(
            ['jong', 'mid', 'oud'],
            p=age_probs
        )

        # === Schuldbedrag (realistischer verdeeld) ===
        # Kleine schulden (< €100) komen het meest voor
        # Grote schulden (> €1000) zijn zeldzaam
        if np.random.random() < 0.60:  # 60% kleine schulden
            debt_amount = np.random.lognormal(mean=2.5, sigma=0.8)  # €10-€150
        elif np.random.random() < 0.30:  # 30% medium schulden
            debt_amount = np.random.lognormal(mean=4.5, sigma=0.6)  # €150-€1000
        else:  # 10% grote schulden
            debt_amount = np.random.lognormal(mean=6.0, sigma=0.8)  # €1000-€5000

        debt_amount = max(10, min(10000, debt_amount))

        # === Inkomen (afhankelijk van leeftijd en gemeente) ===
        base_income = 2200  # Modaal

        # Leeftijd impact
        if age_category == 'jong':
            base_income *= 0.7  # Jonger = lager inkomen
        elif age_category == 'oud':
            base_income *= 0.85  # Pensioen = lager inkomen

        # Gemeente risico impact
        if row['income_low_pct'] > 35:
            base_income *= 0.75  # Hoog risico gemeente
        elif row['income_low_pct'] < 25:
            base_income *= 1.15  # Laag risico gemeente

        income = max(800, np.random.normal(base_income, 400))

        # === Uitkering Type (meerdere types mogelijk) ===
        has_bijstand = np.random.random() < (row['bijstand_pct'] / 100)
        has_ww = np.random.random() < (row['ww_pct'] / 100)
        has_ao = np.random.random() < (row['ao_pct'] / 100)

        # Als uitkering, aanpassen inkomen
        if has_bijstand:
            income = min(income, 1300)  # Bijstandsniveau
        elif has_ww:
            income = min(income, 1800)  # WW niveau
        elif has_ao:
            income = min(income, 1600)  # AO niveau

        has_social_benefits = has_bijstand or has_ww or has_ao

        # === Werk Status ===
        is_unemployed = has_ww or (np.random.random() < (row['werkloosheid_pct'] / 100))
        has_flex_work = not is_unemployed and (np.random.random() < (row['flexwerk_pct'] / 100))
        is_zzp = not is_unemployed and not has_flex_work and (np.random.random() < 0.15)

        # === Huishouden Situatie ===
        is_single_parent = np.random.random() < (row['eenouder_pct'] / 100)
        has_children = is_single_parent or (np.random.random() < (row['kinderen_pct'] / 100))
        num_children = np.random.choice([1, 2, 3], p=[0.5, 0.35, 0.15]) if has_children else 0

        # === Extra Risicofactoren ===
        has_jeugdzorg = has_children and (np.random.random() < (row['jeugdzorg_pct'] / 100))

        # Aantal andere schulden (gecorreleerd met risicofactoren)
        other_debts_prob = 0.2
        if has_social_benefits:
            other_debts_prob += 0.2
        if is_unemployed:
            other_debts_prob += 0.15
        if has_jeugdzorg:
            other_debts_prob += 0.15
        if debt_amount > 500:
            other_debts_prob += 0.1

        other_debts_count = np.random.poisson(other_debts_prob * 3)
        other_debts_count = min(5, other_debts_count)

        # === Berekende Features ===
        debt_to_income_ratio = debt_amount / income

        # === Successkans Berekening (verfijnd) ===
        success_score = 0.65  # Basis

        # Schuld impact (niet-lineair)
        if debt_amount < 50:
            success_score += 0.15
        elif debt_amount < 100:
            success_score += 0.10
        elif debt_amount > 1000:
            success_score -= 0.20

        # Schuld/inkomen ratio (sterke impact)
        if debt_to_income_ratio < 0.05:
            success_score += 0.15
        elif debt_to_income_ratio < 0.20:
            success_score += 0.05
        elif debt_to_income_ratio > 1.0:
            success_score -= 0.30
        elif debt_to_income_ratio > 0.5:
            success_score -= 0.15

        # Sociale factoren
        if has_bijstand:
            success_score -= 0.18
        if has_ww:
            success_score -= 0.12
        if has_ao:
            success_score -= 0.15
        if is_unemployed:
            success_score -= 0.10

        # Huishouden factoren
        if is_single_parent:
            success_score -= 0.12
        if num_children >= 2:
            success_score -= 0.08
        if has_jeugdzorg:
            success_score -= 0.15

        # Werk factoren
        if has_flex_work:
            success_score -= 0.05  # Minder zekerheid
        if is_zzp and debt_to_income_ratio > 0.3:
            success_score -= 0.10  # ZZP met hoge schuld

        # Meerdere schulden
        success_score -= other_debts_count * 0.06

        # Leeftijd
        if age_category == 'jong':
            success_score -= 0.05  # Jonger = meer risico
        elif age_category == 'oud':
            success_score += 0.05  # Ouder = stabieler

        # Normaliseer
        success_score = max(0.05, min(0.95, success_score))

        # === Aanbeveling (verfijnd) ===
        # Kwijtschelding: kleine schuld + goede kans
        if debt_amount < 100 and success_score > 0.70:
            recommendation = 'FORGIVE'

        # Doorverwijzing: complex of zeer lage kans
        elif (success_score < 0.25 or
              debt_to_income_ratio > 1.5 or
              (has_jeugdzorg and debt_amount > 200) or
              other_debts_count >= 3):
            recommendation = 'REFER_TO_ASSISTANCE'

        # Betalingsregeling: kwetsbaar maar kansrijk
        elif (has_social_benefits or
              is_single_parent or
              (0.3 < success_score < 0.70) or
              (debt_to_income_ratio > 0.3 and success_score > 0.4)):
            recommendation = 'PAYMENT_PLAN'

        # Standaard invordering: stabiel en overzichtelijk
        else:
            recommendation = 'REMINDER'

        # === Opslaan ===
        training_data.append({
            'debt_amount': round(debt_amount, 2),
            'monthly_income': round(income, 2),
            'has_social_benefits': has_social_benefits,
            'benefit_type': 'bijstand' if has_bijstand else ('ww' if has_ww else ('ao' if has_ao else 'none')),
            'is_unemployed': is_unemployed,
            'has_flex_work': has_flex_work,
            'is_zzp': is_zzp,
            'is_single_parent': is_single_parent,
            'has_children': has_children,
            'num_children': num_children,
            'has_jeugdzorg': has_jeugdzorg,
            'age_category': age_category,
            'debt_to_income_ratio': round(debt_to_income_ratio, 3),
            'other_debts_count': other_debts_count,
            'income_risk': row['income_low_pct'],
            'unemployment_risk': row['werkloosheid_pct'],
            'social_benefit_risk': row['bijstand_pct'],
            'municipality': gemeente,
            'success_probability': round(success_score, 3),
            'recommendation': recommendation
        })

print(f"   Generated {len(training_data):,} training examples")
print()

# === STAP 3: Analyse en Opslaan ===
print("📈 Analyzing generated data...")
training_df = pd.DataFrame(training_data)

print(f"\nDataset Statistics:")
print(f"  Total cases: {len(training_df):,}")
print(f"  Municipalities: {training_df['municipality'].nunique()}")
print(f"\nDebt Amount Distribution:")
print(f"  < €100: {(training_df['debt_amount'] < 100).sum():,} ({(training_df['debt_amount'] < 100).mean()*100:.1f}%)")
print(f"  €100-€500: {((training_df['debt_amount'] >= 100) & (training_df['debt_amount'] < 500)).sum():,}")
print(f"  €500-€1000: {((training_df['debt_amount'] >= 500) & (training_df['debt_amount'] < 1000)).sum():,}")
print(f"  > €1000: {(training_df['debt_amount'] >= 1000).sum():,}")
print(f"\nIncome Distribution:")
print(f"  < €1500: {(training_df['monthly_income'] < 1500).sum():,} ({(training_df['monthly_income'] < 1500).mean()*100:.1f}%)")
print(f"  €1500-€2500: {((training_df['monthly_income'] >= 1500) & (training_df['monthly_income'] < 2500)).sum():,}")
print(f"  > €2500: {(training_df['monthly_income'] >= 2500).sum():,}")
print(f"\nSocial Factors:")
print(f"  Has benefits: {training_df['has_social_benefits'].sum():,} ({training_df['has_social_benefits'].mean()*100:.1f}%)")
print(f"  Unemployed: {training_df['is_unemployed'].sum():,} ({training_df['is_unemployed'].mean()*100:.1f}%)")
print(f"  Single parent: {training_df['is_single_parent'].sum():,} ({training_df['is_single_parent'].mean()*100:.1f}%)")
print(f"  Has jeugdzorg: {training_df['has_jeugdzorg'].sum():,} ({training_df['has_jeugdzorg'].mean()*100:.1f}%)")
print(f"\nRecommendation Distribution:")
print(training_df['recommendation'].value_counts())
print(f"\nSuccess Probability:")
print(training_df['success_probability'].describe())

# Opslaan
output_file = 'training_data_v2.csv'
training_df.to_csv(output_file, index=False)
print(f"\n✅ Saved to: {output_file}")
print()
print("=" * 80)
print("Klaar! Run nu: python3 train_model_v2.py")
print("=" * 80)

conn.close()
