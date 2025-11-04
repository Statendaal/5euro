"""FastAPI service for ML-based debt collection predictions - V2."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import joblib
import numpy as np
import json
from enum import Enum

# Load model artifacts (V2)
model = joblib.load('debt_model_v2.joblib')
scaler = joblib.load('scaler_v2.joblib')
label_encoder = joblib.load('label_encoder_v2.joblib')
with open('feature_names_v2.json', 'r') as f:
    feature_names = json.load(f)
with open('model_metadata_v2.json', 'r') as f:
    config = json.load(f)

app = FastAPI(
    title="Smart Collection ML API V2",
    description="ML-powered debt collection recommendation API with enhanced CBS patterns",
    version="2.0.0"
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
    num_children: int = Field(default=0, ge=0, description="Number of children")
    is_single_parent: bool = Field(default=False, description="Is single parent")
    has_jeugdzorg: bool = Field(default=False, description="Has youth care")
    in_debt_assistance: bool = Field(default=False, description="Currently in debt assistance")
    other_debts_count: int = Field(default=0, ge=0, description="Number of other debts")
    age_category: Optional[str] = Field(default="mid", description="Age category: jong/mid/oud")
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
        "service": "Smart Collection ML API V2",
        "version": "2.0.0",
        "status": "online",
        "model_accuracy": config.get('test_accuracy', 'N/A'),
        "model_features": len(feature_names),
        "training_examples": config.get('training_size', 'N/A'),
        "available_actions": list(label_encoder.classes_)
    }

@app.get("/health")
def health():
    return {"status": "healthy", "version": "2.0.0"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Predict the best debt collection action based on citizen characteristics.
    Uses V2 model with 18 features based on enhanced CBS patterns.
    """
    try:
        # Calculate derived features
        debt_to_income_ratio = request.debt_amount / request.monthly_income

        # Map income source to risk factors and detailed categories
        has_social_benefits = request.income_source in [
            IncomeSource.BENEFIT_SOCIAL,
            IncomeSource.BENEFIT_UNEMPLOYMENT,
            IncomeSource.BENEFIT_DISABILITY
        ]

        is_unemployed = request.income_source == IncomeSource.BENEFIT_UNEMPLOYMENT
        has_flex_work = request.income_source == IncomeSource.SELF_EMPLOYED
        is_zzp = request.income_source == IncomeSource.SELF_EMPLOYED

        # Determine benefit type
        benefit_bijstand = 1 if request.income_source == IncomeSource.BENEFIT_SOCIAL else 0
        benefit_ww = 1 if request.income_source == IncomeSource.BENEFIT_UNEMPLOYMENT else 0
        benefit_ao = 1 if request.income_source == IncomeSource.BENEFIT_DISABILITY else 0

        # Age category encoding
        age_jong = 1 if request.age_category == "jong" else 0
        age_oud = 1 if request.age_category == "oud" else 0

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

        # V2 features (18 total, matching training):
        # ['debt_amount', 'monthly_income', 'has_social_benefits', 'is_unemployed',
        #  'has_flex_work', 'is_zzp', 'is_single_parent', 'has_children', 'num_children',
        #  'has_jeugdzorg', 'debt_to_income_ratio', 'other_debts_count',
        #  'income_risk', 'unemployment_risk', 'social_benefit_risk',
        #  'age_jong', 'age_oud', 'benefit_bijstand', 'benefit_ww', 'benefit_ao']

        features = np.array([[
            request.debt_amount,
            request.monthly_income,
            float(has_social_benefits),
            float(is_unemployed),
            float(has_flex_work),
            float(is_zzp),
            float(request.is_single_parent),
            float(request.has_children),
            float(request.num_children),
            float(request.has_jeugdzorg),
            debt_to_income_ratio,
            float(request.other_debts_count),
            income_risk,
            unemployment_risk,
            social_benefit_risk,
            float(age_jong),
            float(age_oud),
            float(benefit_bijstand),
            float(benefit_ww),
            float(benefit_ao)
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
                "has_flex_work": has_flex_work,
                "is_zzp": is_zzp,
                "is_single_parent": request.is_single_parent,
                "has_children": request.has_children,
                "num_children": request.num_children,
                "has_jeugdzorg": request.has_jeugdzorg,
                "debt_to_income_ratio": round(debt_to_income_ratio, 3),
                "other_debts_count": request.other_debts_count,
                "income_risk": income_risk,
                "unemployment_risk": unemployment_risk,
                "social_benefit_risk": social_benefit_risk,
                "age_category": request.age_category,
                "benefit_type": {
                    "bijstand": benefit_bijstand,
                    "ww": benefit_ww,
                    "ao": benefit_ao
                }
            },
            ml_model_info={
                "version": "2.0",
                "accuracy": config.get('test_accuracy', 'N/A'),
                "cv_mean": config.get('cv_mean', 'N/A'),
                "cv_std": config.get('cv_std', 'N/A'),
                "features_count": 20,
                "training_examples": config.get('training_size', 'N/A'),
                "cbs_patterns": 14
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
