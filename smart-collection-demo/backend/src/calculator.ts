import {
  DebtAnalysisRequest,
  DebtAnalysisResponse,
  DirectCosts,
  SuccessFactors,
  SocietalCosts,
  ScenarioResult,
  Recommendation,
  IncomeSource,
} from './types';

export class CostCalculator {
  /**
   * Calculate direct collection costs
   */
  private calculateDirectCosts(debtAmount: number): DirectCosts {
    return {
      reminder: 12.0,
      summons: 25.0,
      collectionAgency: 73.0,
      bailiff: 150.0,
      court: 100.0,
      internalHours: 300.0, // 4 hours × €75/hour
      total: 660.0,
    };
  }

  /**
   * Calculate success probability using simplified ML model
   */
  private calculateSuccessProbability(request: DebtAnalysisRequest): SuccessFactors {
    const { citizen, debt } = request;

    // Income factor (0-1): higher income = higher probability
    const incomeFactor = Math.min(citizen.income / 3000, 1.0);

    // Payment history factor (0-1)
    const avgDaysLate =
      citizen.paymentHistory.length > 0
        ? citizen.paymentHistory.reduce((sum, p) => sum + p.daysLate, 0) /
          citizen.paymentHistory.length
        : 30;
    const paymentHistoryFactor = Math.max(0, 1 - avgDaysLate / 90);

    // Other debts factor (0-1): more debts = lower probability
    const otherDebtsFactor = Math.max(0, 1 - citizen.otherDebtsCount * 0.15);

    // Debt age factor
    const daysOverdue = this.calculateDaysOverdue(debt.dueDate);
    const debtAgeFactor = Math.max(0, 1 - daysOverdue / 365);

    // Combined probability (weighted average)
    const combinedProbability =
      incomeFactor * 0.3 +
      paymentHistoryFactor * 0.3 +
      otherDebtsFactor * 0.25 +
      debtAgeFactor * 0.15;

    return {
      citizenIncome: incomeFactor,
      paymentHistory: paymentHistoryFactor,
      otherDebts: otherDebtsFactor,
      debtAge: debtAgeFactor,
      combinedProbability: Math.max(0.05, Math.min(0.95, combinedProbability)),
    };
  }

  /**
   * Calculate societal costs (simplified model based on IBO report)
   */
  private calculateSocietalCosts(
    request: DebtAnalysisRequest,
    riskScore: number
  ): SocietalCosts {
    const { citizen } = request;

    // Risk probability increases with lower income and more debts
    const baseRisk = riskScore / 100;

    // Healthcare costs
    const healthcareProbability = Math.min(0.4, baseRisk * 0.5);
    const healthcare = {
      probability: healthcareProbability,
      ggzTreatment: 2400,
      gpVisits: 180,
      medication: 420,
      total: 3000 * healthcareProbability,
    };

    // Employment costs
    const employmentProbability =
      citizen.incomeSource === IncomeSource.BENEFIT_SOCIAL ||
      citizen.incomeSource === IncomeSource.BENEFIT_UNEMPLOYMENT
        ? Math.min(0.6, baseRisk * 0.7)
        : Math.min(0.3, baseRisk * 0.4);
    const employment = {
      probability: employmentProbability,
      sickLeave: 0,
      reducedReintegration: 1200,
      longerBenefitPeriod: 4350,
      total: 5550 * employmentProbability,
    };

    // Debt assistance costs
    const debtAssistanceProbability = Math.min(0.8, baseRisk * 0.9);
    const debtAssistance = {
      probability: debtAssistanceProbability,
      intake: 1800,
      trajectory: 3200,
      administration: 2400,
      total: 7400 * debtAssistanceProbability,
    };

    // Domestic violence (correlation with financial stress)
    const domesticViolenceProbability = Math.min(0.15, baseRisk * 0.2);
    const domesticViolence = {
      probability: domesticViolenceProbability,
      policeCosts: 1200,
      shelterCosts: 4800,
      total: 6000 * domesticViolenceProbability,
    };

    // Legal costs
    const legal = {
      legalAid: 800,
      courtProcedures: 2400,
      enforcement: 450,
      total: 3650 * Math.min(0.5, baseRisk * 0.6),
    };

    const totalSocietalCost =
      healthcare.total +
      employment.total +
      debtAssistance.total +
      domesticViolence.total +
      legal.total;

    return {
      healthcare,
      employment,
      debtAssistance,
      domesticViolence,
      legal,
      totalSocietalCost,
    };
  }

