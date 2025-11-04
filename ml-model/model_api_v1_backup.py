#!/usr/bin/env python3
"""
FastAPI service for ML-based debt collection predictions.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import joblib
import numpy as np
import json
from enum import Enum

# Load model artifacts
model = joblib.load('debt_model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoder = joblib.load('label_encoder.pkl')

with open('model_config.json', 'r') as f:
    config = json.load(f)

app = FastAPI(
    title="Smart Collection ML API",
    description="ML-powered debt collection recommendation API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IncomeSource(str, Enum):
    BENEFIT_SOCIAL = "BENEFIT_SOCIAL"
    BENEFIT_UNEMPLOYMENT = "BENEFIT_UNEMPLOYMENT"
    BENEFIT_DISABILITY = "BENEFIT_DISABILITY"
    EMPLOYMENT = "EMPLOYMENT"
    SELF_EMPLOYED = "SELF_EMPLOYED"
    PENSION = "PENSION"
    OTHER = "OTHER"

class DebtType(str, Enum):
    CAK_EIGEN_BIJDRAGE = "CAK_EIGEN_BIJDRAGE"
    HEALTHCARE_INSURANCE = "HEALTHCARE_INSURANCE"
    TAX = "TAX"
    MUNICIPALITY = "MUNICIPALITY"
    UTILITIES = "UTILITIES"
    OTHER = "OTHER"

class PredictionRequest(BaseModel):
    debt_amount: float = Field(..., gt=0, description="Debt amount in euros")
    monthly_income: float = Field(..., gt=0, description="Monthly income in euros")
    income_source: IncomeSource = Field(..., description="Source of income")
    has_children: bool = Field(default=False, description="Has children")
    in_debt_assistance: bool = Field(default=False, description="Currently in debt assistance")
    other_debts_count: int = Field(default=0, ge=0, description="Number of other debts")
    debt_type: Optional[DebtType] = Field(default=None, description="Type of debt")

class PredictionResponse(BaseModel):
    recommendation: str = Field(..., description="Recommended action")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    probabilities: Dict[str, float] = Field(..., description="Probabilities for each action")
    features_used: Dict[str, Any] = Field(..., description="Input features used")
    ml_model_info: Dict[str, Any] = Field(..., description="Model metadata")

@app.get("/")
def root():
    return {
        "service": "Smart Collection ML API",
        "version": "1.0.0",
        "status": "online",
        "model_accuracy": config['accuracy'],
        "available_actions": config['classes']
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Predict the best debt collection action based on citizen characteristics.
    """
    try:
        # Calculate derived features
        debt_to_income_ratio = request.debt_amount / request.monthly_income

        # Map income source to risk factors
        has_social_benefits = request.income_source in [
            IncomeSource.BENEFIT_SOCIAL,
            IncomeSource.BENEFIT_UNEMPLOYMENT,
            IncomeSource.BENEFIT_DISABILITY
        ]

        is_unemployed = request.income_source == IncomeSource.BENEFIT_UNEMPLOYMENT

        # Estimate CBS risk factors based on income source and debt characteristics
        if has_social_benefits:
            income_risk = 75.0
            social_benefit_risk = 80.0
        else:
            income_risk = 30.0
            social_benefit_risk = 20.0

        if is_unemployed:
            unemployment_risk = 85.0
        else:
            unemployment_risk = 15.0

        # Adjust risk based on debt burden
        if debt_to_income_ratio > 0.5:
            income_risk = min(95.0, income_risk + 20)

        if request.other_debts_count > 2:
            income_risk = min(95.0, income_risk + 10)
            social_benefit_risk = min(95.0, social_benefit_risk + 10)

        # Prepare features for model
        features = np.array([[
            request.debt_amount,
            request.monthly_income,
            float(has_social_benefits),
            float(is_unemployed),
            debt_to_income_ratio,
            income_risk,
            unemployment_risk,
            social_benefit_risk
        ]])

        # Scale features
        features_scaled = scaler.transform(features)

        # Make prediction
        prediction = model.predict(features_scaled)
        probabilities = model.predict_proba(features_scaled)[0]

        recommended_action = label_encoder.inverse_transform(prediction)[0]
        confidence = float(probabilities.max())

        # Create probability dict
        prob_dict = {
            label: float(prob)
            for label, prob in zip(label_encoder.classes_, probabilities)
        }

        return PredictionResponse(
            recommendation=recommended_action,
            confidence=confidence,
            probabilities=prob_dict,
            features_used={
                "debt_amount": request.debt_amount,
                "monthly_income": request.monthly_income,
                "has_social_benefits": has_social_benefits,
                "is_unemployed": is_unemployed,
                "debt_to_income_ratio": round(debt_to_income_ratio, 3),
                "income_risk": income_risk,
                "unemployment_risk": unemployment_risk,
                "social_benefit_risk": social_benefit_risk,
                "other_debts_count": request.other_debts_count,
                "in_debt_assistance": request.in_debt_assistance
            },
            ml_model_info={
                "accuracy": config['accuracy'],
                "cv_mean": config['cv_mean'],
                "feature_importance_top": "debt_amount, has_social_benefits, debt_to_income_ratio"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/batch-predict")
def batch_predict(requests: List[PredictionRequest]):
    """
    Make predictions for multiple cases at once.
    """
    results = []
    for req in requests:
        try:
            result = predict(req)
            results.append(result)
        except Exception as e:
            results.append({"error": str(e)})

    return {"predictions": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
