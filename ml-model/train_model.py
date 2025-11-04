#!/usr/bin/env python3
"""
Train ML model for debt collection recommendation.
Uses Random Forest classifier to predict best action.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import json

print("Loading training data...")
df = pd.read_csv('training_data.csv')

print(f"Dataset: {len(df)} examples")
print(f"Features: {df.columns.tolist()}")

# Prepare features
feature_columns = [
    'debt_amount',
    'monthly_income',
    'has_social_benefits',
    'is_unemployed',
    'debt_to_income_ratio',
    'income_risk',
    'unemployment_risk',
    'social_benefit_risk'
]

X = df[feature_columns].copy()
y = df['recommendation'].copy()

# Encode target labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"\nTarget classes: {label_encoder.classes_}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"Training set: {len(X_train)} examples")
print(f"Test set: {len(X_test)} examples")

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
print("\nTraining Random Forest model...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)

model.fit(X_train_scaled, y_train)

# Evaluate model
print("\nEvaluating model...")
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.3f}")

# Cross-validation
cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
print(f"Cross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Confusion matrix
print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
cm_df = pd.DataFrame(cm, index=label_encoder.classes_, columns=label_encoder.classes_)
print(cm_df)

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

# Save model and preprocessing objects
print("\nSaving model...")
joblib.dump(model, 'debt_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')

# Save feature columns for inference
with open('model_config.json', 'w') as f:
    json.dump({
        'feature_columns': feature_columns,
        'classes': label_encoder.classes_.tolist(),
        'accuracy': float(accuracy),
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std())
    }, f, indent=2)

print("\nModel artifacts saved:")
print("  - debt_model.pkl")
print("  - scaler.pkl")
print("  - label_encoder.pkl")
print("  - model_config.json")

# Test with example predictions
print("\n" + "="*60)
print("Example Predictions:")
print("="*60)

test_cases = [
    {
        'debt_amount': 15,
        'monthly_income': 1200,
        'has_social_benefits': True,
        'is_unemployed': False,
        'debt_to_income_ratio': 0.0125,
        'income_risk': 60,
        'unemployment_risk': 40,
        'social_benefit_risk': 70,
        'description': 'Klein schuld (€15), bijstand, laag inkomen'
    },
    {
        'debt_amount': 500,
        'monthly_income': 3500,
        'has_social_benefits': False,
        'is_unemployed': False,
        'debt_to_income_ratio': 0.143,
        'income_risk': 20,
        'unemployment_risk': 10,
        'social_benefit_risk': 15,
        'description': 'Middel schuld (€500), goed inkomen, geen uitkering'
    },
    {
        'debt_amount': 2000,
        'monthly_income': 1000,
        'has_social_benefits': True,
        'is_unemployed': True,
        'debt_to_income_ratio': 2.0,
        'income_risk': 85,
        'unemployment_risk': 90,
        'social_benefit_risk': 80,
        'description': 'Grote schuld (€2000), zeer laag inkomen, werkloos'
    }
]

for i, case in enumerate(test_cases, 1):
    print(f"\nTest Case {i}: {case['description']}")

    # Prepare features
    features = np.array([[
        case['debt_amount'],
        case['monthly_income'],
        case['has_social_benefits'],
        case['is_unemployed'],
        case['debt_to_income_ratio'],
        case['income_risk'],
        case['unemployment_risk'],
        case['social_benefit_risk']
    ]])

    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    probabilities = model.predict_proba(features_scaled)[0]

    predicted_action = label_encoder.inverse_transform(prediction)[0]

    print(f"  Predicted Action: {predicted_action}")
    print(f"  Probabilities:")
    for cls, prob in zip(label_encoder.classes_, probabilities):
        print(f"    {cls}: {prob:.3f}")

print("\n" + "="*60)
print("Model training complete!")
