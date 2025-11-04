#!/usr/bin/env python3
"""
Extract training data from CBS database for ML model.
Creates synthetic training examples based on CBS characteristics data.
"""

import psycopg2
import pandas as pd
import numpy as np
from datetime import datetime

# Connect to database
conn = psycopg2.connect(
    dbname="schulden",
    user="marc",
    host="localhost"
)

print("Extracting CBS kenmerken data for training...")

# Query to get relevant characteristics that correlate with debt problems
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
    AND aantal IS NOT NULL
    AND percentage IS NOT NULL
ORDER BY gemeentecode, thema, label;
"""

df = pd.read_sql_query(query, conn)
print(f"Loaded {len(df)} CBS records")

# Pivot data to create features per municipality
print("Creating feature matrix...")

# Focus on key themes that predict debt success
key_features = df[df['thema'].isin([
    'Inkomen en vermogen',
    'Werk',
    'Sociale zekerheid',
    'Demografische kenmerken'
])].copy()

# Create aggregated features per municipality
features = key_features.groupby(['gemeentecode', 'gemeentenaam', 'jaar']).agg({
    'aantal': 'sum',
    'percentage': 'mean'
}).reset_index()

features.rename(columns={
    'aantal': 'total_debts',
    'percentage': 'avg_percentage'
}, inplace=True)

# Add income features
income_data = df[df['thema'] == 'Inkomen en vermogen'].groupby(['gemeentecode', 'jaar']).agg({
    'percentage': 'mean'
}).reset_index()
income_data.rename(columns={'percentage': 'income_risk'}, inplace=True)

features = features.merge(income_data, on=['gemeentecode', 'jaar'], how='left')

# Add employment features
work_data = df[df['thema'] == 'Werk'].groupby(['gemeentecode', 'jaar']).agg({
    'percentage': 'mean'
}).reset_index()
work_data.rename(columns={'percentage': 'unemployment_risk'}, inplace=True)

features = features.merge(work_data, on=['gemeentecode', 'jaar'], how='left')

# Add social security features
social_data = df[df['thema'] == 'Sociale zekerheid'].groupby(['gemeentecode', 'jaar']).agg({
    'percentage': 'mean'
}).reset_index()
social_data.rename(columns={'percentage': 'social_benefit_risk'}, inplace=True)

features = features.merge(social_data, on=['gemeentecode', 'jaar'], how='left')

print(f"Created feature matrix with {len(features)} municipalities")

# Generate synthetic training examples based on CBS patterns
print("Generating synthetic training examples...")

np.random.seed(42)
training_data = []

for _, row in features.iterrows():
    gemeente = row['gemeentenaam']

    # Generate multiple debt scenarios per municipality
    for _ in range(10):
        # Debt amount (skewed towards smaller amounts)
        debt_amount = np.random.lognormal(mean=3, sigma=1.5)
        debt_amount = max(10, min(10000, debt_amount))

        # Income (lower income = higher risk)
        base_income = 1500 if row['income_risk'] > 50 else 2500
        income = max(800, np.random.normal(base_income, 500))

        # Risk factors
        has_benefits = np.random.random() < (row['social_benefit_risk'] / 100)
        unemployed = np.random.random() < (row['unemployment_risk'] / 100)

        # Calculate success probability based on characteristics
        # Lower debt amount = higher success
        # Higher income = higher success
        # Benefits/unemployment = lower success

        debt_to_income_ratio = debt_amount / income

        success_score = 0.7  # Base success rate
        success_score -= min(0.4, debt_to_income_ratio * 0.3)  # Debt burden impact
        success_score -= 0.15 if has_benefits else 0
        success_score -= 0.15 if unemployed else 0
        success_score += 0.1 if debt_amount < 100 else 0
        success_score = max(0.1, min(0.95, success_score))

        # Determine recommended action based on success probability
        if success_score > 0.7 and debt_amount < 500:
            recommendation = 'FORGIVE'
        elif success_score < 0.3 or debt_to_income_ratio > 1.0:
            recommendation = 'REFER_TO_ASSISTANCE'
        elif has_benefits or unemployed:
            recommendation = 'PAYMENT_PLAN'
        else:
            recommendation = 'REMINDER'

        training_data.append({
            'debt_amount': round(debt_amount, 2),
            'monthly_income': round(income, 2),
            'has_social_benefits': has_benefits,
            'is_unemployed': unemployed,
            'debt_to_income_ratio': round(debt_to_income_ratio, 3),
            'income_risk': row['income_risk'],
            'unemployment_risk': row['unemployment_risk'],
            'social_benefit_risk': row['social_benefit_risk'],
            'municipality': gemeente,
            'success_probability': round(success_score, 3),
            'recommendation': recommendation
        })

training_df = pd.DataFrame(training_data)
print(f"Generated {len(training_df)} training examples")

# Show distribution
print("\nRecommendation distribution:")
print(training_df['recommendation'].value_counts())

print("\nDebt amount statistics:")
print(training_df['debt_amount'].describe())

# Save training data
output_file = 'training_data.csv'
training_df.to_csv(output_file, index=False)
print(f"\nTraining data saved to {output_file}")

conn.close()
