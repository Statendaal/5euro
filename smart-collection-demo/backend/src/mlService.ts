/**
 * ML Model Service
 * Integrates with the Python ML API for intelligent debt collection predictions
 */

import axios from "axios";
import { DebtAnalysisRequest, Recommendation, IncomeSource } from "./types";

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

interface MLPredictionRequest {
  debt_amount: number;
  monthly_income: number;
  income_source: string;
  has_children: boolean;
  in_debt_assistance: boolean;
  other_debts_count: number;
  debt_type?: string;
}

interface MLPredictionResponse {
  recommendation: string;
  confidence: number;
  probabilities: Record<string, number>;
  features_used: Record<string, any>;
  ml_model_info: {
    accuracy: number;
    cv_mean: number;
    feature_importance_top: string;
  };
}

/**
 * Convert backend IncomeSource enum to ML API format
 */
function mapIncomeSource(source: IncomeSource | string): string {
  // Handle string values from frontend
  if (typeof source === "string") {
    const stringMapping: Record<string, string> = {
      employment: "EMPLOYMENT",
      benefit: "BENEFIT_SOCIAL",
      benefit_unemployment: "BENEFIT_UNEMPLOYMENT",
      benefit_disability: "BENEFIT_DISABILITY",
      benefit_social: "BENEFIT_SOCIAL",
      pension: "PENSION",
      self_employed: "SELF_EMPLOYED",
      none: "OTHER",
    };
    return stringMapping[source.toLowerCase()] || "OTHER";
  }

  const mapping: Record<IncomeSource, string> = {
    [IncomeSource.EMPLOYMENT]: "EMPLOYMENT",
    [IncomeSource.BENEFIT_UNEMPLOYMENT]: "BENEFIT_UNEMPLOYMENT",
    [IncomeSource.BENEFIT_DISABILITY]: "BENEFIT_DISABILITY",
    [IncomeSource.BENEFIT_SOCIAL]: "BENEFIT_SOCIAL",
    [IncomeSource.PENSION]: "PENSION",
    [IncomeSource.SELF_EMPLOYED]: "SELF_EMPLOYED",
    [IncomeSource.NONE]: "OTHER",
  };
  return mapping[source] || "OTHER";
}

/**
 * Convert backend debt type to ML API format
 */
function mapDebtType(type: string): string {
  const mapping: Record<string, string> = {
    cak: "CAK_EIGEN_BIJDRAGE",
    healthcare: "HEALTHCARE_INSURANCE",
    tax: "TAX",
    municipality: "MUNICIPALITY",
    utilities: "UTILITIES",
  };
  return mapping[type.toLowerCase()] || "OTHER";
}

/**
 * Convert ML API recommendation to backend Recommendation enum
 */
function mapMLRecommendation(mlRec: string): Recommendation {
  const mapping: Record<string, Recommendation> = {
    FORGIVE: Recommendation.FORGIVE,
    PAYMENT_PLAN: Recommendation.PAYMENT_PLAN,
    REFER_TO_ASSISTANCE: Recommendation.REFER_TO_ASSISTANCE,
    REMINDER: Recommendation.COLLECT_STANDARD,
  };
  return mapping[mlRec] || Recommendation.COLLECT_STANDARD;
}

/**
 * Get ML-based recommendation for debt collection
 */
export async function getMLRecommendation(
  request: DebtAnalysisRequest,
): Promise<{
  recommendation: Recommendation;
  confidence: number;
  mlInsights: {
    probabilities: Record<string, number>;
    features: Record<string, any>;
    modelAccuracy: number;
  };
}> {
  try {
    // Prepare ML API request
    const mlRequest: MLPredictionRequest = {
      debt_amount: request.debt.amount,
      monthly_income: request.citizen.income,
      income_source: mapIncomeSource(request.citizen.incomeSource),
      has_children: false, // Could be derived from BSN lookup
      in_debt_assistance: request.citizen.inDebtAssistance,
      other_debts_count: request.citizen.otherDebtsCount,
      debt_type: mapDebtType(request.debt.type),
    };

    // Call ML API
    const response = await axios.post<MLPredictionResponse>(
      `${ML_API_URL}/predict`,
      mlRequest,
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const mlResponse = response.data;

    return {
      recommendation: mapMLRecommendation(mlResponse.recommendation),
      confidence: mlResponse.confidence,
      mlInsights: {
        probabilities: mlResponse.probabilities,
        features: mlResponse.features_used,
        modelAccuracy: mlResponse.ml_model_info.accuracy,
      },
    };
  } catch (error) {
    console.error("ML API error:", error);

    // Fallback to rule-based system if ML API is unavailable
    console.warn("ML API unavailable, using fallback logic");
    return getFallbackRecommendation(request);
  }
}

/**
 * Fallback recommendation logic when ML API is unavailable
 */
function getFallbackRecommendation(request: DebtAnalysisRequest): {
  recommendation: Recommendation;
  confidence: number;
  mlInsights: {
    probabilities: Record<string, number>;
    features: Record<string, any>;
    modelAccuracy: number;
  };
} {
  const { debt, citizen } = request;
  const debtToIncomeRatio = debt.amount / citizen.income;

  let recommendation: Recommendation;
  let confidence = 0.6; // Lower confidence for fallback

  // Simple rule-based fallback
  if (debt.amount < 50 && debtToIncomeRatio < 0.05) {
    recommendation = Recommendation.FORGIVE;
  } else if (citizen.inDebtAssistance || debtToIncomeRatio > 1.0) {
    recommendation = Recommendation.REFER_TO_ASSISTANCE;
  } else if (
    citizen.incomeSource === IncomeSource.BENEFIT_SOCIAL ||
    citizen.incomeSource === IncomeSource.BENEFIT_UNEMPLOYMENT
  ) {
    recommendation = Recommendation.PAYMENT_PLAN;
  } else {
    recommendation = Recommendation.COLLECT_STANDARD;
  }

  return {
    recommendation,
    confidence,
    mlInsights: {
      probabilities: {},
      features: {
        debt_amount: debt.amount,
        monthly_income: citizen.income,
        debt_to_income_ratio: debtToIncomeRatio,
        fallback_mode: true,
      },
      modelAccuracy: 0,
    },
  };
}

/**
 * Check if ML API is healthy
 */
export async function checkMLHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, {
      timeout: 2000,
    });
    return response.status === 200;
  } catch {
    return false;
  }
}
