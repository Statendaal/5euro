import { DebtAnalysisRequest, DebtAnalysisResponse } from "./types";
import {
  USE_MOCK_DATA,
  getMockResultByScenarioId,
} from "./mockSimulationResults";

const API_BASE_URL = "http://localhost:3001/api/v1";

export async function analyzeDebt(
  request: DebtAnalysisRequest,
): Promise<DebtAnalysisResponse> {
  // Use mock data for static demo
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Try to find mock result based on debt amount (crude matching)
    let mockResult = getMockResultByScenarioId("bijstand-klein");

    // Try to match by amount
    if (request.debt.amount === 45) {
      mockResult = getMockResultByScenarioId("ww-zorgkosten");
    } else if (request.debt.amount === 8) {
      mockResult = getMockResultByScenarioId("schuldhulp-actief");
    }

    if (mockResult) {
      return {
        ...mockResult,
        financialAnalysis: {
          ...mockResult.financialAnalysis,
          debtAmount: request.debt.amount,
        },
      };
    }
  }

  const response = await fetch(`${API_BASE_URL}/debts/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze debt");
  }

  return response.json();
}

export async function getMockDebts(limit: number = 10) {
  const response = await fetch(`${API_BASE_URL}/debts/mock?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch mock debts");
  }
  return response.json();
}

export async function getDashboardMetrics(period: string = "month") {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/metrics?period=${period}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard metrics");
  }
  return response.json();
}

export async function bulkAnalyze(filters: {
  amountLessThan?: number;
  limit?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/debts/bulk-analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filters }),
  });

  if (!response.ok) {
    throw new Error("Failed to perform bulk analysis");
  }

  return response.json();
}
