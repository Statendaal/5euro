export enum DebtType {
  CAK_EIGEN_BIJDRAGE = "cak_eigen_bijdrage",
  PARKEERBOETE = "parkeerboete",
  HONDENBELASTING = "hondenbelasting",
  AFVALSTOFFENHEFFING = "afvalstoffenheffing",
  BIJZONDERE_BIJSTAND = "bijzondere_bijstand",
  STUDIEFINANCIERING = "studiefinanciering",
  ZORGVERZEKERING_PREMIE = "zorgverzekering_premie",
  VERKEERSBOETE = "verkeersboete",
}

export enum IncomeSource {
  EMPLOYMENT = "employment",
  BENEFIT_UNEMPLOYMENT = "benefit_unemployment",
  BENEFIT_DISABILITY = "benefit_disability",
  BENEFIT_SOCIAL = "benefit_social",
  PENSION = "pension",
  SELF_EMPLOYED = "self_employed",
  NONE = "none",
}

export enum Recommendation {
  COLLECT_STANDARD = "collect_standard",
  PAYMENT_PLAN = "payment_plan",
  CONSOLIDATE = "consolidate",
  FORGIVE = "forgive",
  REFER_TO_ASSISTANCE = "refer_to_assistance",
}

export interface DebtAnalysisRequest {
  debt: {
    amount: number;
    type: DebtType | string;
    originDate?: string;
    dueDate?: string;
    id?: string;
  };
  citizen: {
    bsn?: string;
    id?: string;
    income: number;
    incomeSource: IncomeSource | string;
    otherDebtsCount: number;
    inDebtAssistance: boolean;
    paymentHistory?: Array<{
      date: string;
      amount: number;
      daysLate: number;
    }>;
  };
}

export interface DirectCosts {
  reminder: number;
  summons: number;
  collectionAgency: number;
  bailiff: number;
  court: number;
  internalHours: number;
  total: number;
}

export interface SuccessFactors {
  citizenIncome: number;
  paymentHistory: number;
  otherDebts: number;
  debtAge: number;
  combinedProbability: number;
}

export interface SocietalCosts {
  healthcare: {
    probability: number;
    ggzTreatment: number;
    gpVisits: number;
    medication: number;
    total: number;
  };
  employment: {
    probability: number;
    sickLeave: number;
    reducedReintegration: number;
    longerBenefitPeriod: number;
    total: number;
  };
  debtAssistance: {
    probability: number;
    intake: number;
    trajectory: number;
    administration: number;
    total: number;
  };
  domesticViolence: {
    probability: number;
    policeCosts: number;
    shelterCosts: number;
    total: number;
  };
  legal: {
    legalAid: number;
    courtProcedures: number;
    enforcement: number;
    total: number;
  };
  totalSocietalCost: number;
}

export interface ScenarioResult {
  action: Recommendation;
  costs: number;
  expectedRevenue: number;
  netResult: number;
  societalBenefit: number;
  totalBenefit: number;
  recommended?: boolean;
}

export interface DebtAnalysisResponse {
  analysisId: string;
  timestamp: string;
  financialAnalysis: {
    debtAmount: number;
    collectionCosts: DirectCosts;
    successProbability: number;
    expectedRevenue: number;
    netResult: number;
    costToDebtRatio: number;
  };
  societalImpact: {
    riskScore: number;
    estimatedCosts: SocietalCosts;
    totalCostToDebtRatio: number;
  };
  alternatives: ScenarioResult[];
  recommendation: {
    action: Recommendation;
    confidence: number;
    reasoning: string[];
    suggestedSteps: string[];
  };
  estimatedSavings: {
    direct: number;
    societal: number;
    total: number;
  };
}