  /**
   * Calculate risk score (0-100) based on citizen profile
   */
  private calculateRiskScore(request: DebtAnalysisRequest): number {
    const { citizen } = request;

    let score = 0;

    // Low income
    if (citizen.income < 1500) score += 30;
    else if (citizen.income < 2000) score += 15;

    // Multiple debts
    score += Math.min(30, citizen.otherDebtsCount * 10);

    // In debt assistance already
    if (citizen.inDebtAssistance) score += 20;

    // Poor payment history
    const avgDaysLate =
      citizen.paymentHistory.length > 0
        ? citizen.paymentHistory.reduce((sum, p) => sum + p.daysLate, 0) /
          citizen.paymentHistory.length
        : 0;
    if (avgDaysLate > 30) score += 15;
    else if (avgDaysLate > 14) score += 10;

    // Benefit income
    if (
      citizen.incomeSource === IncomeSource.BENEFIT_SOCIAL ||
      citizen.incomeSource === IncomeSource.BENEFIT_UNEMPLOYMENT
    ) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate alternative scenarios
   */
  private calculateAlternatives(
    debtAmount: number,
    directCosts: DirectCosts,
    successProbability: number,
    societalCosts: SocietalCosts
  ): ScenarioResult[] {
    // Scenario 1: Payment plan
    const paymentPlanCosts = 40;
    const paymentPlanSuccessProbability = Math.min(0.6, successProbability + 0.15);
    const paymentPlan: ScenarioResult = {
      action: Recommendation.PAYMENT_PLAN,
      costs: paymentPlanCosts,
      expectedRevenue: debtAmount * paymentPlanSuccessProbability,
      netResult:
        debtAmount * paymentPlanSuccessProbability - paymentPlanCosts,
      societalBenefit: societalCosts.totalSocietalCost * 0.4, // 40% reduction
      totalBenefit:
        debtAmount * paymentPlanSuccessProbability -
        paymentPlanCosts +
        societalCosts.totalSocietalCost * 0.4,
    };

    // Scenario 2: Consolidation (combine with other debts)
    const consolidationCosts = 20;
    const consolidation: ScenarioResult = {
      action: Recommendation.CONSOLIDATE,
      costs: consolidationCosts,
      expectedRevenue: debtAmount * (successProbability + 0.1),
      netResult:
        debtAmount * (successProbability + 0.1) - consolidationCosts,
      societalBenefit: societalCosts.totalSocietalCost * 0.3,
      totalBenefit:
        debtAmount * (successProbability + 0.1) -
        consolidationCosts +
        societalCosts.totalSocietalCost * 0.3,
    };

    // Scenario 3: Forgiveness
    const forgivenessCosts = 5;
    const forgiveness: ScenarioResult = {
      action: Recommendation.FORGIVE,
      costs: forgivenessCosts,
      expectedRevenue: 0,
      netResult: -forgivenessCosts,
      societalBenefit: societalCosts.totalSocietalCost, // Full prevention
      totalBenefit: societalCosts.totalSocietalCost - forgivenessCosts,
      recommended: true,
    };

    // Scenario 4: Refer to assistance
    const referCosts = 10;
    const referToAssistance: ScenarioResult = {
      action: Recommendation.REFER_TO_ASSISTANCE,
      costs: referCosts,
      expectedRevenue: debtAmount * 0.3,
      netResult: debtAmount * 0.3 - referCosts,
      societalBenefit: societalCosts.totalSocietalCost * 0.6,
      totalBenefit:
        debtAmount * 0.3 - referCosts + societalCosts.totalSocietalCost * 0.6,
    };

    return [paymentPlan, consolidation, forgiveness, referToAssistance].sort(
      (a, b) => b.totalBenefit - a.totalBenefit
    );
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(
    debtAmount: number,
    directCosts: DirectCosts,
    successProbability: number,
    societalCosts: SocietalCosts,
    riskScore: number,
    alternatives: ScenarioResult[]
  ): {
    action: Recommendation;
    confidence: number;
    reasoning: string[];
    suggestedSteps: string[];
  } {
    const costToDebtRatio = directCosts.total / debtAmount;
    const bestAlternative = alternatives[0];

    const reasoning: string[] = [];
    let confidence = 0;

    // Decision logic
    if (costToDebtRatio > 10 && successProbability < 0.2) {
      reasoning.push(
        `Invorderingskosten (€${directCosts.total.toFixed(0)}) zijn ${costToDebtRatio.toFixed(0)}× de schuld (€${debtAmount.toFixed(2)})`
      );
      confidence += 30;
    }

    if (successProbability < 0.25) {
      reasoning.push(
        `Succeskans inning is zeer laag (${(successProbability * 100).toFixed(0)}%)`
      );
      confidence += 25;
    }

    if (riskScore > 60) {
      reasoning.push(
        `Burger heeft hoog risicoprofiel voor escalatie (score: ${riskScore}/100)`
      );
      confidence += 20;
    }

    if (societalCosts.totalSocietalCost > 1000) {
      reasoning.push(
        `Geschatte maatschappelijke kosten van €${societalCosts.totalSocietalCost.toFixed(0)} bij doorinnen`
      );
      confidence += 25;
    }

    const suggestedSteps: string[] = [];

    if (bestAlternative.action === Recommendation.FORGIVE) {
      reasoning.push(
        `Kwijtschelding kost slechts €${bestAlternative.costs} en voorkomt verdere schade`
      );
      suggestedSteps.push(
        'Kwijtschelding goedkeuren',
        'Verstuur vriendelijke brief met uitleg',
        'Automatische doorverwijzing naar gemeentelijke schuldhulp',
        'Meld bij Early Warning System voor monitoring'
      );
    } else if (bestAlternative.action === Recommendation.PAYMENT_PLAN) {
      suggestedSteps.push(
        'Bied betalingsregeling aan zonder juridische dreiging',
        'Flexibele termijnen gebaseerd op inkomen',
        'Geen extra kosten bij naleving'
      );
    } else if (bestAlternative.action === Recommendation.REFER_TO_ASSISTANCE) {
      suggestedSteps.push(
        'Doorverwijzing naar schuldhulpverlening',
        'Schuld on-hold tot traject loopt',
        'Coördineer met andere schuldeisers'
      );
    }

    return {
      action: bestAlternative.action,
      confidence: Math.min(100, confidence),
      reasoning,
      suggestedSteps,
    };
  }

  /**
   * Calculate days overdue
   */
  private calculateDaysOverdue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = now.getTime() - due.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  /**
   * Main analysis function
   */
  public analyze(request: DebtAnalysisRequest): DebtAnalysisResponse {
    const { debt } = request;

    // Calculate all components
    const directCosts = this.calculateDirectCosts(debt.amount);
    const successFactors = this.calculateSuccessProbability(request);
    const riskScore = this.calculateRiskScore(request);
    const societalCosts = this.calculateSocietalCosts(request, riskScore);

    const expectedRevenue = debt.amount * successFactors.combinedProbability;
    const netResult = expectedRevenue - directCosts.total;
    const costToDebtRatio = directCosts.total / debt.amount;

    // Calculate alternatives
    const alternatives = this.calculateAlternatives(
      debt.amount,
      directCosts,
      successFactors.combinedProbability,
      societalCosts
    );

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      debt.amount,
      directCosts,
      successFactors.combinedProbability,
      societalCosts,
      riskScore,
      alternatives
    );

    // Calculate savings
    const bestAlternative = alternatives.find((a) => a.action === recommendation.action)!;
    const estimatedSavings = {
      direct: directCosts.total - bestAlternative.costs,
      societal: bestAlternative.societalBenefit,
      total: directCosts.total - bestAlternative.costs + bestAlternative.societalBenefit,
    };

    return {
      analysisId: this.generateAnalysisId(),
      timestamp: new Date().toISOString(),
      financialAnalysis: {
        debtAmount: debt.amount,
        collectionCosts: directCosts,
        successProbability: successFactors.combinedProbability,
        expectedRevenue,
        netResult,
        costToDebtRatio,
      },
      societalImpact: {
        riskScore,
        estimatedCosts: societalCosts,
        totalCostToDebtRatio: societalCosts.totalSocietalCost / debt.amount,
      },
      alternatives,
      recommendation,
      estimatedSavings,
    };
  }

  private generateAnalysisId(): string {
    return `A${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
