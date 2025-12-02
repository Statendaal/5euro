import { DebtAnalysisRequest, DebtAnalysisResponse } from "./types";
import {
  USE_MOCK_DATA,
  getMockResultByScenarioId,
} from "./mockSimulationResults";

const API_BASE_URL = "http://localhost:3001/api/v1";

export async function analyzeDebt(
  request: DebtAnalysisRequest,
): Promise<DebtAnalysisResponse> {
  // Use mock data for static demo or when backend is not available
  if (USE_MOCK_DATA) {
    return getMockAnalysisResult(request);
  }

  try {
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
  } catch (error) {
    // Fallback to mock data if backend is not available (e.g., GitHub Pages)
    console.log("Backend niet beschikbaar, gebruik mock data voor schuldanalyse");
    return getMockAnalysisResult(request);
  }
}

async function getMockAnalysisResult(request: DebtAnalysisRequest): Promise<DebtAnalysisResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Try to find mock result based on debt amount and profile
  let mockResult = getMockResultByScenarioId("bijstand-klein");

  // Match by amount and profile characteristics
  if (request.debt.amount <= 20 && request.citizen.incomeSource === "benefit_social") {
    mockResult = getMockResultByScenarioId("bijstand-klein");
  } else if (request.debt.amount === 45 || request.debt.amount === 145) {
    mockResult = getMockResultByScenarioId("ww-zorgkosten");
  } else if (request.debt.amount === 8 || request.debt.amount <= 10) {
    mockResult = getMockResultByScenarioId("schuldhulp-actief");
  } else if (request.citizen.inDebtAssistance) {
    mockResult = getMockResultByScenarioId("schuldhulp-actief");
  } else if (request.citizen.otherDebtsCount >= 5) {
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
  } else {
    // Default fallback
    const defaultResult = getMockResultByScenarioId("bijstand-klein")!;
    return {
      ...defaultResult,
      financialAnalysis: {
        ...defaultResult.financialAnalysis,
        debtAmount: request.debt.amount,
      },
    };
  }
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
