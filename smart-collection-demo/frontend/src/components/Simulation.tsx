import { useState } from "react";
import {
  Play,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { analyzeDebt } from "../api";
import { DebtAnalysisResponse } from "../types";
import {
  simulationScenarios,
  categoryLabels,
  categoryDescriptions,
  SimulationScenario,
} from "../simulationScenarios";
import { StakeholderView } from "./StakeholderView";

interface SimulationResult {
  scenario: SimulationScenario;
  analysis: DebtAnalysisResponse;
}

export function Simulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const runSimulation = async (scenario: SimulationScenario) => {
    setIsRunning(true);
    setCurrentScenario(scenario.id);

    try {
      const analysis = await analyzeDebt(scenario.request);

      setResults((prev) => {
        const filtered = prev.filter((r) => r.scenario.id !== scenario.id);
        return [...filtered, { scenario, analysis }];
      });

      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("simulation-results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Simulation error:", error);
      alert(
        "Er ging iets mis bij de simulatie. Controleer of de backend draait.",
      );
    } finally {
      setIsRunning(false);
      setCurrentScenario(null);
    }
  };

  const runAllSimulations = async () => {
    setIsRunning(true);
    setResults([]);

    for (const scenario of simulationScenarios) {
      setCurrentScenario(scenario.id);

      try {
        const analysis = await analyzeDebt(scenario.request);
        setResults((prev) => [...prev, { scenario, analysis }]);

        // Small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Simulation error:", error);
      }
    }

    setIsRunning(false);
    setCurrentScenario(null);

    // Scroll to results
    setTimeout(() => {
      document
        .getElementById("simulation-results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const filteredScenarios = selectedCategory
    ? simulationScenarios.filter((s) => s.category === selectedCategory)
    : simulationScenarios;

  const groupedScenarios = filteredScenarios.reduce(
    (acc, scenario) => {
      if (!acc[scenario.category]) {
        acc[scenario.category] = [];
      }
      acc[scenario.category].push(scenario);
      return acc;
    },
    {} as Record<string, SimulationScenario[]>,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Burger & Schuld Simulaties
            </h2>
            <p className="text-gray-600 mb-4">
              Simuleer verschillende burger profielen en schuld types om de
              impact van smart collection te zien. Elk scenario toont directe en
              maatschappelijke kosten.
            </p>
          </div>
          <button
            onClick={runAllSimulations}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-5 h-5" />
            {isRunning ? "Simulatie loopt..." : "Simuleer Alles"}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Alle Categorieën
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stakeholder View */}
      <StakeholderView />

      {/* Scenario Cards */}
      <div className="space-y-6">
        {Object.entries(groupedScenarios).map(([category, scenarios]) => (
          <div key={category}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <p className="text-sm text-gray-600">
                {
                  categoryDescriptions[
                    category as keyof typeof categoryDescriptions
                  ]
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className={`w-5 h-5 ${scenario.iconColor}`} />
                      <h4 className="font-semibold text-gray-900">
                        {scenario.name}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {scenario.description}
                  </p>

                  <div className="flex gap-2 text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      €{scenario.request.debt.amount}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {scenario.request.debt.type}
                    </span>
                  </div>

                  <button
                    onClick={() => runSimulation(scenario)}
                    disabled={isRunning}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentScenario === scenario.id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {currentScenario === scenario.id ? "Bezig..." : "Simuleer"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div id="simulation-results" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Simulatie Resultaten
            </h3>
            <p className="text-gray-600 mb-6">
              {results.length} scenario{results.length !== 1 ? "'s" : ""}{" "}
              gesimuleerd
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                  <h4 className="font-semibold text-green-900">
                    Totale Besparing
                  </h4>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  €
                  {results
                    .reduce((sum, r) => {
                      const traditionalCost =
                        r.analysis.financialAnalysis.collectionCosts.total;
                      const smartCost =
                        r.analysis.alternatives.find(
                          (alt) =>
                            alt.action === r.analysis.recommendation.action,
                        )?.costs || 0;
                      return sum + (traditionalCost - smartCost);
                    }, 0)
                    .toFixed(0)}
                </p>
              </div>

              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-700" />
                  <h4 className="font-semibold text-blue-900">Kwijtschelden</h4>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {
                    results.filter(
                      (r) => r.analysis.recommendation.action === "forgive",
                    ).length
                  }
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">
                    Maatsch. Impact
                  </h4>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  €
                  {results
                    .reduce(
                      (sum, r) =>
                        sum +
                        r.analysis.societalImpact.estimatedCosts
                          .totalSocietalCost,
                      0,
                    )
                    .toFixed(0)}
                </p>
              </div>
            </div>

            {/* Individual Results */}
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.scenario.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users
                          className={`w-4 h-4 ${result.scenario.iconColor}`}
                        />
                        <h5 className="font-semibold text-gray-900">
                          {result.scenario.name}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.scenario.description}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.analysis.recommendation.action === "forgive"
                          ? "bg-green-200 text-green-900 border border-green-400"
                          : result.analysis.recommendation.action ===
                              "payment_plan"
                            ? "bg-blue-200 text-blue-900 border border-blue-400"
                            : result.analysis.recommendation.action ===
                                "refer_to_assistance"
                              ? "bg-amber-200 text-amber-900 border border-amber-400"
                              : "bg-gray-200 text-gray-900 border border-gray-400"
                      }`}
                    >
                      {result.analysis.recommendation.action === "forgive" &&
                        "Kwijtschelden"}
                      {result.analysis.recommendation.action ===
                        "payment_plan" && "Betalingsregeling"}
                      {result.analysis.recommendation.action ===
                        "consolidate" && "Consolideren"}
                      {result.analysis.recommendation.action ===
                        "collect_standard" && "Invorderen"}
                      {result.analysis.recommendation.action ===
                        "refer_to_assistance" && "Doorverwijzen"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Schuld</p>
                      <p className="font-semibold text-gray-900">
                        €{result.analysis.financialAnalysis.debtAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">
                        Invoer Kosten
                      </p>
                      <p className="font-semibold text-red-600">
                        €
                        {result.analysis.financialAnalysis.collectionCosts.total.toFixed(
                          0,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Smart Kosten</p>
                      <p className="font-semibold text-green-600">
                        €
                        {(
                          result.analysis.alternatives.find(
                            (alt) =>
                              alt.action ===
                              result.analysis.recommendation.action,
                          )?.costs || 0
                        ).toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Besparing</p>
                      <p className="font-semibold text-green-700">
                        €
                        {(
                          result.analysis.financialAnalysis.collectionCosts
                            .total -
                          (result.analysis.alternatives.find(
                            (alt) =>
                              alt.action ===
                              result.analysis.recommendation.action,
                          )?.costs || 0)
                        ).toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Risico Score</p>
                      <p className="font-semibold text-orange-600">
                        {result.analysis.societalImpact.riskScore}/100
                      </p>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Reden:</span>{" "}
                      {result.analysis.recommendation.reasoning[0]}
                    </p>
                  </div>

                  {/* ML Statistics */}
                  {(result.analysis as any).mlEnhanced &&
                    (result.analysis as any).mlInsights && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <p className="text-xs font-semibold text-purple-700">
                            AI Model Analyse (Nauwkeurigheid:{" "}
                            {(
                              (result.analysis as any).mlInsights
                                .modelAccuracy * 100
                            ).toFixed(1)}
                            %)
                          </p>
                        </div>

                        {/* Confidence Score */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Zekerheid:</span>
                            <span className="font-medium text-purple-700">
                              {result.analysis.recommendation.confidence.toFixed(
                                1,
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${result.analysis.recommendation.confidence}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Alternative Probabilities */}
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 mb-1">
                            Alternatieve kansen:
                          </p>
                          {Object.entries(
                            (result.analysis as any).mlInsights.probabilities,
                          )
                            .sort((a, b) => (b[1] as number) - (a[1] as number))
                            .map(([action, prob]) => (
                              <div
                                key={action}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-600">
                                  {action === "FORGIVE" && "🎯 Kwijtschelden"}
                                  {action === "PAYMENT_PLAN" &&
                                    "📋 Betalingsregeling"}
                                  {action === "REFER_TO_ASSISTANCE" &&
                                    "🤝 Doorverwijzen"}
                                  {action === "REMINDER" && "📨 Invorderen"}
                                </span>
                                <span className="font-mono text-gray-700">
                                  {((prob as number) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>

                        {/* Key Features Used */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <details className="text-xs">
                            <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
                              Model features (
                              {
                                Object.keys(
                                  (result.analysis as any).mlInsights.features,
                                ).length
                              }
                              )
                            </summary>
                            <div className="mt-2 space-y-1 pl-2">
                              {Object.entries(
                                (result.analysis as any).mlInsights.features,
                              )
                                .slice(0, 6)
                                .map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="text-gray-500">
                                      {key}:
                                    </span>
                                    <span className="font-mono text-gray-700">
                                      {typeof value === "boolean"
                                        ? value
                                          ? "✓"
                                          : "✗"
                                        : typeof value === "number"
                                          ? value.toFixed(2)
                                          : String(value)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
