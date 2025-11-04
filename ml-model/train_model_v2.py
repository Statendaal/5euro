"""
Train ML Model - Version 2
Uses enhanced training data with more CBS patterns
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import json

print("=" * 80)
print("ML Model Training - Version 2")
print("=" * 80)
print()

# Load training data
print("📊 Loading training data V2...")
df = pd.read_csv('training_data_v2.csv')
print(f"   Loaded {len(df):,} examples")
print(f"   Features: {df.columns.tolist()}")
print()

# Analyze data
print("📈 Data Distribution:")
print(f"   Municipalities: {df['municipality'].nunique()}")
print(f"\n   Debt amounts:")
print(f"   - Mean: €{df['debt_amount'].mean():.2f}")
print(f"   - Median: €{df['debt_amount'].median():.2f}")
print(f"   - Min: €{df['debt_amount'].min():.2f}")
print(f"   - Max: €{df['debt_amount'].max():.2f}")
print(f"\n   Income:")
print(f"   - Mean: €{df['monthly_income'].mean():.2f}")
print(f"   - Median: €{df['monthly_income'].median():.2f}")
print(f"\n   Recommendations:")
for rec, count in df['recommendation'].value_counts().items():
    print(f"   - {rec}: {count:,} ({count/len(df)*100:.1f}%)")
print()

# Select features for training
feature_columns = [
    'debt_amount',
    'monthly_income',
    'has_social_benefits',
    'is_unemployed',
    'has_flex_work',
    'is_zzp',
    'is_single_parent',
    'has_children',
    'num_children',
    'has_jeugdzorg',
    'debt_to_income_ratio',
    'other_debts_count',
    'income_risk',
    'unemployment_risk',
    'social_benefit_risk'
]

# Age category encoding
print("🔧 Encoding categorical features...")
df['age_jong'] = (df['age_category'] == 'jong').astype(int)
df['age_oud'] = (df['age_category'] == 'oud').astype(int)
# age_mid is baseline (both 0)

feature_columns.extend(['age_jong', 'age_oud'])

# Benefit type encoding
df['benefit_bijstand'] = (df['benefit_type'] == 'bijstand').astype(int)
df['benefit_ww'] = (df['benefit_type'] == 'ww').astype(int)
df['benefit_ao'] = (df['benefit_type'] == 'ao').astype(int)

feature_columns.extend(['benefit_bijstand', 'benefit_ww', 'benefit_ao'])

print(f"   Using {len(feature_columns)} features")
print()

# Prepare data
X = df[feature_columns].values
y = df['recommendation'].values

# Encode labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print("🎯 Target distribution:")
for i, label in enumerate(label_encoder.classes_):
    count = (y_encoded == i).sum()
    print(f"   {label}: {count:,} ({count/len(y_encoded)*100:.1f}%)")
print()

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"📦 Data split:")
print(f"   Training: {len(X_train):,} examples")
print(f"   Testing: {len(X_test):,} examples")
print()

# Scale features
print("⚖️  Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print()

# Train model
print("🎓 Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=200,      # More trees for better performance
    max_depth=15,          # Deeper trees for complex patterns
    min_samples_split=5,   # Prevent overfitting
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,             # Use all CPU cores
    class_weight='balanced' # Handle imbalanced classes
)

model.fit(X_train_scaled, y_train)
print("   ✅ Model trained")
print()

# Evaluate on test set
print("📊 Test Set Performance:")
y_pred = model.predict(X_test_scaled)
test_accuracy = (y_pred == y_test).mean()
print(f"   Accuracy: {test_accuracy*100:.2f}%")
print()

# Detailed classification report
print("📋 Classification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=label_encoder.classes_,
    digits=3
))

# Confusion Matrix
print("🔢 Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print("Predicted →")
print("Actual ↓")
cm_df = pd.DataFrame(
    cm,
    index=label_encoder.classes_,
    columns=label_encoder.classes_
)
print(cm_df)
print()

# Cross-validation
print("🔄 Cross-Validation (5-fold):")
cv_scores = cross_val_score(
    model, X_train_scaled, y_train, cv=5, n_jobs=-1
)
print(f"   Scores: {cv_scores}")
print(f"   Mean: {cv_scores.mean()*100:.2f}%")
print(f"   Std: {cv_scores.std()*100:.2f}%")
print()

# Feature importance
print("🔍 Feature Importance (Top 15):")
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(15).iterrows():
    bar_length = int(row['importance'] * 50)
    bar = '█' * bar_length
    print(f"   {row['feature']:30s} {bar} {row['importance']*100:.2f}%")
print()

# Save model
print("💾 Saving model artifacts...")

# Save model
joblib.dump(model, 'debt_model_v2.joblib')
print("   ✅ Model saved: debt_model_v2.joblib")

# Save scaler
joblib.dump(scaler, 'scaler_v2.joblib')
print("   ✅ Scaler saved: scaler_v2.joblib")

# Save label encoder
joblib.dump(label_encoder, 'label_encoder_v2.joblib')
print("   ✅ Label encoder saved: label_encoder_v2.joblib")

# Save feature names
with open('feature_names_v2.json', 'w') as f:
    json.dump(feature_columns, f, indent=2)
print("   ✅ Feature names saved: feature_names_v2.json")

# Save model metadata
metadata = {
    'version': '2.0',
    'training_date': pd.Timestamp.now().isoformat(),
    'training_samples': len(X_train),
    'test_samples': len(X_test),
    'test_accuracy': float(test_accuracy),
    'cv_mean': float(cv_scores.mean()),
    'cv_std': float(cv_scores.std()),
    'features': feature_columns,
    'n_features': len(feature_columns),
    'classes': label_encoder.classes_.tolist(),
    'model_params': {
        'n_estimators': 200,
        'max_depth': 15,
        'min_samples_split': 5,
        'min_samples_leaf': 2
    },
    'improvements_v2': [
        'Added age categories (jong/mid/oud)',
        'Added benefit types (bijstand/ww/ao)',
        'Added household features (single_parent, children, jeugdzorg)',
        'Added work details (flex, zzp)',
        'More nuanced success probability calculation',
        'Based on 14 CBS patterns (was 3 in V1)'
    ],
    'feature_importance_top5': feature_importance.head(5).to_dict('records')
}

with open('model_metadata_v2.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("   ✅ Metadata saved: model_metadata_v2.json")
print()

# Model comparison with V1 (if exists)
import os
if os.path.exists('debt_model.joblib'):
    print("📊 Comparing with V1 Model:")
    v1_model = joblib.load('debt_model.joblib')
    v1_scaler = joblib.load('scaler.joblib')
    v1_encoder = joblib.load('label_encoder.joblib')

    # Get V1 feature names
    with open('feature_names.json', 'r') as f:
        v1_features = json.load(f)

    # Extract common features from V2 data
    common_features = [f for f in v1_features if f in df.columns]
    X_v1_format = df[common_features].values
    X_v1_scaled = v1_scaler.transform(X_v1_format)

    # Compare predictions
    v1_pred = v1_model.predict(X_v1_scaled)
    v2_pred = model.predict(scaler.transform(df[feature_columns].values))

    # Map V1 predictions to labels
    v1_pred_labels = v1_encoder.inverse_transform(v1_pred)
    v2_pred_labels = label_encoder.inverse_transform(v2_pred)

    print(f"\n   V1 Predictions:")
    v1_dist = pd.Series(v1_pred_labels).value_counts(normalize=True) * 100
    for label, pct in v1_dist.items():
        print(f"   - {label}: {pct:.1f}%")

    print(f"\n   V2 Predictions:")
    v2_dist = pd.Series(v2_pred_labels).value_counts(normalize=True) * 100
    for label, pct in v2_dist.items():
        print(f"   - {label}: {pct:.1f}%")

    print(f"\n   Agreement: {(v1_pred_labels == v2_pred_labels).mean()*100:.1f}%")
    print()

print("=" * 80)
print("✅ Model V2 Training Complete!")
print("=" * 80)
print()
print("Next steps:")
print("  1. Test model: python3 test_model_v2.py")
print("  2. Update ML API to use V2 model")
print("  3. Restart backend and test predictions")
print()
