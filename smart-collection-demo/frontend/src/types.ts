export enum DebtType {
  CAK_EIGEN_BIJDRAGE = 'cak_eigen_bijdrage',
  PARKEERBOETE = 'parkeerboete',
  HONDENBELASTING = 'hondenbelasting',
  AFVALSTOFFENHEFFING = 'afvalstoffenheffing',
  BIJZONDERE_BIJSTAND = 'bijzondere_bijstand',
  STUDIEFINANCIERING = 'studiefinanciering',
  ZORGVERZEKERING_PREMIE = 'zorgverzekering_premie',
  VERKEERSBOETE = 'verkeersboete',
}

export enum IncomeSource {
  EMPLOYMENT = 'employment',
  BENEFIT_UNEMPLOYMENT = 'benefit_unemployment',
  BENEFIT_DISABILITY = 'benefit_disability',
  BENEFIT_SOCIAL = 'benefit_social',
  PENSION = 'pension',
  SELF_EMPLOYED = 'self_employed',
  NONE = 'none',
}

export enum Recommendation {
  COLLECT_STANDARD = 'collect_standard',
  PAYMENT_PLAN = 'payment_plan',
  CONSOLIDATE = 'consolidate',
  FORGIVE = 'forgive',
  REFER_TO_ASSISTANCE = 'refer_to_assistance',
}

export const debtTypeLabels: Record<DebtType, string> = {
  [DebtType.CAK_EIGEN_BIJDRAGE]: 'CAK Eigen bijdrage Wmo',
  [DebtType.PARKEERBOETE]: 'Parkeerboete',
  [DebtType.HONDENBELASTING]: 'Hondenbelasting',
  [DebtType.AFVALSTOFFENHEFFING]: 'Afvalstoffenheffing',
  [DebtType.BIJZONDERE_BIJSTAND]: 'Bijzondere bijstand',
  [DebtType.STUDIEFINANCIERING]: 'Studiefinanciering',
  [DebtType.ZORGVERZEKERING_PREMIE]: 'Zorgverzekering premie',
  [DebtType.VERKEERSBOETE]: 'Verkeersboete',
};

export const incomeSourceLabels: Record<IncomeSource, string> = {
  [IncomeSource.EMPLOYMENT]: 'Werkzaam',
  [IncomeSource.BENEFIT_UNEMPLOYMENT]: 'WW-uitkering',
  [IncomeSource.BENEFIT_DISABILITY]: 'WIA/WAO',
  [IncomeSource.BENEFIT_SOCIAL]: 'Bijstand',
  [IncomeSource.PENSION]: 'Pensioen',
  [IncomeSource.SELF_EMPLOYED]: 'ZZP',
  [IncomeSource.NONE]: 'Geen inkomen',
};

export const recommendationLabels: Record<Recommendation, string> = {
  [Recommendation.COLLECT_STANDARD]: 'Regulier invorderen',
  [Recommendation.PAYMENT_PLAN]: 'Betalingsregeling',
  [Recommendation.CONSOLIDATE]: 'Consolideren',
  [Recommendation.FORGIVE]: 'Kwijtschelden',
  [Recommendation.REFER_TO_ASSISTANCE]: 'Doorverwijzen naar hulp',
};

export interface DebtAnalysisRequest {
  debt: {
    amount: number;
    type: DebtType;
    originDate: string;
    dueDate: string;
  };
  citizen: {
    bsn: string;
    income: number;
    incomeSource: IncomeSource;
    otherDebtsCount: number;
    inDebtAssistance: boolean;
    paymentHistory: Array<{
      date: string;
      amount: number;
      daysLate: number;
    }>;
  };
}

export interface DebtAnalysisResponse {
  analysisId: string;
  timestamp: string;
  financialAnalysis: {
    debtAmount: number;
    collectionCosts: {
      reminder: number;
      summons: number;
      collectionAgency: number;
      bailiff: number;
      court: number;
      internalHours: number;
      total: number;
    };
    successProbability: number;
    expectedRevenue: number;
    netResult: number;
    costToDebtRatio: number;
  };
  societalImpact: {
    riskScore: number;
    estimatedCosts: {
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
    };
    totalCostToDebtRatio: number;
  };
  alternatives: Array<{
    action: Recommendation;
    costs: number;
    expectedRevenue: number;
    netResult: number;
    societalBenefit: number;
    totalBenefit: number;
    recommended?: boolean;
  }>;
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
