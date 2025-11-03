import { DebtAnalysisResponse, Recommendation } from "./types";

// Pre-calculated simulation results for static demo
export const mockSimulationResults: Array<{
  scenarioId: string;
  response: DebtAnalysisResponse;
}> = [
  {
    scenarioId: "bijstand-klein",
    response: {
      analysisId: "DEMO_001",
      timestamp: "2025-11-02T20:00:00.000Z",
      financialAnalysis: {
        debtAmount: 15,
        collectionCosts: {
          reminder: 12,
          summons: 25,
          collectionAgency: 73,
          bailiff: 150,
          court: 100,
          internalHours: 300,
          total: 660,
        },
        successProbability: 0.15,
        expectedRevenue: 2.25,
        netResult: -657.75,
        costToDebtRatio: 44,
      },
      societalImpact: {
        riskScore: 85,
        estimatedCosts: {
          healthcare: {
            probability: 0.425,
            ggzTreatment: 2400,
            gpVisits: 180,
            medication: 420,
            total: 1275,
          },
          employment: {
            probability: 0.6,
            sickLeave: 0,
            reducedReintegration: 1200,
            longerBenefitPeriod: 4350,
            total: 3330,
          },
          debtAssistance: {
            probability: 0.75,
            intake: 1800,
            trajectory: 3200,
            administration: 2400,
            total: 5550,
          },
          domesticViolence: {
            probability: 0.18,
            policeCosts: 1200,
            shelterCosts: 4800,
            total: 1080,
          },
          legal: {
            legalAid: 800,
            courtProcedures: 2400,
            enforcement: 450,
            total: 1826.25,
          },
          totalSocietalCost: 13061.25,
        },
        totalCostToDebtRatio: 870.75,
      },
      alternatives: [
        {
          action: Recommendation.FORGIVE,
          costs: 5,
          expectedRevenue: 0,
          netResult: -5,
          societalBenefit: 13061.25,
          totalBenefit: 13056.25,
          recommended: true,
        },
        {
          action: Recommendation.REFER_TO_ASSISTANCE,
          costs: 10,
          expectedRevenue: 3.75,
          netResult: -6.25,
          societalBenefit: 7836.75,
          totalBenefit: 7830.5,
        },
        {
          action: Recommendation.PAYMENT_PLAN,
          costs: 40,
          expectedRevenue: 7.5,
          netResult: -32.5,
          societalBenefit: 5224.5,
          totalBenefit: 5192,
        },
        {
          action: Recommendation.CONSOLIDATE,
          costs: 20,
          expectedRevenue: 6.375,
          netResult: -13.625,
          societalBenefit: 3918.375,
          totalBenefit: 3904.75,
        },
      ],
      recommendation: {
        action: Recommendation.FORGIVE,
        confidence: 95,
        reasoning: [
          "Burger heeft zeer hoog risicoprofiel voor escalatie (score: 85/100)",
          "Geschatte maatschappelijke kosten van €13,061 bij doorinnen",
          "Kwijtschelding kost slechts €5 en voorkomt verdere schade",
          "Alleenstaande ouder met 2 kinderen op bijstandsinkomen",
        ],
        suggestedSteps: [
          "Kwijtschelding direct goedkeuren",
          "Verstuur vriendelijke brief met uitleg",
          "Automatische doorverwijzing naar gemeentelijke schuldhulp",
          "Meld bij Early Warning System voor monitoring",
        ],
      },
      estimatedSavings: {
        direct: 655,
        societal: 13061.25,
        total: 13716.25,
      },
    },
  },
  {
    scenarioId: "ww-zorgkosten",
    response: {
      analysisId: "DEMO_002",
      timestamp: "2025-11-02T20:00:00.000Z",
      financialAnalysis: {
        debtAmount: 45,
        collectionCosts: {
          reminder: 12,
          summons: 25,
          collectionAgency: 73,
          bailiff: 150,
          court: 100,
          internalHours: 300,
          total: 660,
        },
        successProbability: 0.35,
        expectedRevenue: 15.75,
        netResult: -644.25,
        costToDebtRatio: 14.67,
      },
      societalImpact: {
        riskScore: 70,
        estimatedCosts: {
          healthcare: {
            probability: 0.35,
            ggzTreatment: 2400,
            gpVisits: 180,
            medication: 420,
            total: 1050,
          },
          employment: {
            probability: 0.55,
            sickLeave: 0,
            reducedReintegration: 1200,
            longerBenefitPeriod: 4350,
            total: 3052.5,
          },
          debtAssistance: {
            probability: 0.6,
            intake: 1800,
            trajectory: 3200,
            administration: 2400,
            total: 4320,
          },
          domesticViolence: {
            probability: 0.12,
            policeCosts: 1200,
            shelterCosts: 4800,
            total: 720,
          },
          legal: {
            legalAid: 800,
            courtProcedures: 2400,
            enforcement: 450,
            total: 1642.5,
          },
          totalSocietalCost: 10785,
        },
        totalCostToDebtRatio: 239.67,
      },
      alternatives: [
        {
          action: Recommendation.FORGIVE,
          costs: 5,
          expectedRevenue: 0,
          netResult: -5,
          societalBenefit: 10785,
          totalBenefit: 10780,
          recommended: true,
        },
        {
          action: Recommendation.PAYMENT_PLAN,
          costs: 40,
          expectedRevenue: 22.5,
          netResult: -17.5,
          societalBenefit: 4314,
          totalBenefit: 4296.5,
        },
        {
          action: Recommendation.REFER_TO_ASSISTANCE,
          costs: 10,
          expectedRevenue: 11.25,
          netResult: 1.25,
          societalBenefit: 6471,
          totalBenefit: 6472.25,
        },
        {
          action: Recommendation.CONSOLIDATE,
          costs: 20,
          expectedRevenue: 19.125,
          netResult: -0.875,
          societalBenefit: 3235.5,
          totalBenefit: 3234.625,
        },
      ],
      recommendation: {
        action: Recommendation.FORGIVE,
        confidence: 85,
        reasoning: [
          "WW-uitkering is tijdelijk, kans op herstel aanwezig",
          "Maatschappelijke kosten (€10,785) zijn veel hoger dan schuld",
          "Kwijtschelding voorkomt escalatie en geeft ruimte voor werk zoeken",
        ],
        suggestedSteps: [
          "Kwijtschelding goedkeuren",
          "Brief met informatie over re-integratie ondersteuning",
          "Optionele doorverwijzing naar schuldhulp indien gewenst",
        ],
      },
      estimatedSavings: {
        direct: 655,
        societal: 10785,
        total: 11440,
      },
    },
  },
  {
    scenarioId: "schuldhulp-actief",
    response: {
      analysisId: "DEMO_003",
      timestamp: "2025-11-02T20:00:00.000Z",
      financialAnalysis: {
        debtAmount: 8,
        collectionCosts: {
          reminder: 12,
          summons: 25,
          collectionAgency: 73,
          bailiff: 150,
          court: 100,
          internalHours: 300,
          total: 660,
        },
        successProbability: 0.05,
        expectedRevenue: 0.4,
        netResult: -659.6,
        costToDebtRatio: 82.5,
      },
      societalImpact: {
        riskScore: 95,
        estimatedCosts: {
          healthcare: {
            probability: 0.5,
            ggzTreatment: 2400,
            gpVisits: 180,
            medication: 420,
            total: 1500,
          },
          employment: {
            probability: 0.7,
            sickLeave: 0,
            reducedReintegration: 1200,
            longerBenefitPeriod: 4350,
            total: 3885,
          },
          debtAssistance: {
            probability: 0.95,
            intake: 1800,
            trajectory: 3200,
            administration: 2400,
            total: 6840,
          },
          domesticViolence: {
            probability: 0.25,
            policeCosts: 1200,
            shelterCosts: 4800,
            total: 1500,
          },
          legal: {
            legalAid: 800,
            courtProcedures: 2400,
            enforcement: 450,
            total: 1826.25,
          },
          totalSocietalCost: 15551.25,
        },
        totalCostToDebtRatio: 1943.91,
      },
      alternatives: [
        {
          action: Recommendation.FORGIVE,
          costs: 5,
          expectedRevenue: 0,
          netResult: -5,
          societalBenefit: 15551.25,
          totalBenefit: 15546.25,
          recommended: true,
        },
        {
          action: Recommendation.REFER_TO_ASSISTANCE,
          costs: 10,
          expectedRevenue: 1,
          netResult: -9,
          societalBenefit: 9330.75,
          totalBenefit: 9321.75,
        },
        {
          action: Recommendation.CONSOLIDATE,
          costs: 20,
          expectedRevenue: 3.4,
          netResult: -16.6,
          societalBenefit: 4665.375,
          totalBenefit: 4648.775,
        },
        {
          action: Recommendation.PAYMENT_PLAN,
          costs: 40,
          expectedRevenue: 2,
          netResult: -38,
          societalBenefit: 6220.5,
          totalBenefit: 6182.5,
        },
      ],
      recommendation: {
        action: Recommendation.FORGIVE,
        confidence: 98,
        reasoning: [
          "Burger is al in schuldhulpverlening - extra schulden verstoren traject",
          "Extreem hoog risicoprofiel (score: 95/100)",
          "Invoerkosten (€660) zijn 82x de schuld (€8)",
          "Maatschappelijke schade van €15,551 bij doorinnen",
        ],
        suggestedSteps: [
          "Directe kwijtschelding zonder proces",
          "Informeer schuldhulpverlener",
          "Geen verdere invorderingsacties",
        ],
      },
      estimatedSavings: {
        direct: 655,
        societal: 15551.25,
        total: 16206.25,
      },
    },
  },
];

// Helper function to get mock result by scenario ID
export function getMockResultByScenarioId(
  scenarioId: string,
): DebtAnalysisResponse | null {
  const result = mockSimulationResults.find((r) => r.scenarioId === scenarioId);
  return result ? result.response : null;
}

// Check if we should use mock data (for static demo)
export const USE_MOCK_DATA = (import.meta as any).env?.VITE_USE_MOCK_DATA === "true";
