import { DebtAnalysisRequest, DebtAnalysisResponse } from './types';

const API_BASE_URL = '/api/v1';

export async function analyzeDebt(request: DebtAnalysisRequest): Promise<DebtAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/debts/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze debt');
  }

  return response.json();
}

export async function getMockDebts(limit: number = 10) {
  const response = await fetch(`${API_BASE_URL}/debts/mock?limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch mock debts');
  }

  return response.json();
}

export async function getDashboardMetrics(period: string = 'month') {
  const response = await fetch(`${API_BASE_URL}/dashboard/metrics?period=${period}`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }

  return response.json();
}

export async function bulkAnalyze(filters: { amountLessThan?: number; limit?: number }) {
  const response = await fetch(`${API_BASE_URL}/debts/bulk-analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters }),
  });

  if (!response.ok) {
    throw new Error('Failed to perform bulk analysis');
  }

  return response.json();
}
