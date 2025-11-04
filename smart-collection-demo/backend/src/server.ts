import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CostCalculator } from "./calculator";
import { getMLRecommendation, checkMLHealth } from "./mlService";
import { DebtAnalysisRequest } from "./types";
import { mockDebts } from "./mockData";
import {
  getDashboardData,
  getCBSOverview,
  getIncomeStatistics,
  getDemographics,
  getTopMunicipalities,
} from "./cbsService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize calculator
const calculator = new CostCalculator();

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ML Health check

// Analyze single debt with ML
app.post("/api/v1/debts/analyze", async (req: Request, res: Response) => {
  try {
    const request: DebtAnalysisRequest = req.body;
    if (!request.debt || !request.citizen) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const mlResult = await getMLRecommendation(request);
    const analysis = calculator.analyze(request);
    const enhanced = {
      ...analysis,
      mlEnhanced: true,
      recommendation: {
        ...analysis.recommendation,
        action: mlResult.recommendation,
        confidence: mlResult.confidence * 100,
      },
      mlInsights: mlResult.mlInsights,
    };
    res.json(enhanced);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/ml/health", async (req: Request, res: Response) => {
  const isHealthy = await checkMLHealth();
  res.json({ mlApiAvailable: isHealthy, timestamp: new Date().toISOString() });
});

// Analyze single debt
// Bulk analysis
app.post("/api/v1/debts/bulk-analyze", (req: Request, res: Response) => {
  try {
    const { filters = {} } = req.body;
    const { amountLessThan = 100, limit = 1000 } = filters;

    // Filter mock debts
    const filteredDebts = mockDebts
      .filter((d) => d.debt.amount < amountLessThan)
      .slice(0, limit);

    // Analyze each debt
    const analyses = filteredDebts.map((debt) => calculator.analyze(debt));

    // Calculate summary
    const totalDebts = analyses.length;
    const totalAmount = analyses.reduce(
      (sum, a) => sum + a.financialAnalysis.debtAmount,
      0,
    );
    const averageAmount = totalAmount / totalDebts;

    // Group by recommendation
    const recommendations = {
      forgive: analyses.filter((a) => a.recommendation.action === "forgive"),
      paymentPlan: analyses.filter(
        (a) => a.recommendation.action === "payment_plan",
      ),
      consolidate: analyses.filter(
        (a) => a.recommendation.action === "consolidate",
      ),
      collectStandard: analyses.filter(
        (a) => a.recommendation.action === "collect_standard",
      ),
      referToAssistance: analyses.filter(
        (a) => a.recommendation.action === "refer_to_assistance",
      ),
    };

    // Calculate impact
    const traditionalCollectionCosts = totalDebts * 73; // Average incasso cost
    const traditionalExpectedRevenue = analyses.reduce(
      (sum, a) => sum + a.financialAnalysis.debtAmount * 0.3,
      0,
    );
    const traditionalSocietalCosts = analyses.reduce(
      (sum, a) => sum + a.societalImpact.estimatedCosts.totalSocietalCost * 0.7,
      0,
    );

    const smartCollectionCosts = analyses.reduce(
      (sum, a) =>
        sum +
        a.alternatives.find((alt) => alt.action === a.recommendation.action)!
          .costs,
      0,
    );
    const smartExpectedRevenue = analyses.reduce(
      (sum, a) =>
        sum +
        a.alternatives.find((alt) => alt.action === a.recommendation.action)!
          .expectedRevenue,
      0,
    );
    const smartSocietalCostsPrevented = analyses.reduce(
      (sum, a) =>
        sum +
        a.alternatives.find((alt) => alt.action === a.recommendation.action)!
          .societalBenefit,
      0,
    );

    // Top wasteful debt types
    const debtTypeStats = new Map<
      string,
      { count: number; totalCosts: number; totalRevenue: number }
    >();
    analyses.forEach((a) => {
      const type =
        filteredDebts.find(
          (d) => calculator.analyze(d).analysisId === a.analysisId,
        )?.debt.type || "unknown";
      const stats = debtTypeStats.get(type) || {
        count: 0,
        totalCosts: 0,
        totalRevenue: 0,
      };
      stats.count++;
      stats.totalCosts += a.financialAnalysis.collectionCosts.total;
      stats.totalRevenue += a.financialAnalysis.expectedRevenue;
      debtTypeStats.set(type, stats);
    });

    const topWastefulDebtTypes = Array.from(debtTypeStats.entries())
      .map(([type, stats]) => ({
        type,
        count: stats.count,
        avgAmount: totalAmount / stats.count,
        totalCosts: stats.totalCosts,
        expectedRevenue: stats.totalRevenue,
        loss: stats.totalCosts - stats.totalRevenue,
      }))
      .sort((a, b) => b.loss - a.loss)
      .slice(0, 10);

    const response = {
      summary: {
        totalDebts,
        totalAmount,
        averageAmount,
      },
      recommendations: {
        forgive: {
          count: recommendations.forgive.length,
          totalAmount: recommendations.forgive.reduce(
            (sum, a) => sum + a.financialAnalysis.debtAmount,
            0,
          ),
          estimatedCosts: recommendations.forgive.length * 5,
          estimatedSavings: recommendations.forgive.reduce(
            (sum, a) => sum + a.estimatedSavings.total,
            0,
          ),
        },
        paymentPlan: {
          count: recommendations.paymentPlan.length,
          totalAmount: recommendations.paymentPlan.reduce(
            (sum, a) => sum + a.financialAnalysis.debtAmount,
            0,
          ),
          estimatedCosts: recommendations.paymentPlan.length * 40,
          expectedRevenue: recommendations.paymentPlan.reduce(
            (sum, a) =>
              sum +
              a.alternatives.find((alt) => alt.action === "payment_plan")!
                .expectedRevenue,
            0,
          ),
        },
        consolidate: {
          count: recommendations.consolidate.length,
          totalAmount: recommendations.consolidate.reduce(
            (sum, a) => sum + a.financialAnalysis.debtAmount,
            0,
          ),
          estimatedCosts: recommendations.consolidate.length * 20,
          expectedRevenue: recommendations.consolidate.reduce(
            (sum, a) =>
              sum +
              a.alternatives.find((alt) => alt.action === "consolidate")!
                .expectedRevenue,
            0,
          ),
        },
        collectStandard: {
          count: recommendations.collectStandard.length,
          totalAmount: recommendations.collectStandard.reduce(
            (sum, a) => sum + a.financialAnalysis.debtAmount,
            0,
          ),
          estimatedCosts: recommendations.collectStandard.length * 73,
          expectedRevenue: recommendations.collectStandard.reduce(
            (sum, a) => sum + a.financialAnalysis.expectedRevenue,
            0,
          ),
        },
      },
      impact: {
        traditionalApproach: {
          collectionCosts: traditionalCollectionCosts,
          expectedRevenue: traditionalExpectedRevenue,
          netLoss: traditionalExpectedRevenue - traditionalCollectionCosts,
          societalCosts: traditionalSocietalCosts,
          totalLoss:
            traditionalExpectedRevenue -
            traditionalCollectionCosts -
            traditionalSocietalCosts,
        },
        smartCollectionApproach: {
          collectionCosts: smartCollectionCosts,
          expectedRevenue: smartExpectedRevenue,
          netProfit: smartExpectedRevenue - smartCollectionCosts,
          societalCostsPrevented: smartSocietalCostsPrevented,
          totalBenefit:
            smartExpectedRevenue -
            smartCollectionCosts +
            smartSocietalCostsPrevented,
        },
        savings: {
          direct: traditionalCollectionCosts - smartCollectionCosts,
          societal: smartSocietalCostsPrevented,
          total:
            traditionalCollectionCosts -
            smartCollectionCosts +
            smartSocietalCostsPrevented,
          perYear:
            (traditionalCollectionCosts -
              smartCollectionCosts +
              smartSocietalCostsPrevented) *
            12,
        },
      },
      topWastefulDebtTypes,
    };

    res.json(response);
  } catch (error) {
    console.error("Bulk analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get dashboard metrics
app.get("/api/v1/dashboard/metrics", (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";

    // Mock dashboard data
    const response = {
      period,
      organization: "gemeente-amsterdam",
      kpis: {
        totalSavings: 2265200,
        citizensHelped: 2135,
        averageResolutionTime: "2.3 days",
        userSatisfaction: 7.8,
        preventedEscalations: 1891,
      },
      breakdown: {
        forgiveness: {
          count: 1423,
          savingsTotal: 1800000,
          satisfactionScore: 9.2,
        },
        paymentPlans: {
          count: 712,
          successRate: 0.68,
          savingsTotal: 320000,
        },
        consolidation: {
          count: 569,
          savingsTotal: 145200,
        },
      },
      trends: {
        savingsVsPreviousMonth: 0.12,
        citizensHelpedVsPreviousMonth: 0.23,
        satisfactionVsPreviousMonth: 0.05,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get mock debts list
app.get("/api/v1/debts/mock", (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(mockDebts.slice(0, limit));
});

// CBS Data Endpoints
app.get("/api/v1/cbs/dashboard", async (req: Request, res: Response) => {
  try {
    const jaar = (req.query.jaar as string) || "2024-01";
    const data = await getDashboardData(jaar);
    res.json(data);
  } catch (error) {
    console.error("CBS dashboard error:", error);
    res.status(500).json({ error: "Failed to load CBS dashboard data" });
  }
});

app.get("/api/v1/cbs/overview", async (req: Request, res: Response) => {
  try {
    const jaar = (req.query.jaar as string) || "2024-01";
    const data = await getCBSOverview(jaar);
    res.json(data);
  } catch (error) {
    console.error("CBS overview error:", error);
    res.status(500).json({ error: "Failed to load CBS overview" });
  }
});

app.get("/api/v1/cbs/income", async (req: Request, res: Response) => {
  try {
    const jaar = (req.query.jaar as string) || "2024-01";
    const data = await getIncomeStatistics(jaar);
    res.json(data);
  } catch (error) {
    console.error("CBS income error:", error);
    res.status(500).json({ error: "Failed to load CBS income data" });
  }
});

app.get("/api/v1/cbs/demographics", async (req: Request, res: Response) => {
  try {
    const jaar = (req.query.jaar as string) || "2024-01";
    const data = await getDemographics(jaar);
    res.json(data);
  } catch (error) {
    console.error("CBS demographics error:", error);
    res.status(500).json({ error: "Failed to load CBS demographics" });
  }
});

app.get("/api/v1/cbs/municipalities", async (req: Request, res: Response) => {
  try {
    const jaar = (req.query.jaar as string) || "2024-01";
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await getTopMunicipalities(jaar, limit);
    res.json(data);
  } catch (error) {
    console.error("CBS municipalities error:", error);
    res.status(500).json({ error: "Failed to load CBS municipalities" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Smart Collection API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Mock debts: http://localhost:${PORT}/api/v1/debts/mock`);
  console.log(`📈 CBS data: http://localhost:${PORT}/api/v1/cbs/dashboard`);
});

export default app;
