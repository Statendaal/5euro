import { DebtAnalysisResponse, recommendationLabels } from "../types";
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: DebtAnalysisResponse;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const {
    financialAnalysis,
    societalImpact,
    recommendation,
    estimatedSavings,
    alternatives,
  } = analysis;

  const getRecommendationColor = () => {
    switch (recommendation.action) {
      case "forgive":
        return "bg-green-100 border-green-400 text-green-900";
      case "payment_plan":
      case "refer_to_assistance":
        return "bg-amber-100 border-amber-400 text-amber-900";
      default:
        return "bg-blue-100 border-blue-400 text-blue-900";
    }
  };

  const getRecommendationIcon = () => {
    switch (recommendation.action) {
      case "forgive":
        return <CheckCircle className="w-6 h-6 text-green-700" />;
      case "payment_plan":
      case "refer_to_assistance":
        return <AlertTriangle className="w-6 h-6 text-amber-700" />;
      default:
        return <TrendingUp className="w-6 h-6 text-blue-700" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Alert */}
      <div className={`border-2 rounded-lg p-6 ${getRecommendationColor()}`}>
        <div className="flex items-start gap-4">
          {getRecommendationIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">
              ADVIES:{" "}
              {recommendationLabels[recommendation.action].toUpperCase()}
            </h3>
            <div className="space-y-2 text-sm">
              {recommendation.reasoning.map((reason, i) => (
                <p key={i}>• {reason}</p>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <p className="text-xs font-medium">
                Betrouwbaarheid: {recommendation.confidence}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Analysis */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Financiële Analyse
        </h3>

        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-700">Schuldbedrag:</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(financialAnalysis.debtAmount)}
            </span>
          </div>

          {/* Scenario 1: Standard Collection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Scenario 1: Standaard Invorderingstraject
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Brief 1 (herinnering)</span>
                <span>
                  {formatCurrency(financialAnalysis.collectionCosts.reminder)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Brief 2 (aanmaning)</span>
                <span>
                  {formatCurrency(financialAnalysis.collectionCosts.summons)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Incassobureau</span>
                <span>
                  {formatCurrency(
                    financialAnalysis.collectionCosts.collectionAgency,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Deurwaarder</span>
                <span>
                  {formatCurrency(financialAnalysis.collectionCosts.bailiff)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Eventuele rechtbank</span>
                <span>
                  {formatCurrency(financialAnalysis.collectionCosts.court)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Interne uren</span>
                <span>
                  {formatCurrency(
                    financialAnalysis.collectionCosts.internalHours,
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>TOTAAL</span>
                <span>
                  {formatCurrency(financialAnalysis.collectionCosts.total)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg">
              <div className="space-y-1 text-sm text-gray-900">
                <div className="flex justify-between">
                  <span>Succeskans:</span>
                  <span className="font-medium">
                    {formatPercentage(financialAnalysis.successProbability)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Verwachte opbrengst:</span>
                  <span className="font-medium">
                    {formatCurrency(financialAnalysis.expectedRevenue)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-red-900 mt-2 pt-2 border-t-2 border-red-400">
                  <span>❌ Verlies:</span>
                  <span>
                    {formatCurrency(Math.abs(financialAnalysis.netResult))}
                  </span>
                </div>
                <div className="text-xs text-red-900 font-medium mt-2 bg-red-200 px-2 py-1 rounded">
                  Ratio: {financialAnalysis.costToDebtRatio.toFixed(0)}:1
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Scenarios */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Alternatieve Scenario's
            </h4>
            <div className="space-y-3">
              {alternatives.map((alt, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border-2 ${
                    alt.recommended
                      ? "bg-green-100 border-green-400 border-2"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      {alt.recommended && "✅ "}
                      {recommendationLabels[alt.action]}
                    </span>
                    <span className="text-sm text-gray-600">
                      Kosten: {formatCurrency(alt.costs)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Verwachte opbrengst:</span>
                      <span>{formatCurrency(alt.expectedRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maatschappelijke baat:</span>
                      <span>{formatCurrency(alt.societalBenefit)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-current border-opacity-20">
                      <span>Totale baat:</span>
                      <span className="text-green-800 font-semibold">
                        {formatCurrency(alt.totalBenefit)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Societal Impact */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🏥 Maatschappelijke Impact Analyse
          <span className="text-sm font-normal text-gray-500">
            (Risicoscore: {societalImpact.riskScore}/100)
          </span>
        </h3>

        <div className="space-y-4">
          {/* Risk Profile Indicator */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Risicoprofiel burger</span>
              <span
                className={`font-medium ${
                  societalImpact.riskScore > 70
                    ? "text-red-600"
                    : societalImpact.riskScore > 50
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {societalImpact.riskScore > 70
                  ? "HOOG"
                  : societalImpact.riskScore > 50
                    ? "GEMIDDELD"
                    : "LAAG"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  societalImpact.riskScore > 70
                    ? "bg-red-600"
                    : societalImpact.riskScore > 50
                      ? "bg-yellow-600"
                      : "bg-green-600"
                }`}
                style={{ width: `${societalImpact.riskScore}%` }}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Voorspelde maatschappelijke kosten bij doorinnen:
            </h4>

            <div className="space-y-3">
              {/* Healthcare */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">Gezondheid</span>
                  <span className="text-sm text-gray-600">
                    {formatPercentage(
                      societalImpact.estimatedCosts.healthcare.probability,
                    )}{" "}
                    kans
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>• GGZ behandeling</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.healthcare.ggzTreatment,
                      )}
                      /jaar
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Huisartsbezoeken</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.healthcare.gpVisits,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Medicijngebruik</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.healthcare.medication,
                      )}
                      /jaar
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-300">
                    <span>Subtotaal:</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.healthcare.total,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">Werk</span>
                  <span className="text-sm text-gray-600">
                    {formatPercentage(
                      societalImpact.estimatedCosts.employment.probability,
                    )}{" "}
                    kans
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>• Verminderde re-integratie</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.employment
                          .reducedReintegration,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Langere uitkering</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.employment
                          .longerBenefitPeriod,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-300">
                    <span>Subtotaal:</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.employment.total,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Debt Assistance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">
                    Schuldhulpverlening
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatPercentage(
                      societalImpact.estimatedCosts.debtAssistance.probability,
                    )}{" "}
                    kans
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>• Intake en trajectbegeleiding</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.debtAssistance.intake,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Intensivering traject</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.debtAssistance.trajectory,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Beschermingsbewind mogelijk</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.debtAssistance
                          .administration,
                      )}
                      /jaar
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-300">
                    <span>Subtotaal:</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.debtAssistance.total,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Domestic Violence */}
              {societalImpact.estimatedCosts.domesticViolence.total > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      Huiselijk geweld
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatPercentage(
                        societalImpact.estimatedCosts.domesticViolence
                          .probability,
                      )}{" "}
                      kans
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>• Politie, Veilig Thuis</span>
                      <span>
                        {formatCurrency(
                          societalImpact.estimatedCosts.domesticViolence
                            .policeCosts,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Opvang/begeleiding</span>
                      <span>
                        {formatCurrency(
                          societalImpact.estimatedCosts.domesticViolence
                            .shelterCosts,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-300">
                      <span>Subtotaal (gewogen):</span>
                      <span>
                        {formatCurrency(
                          societalImpact.estimatedCosts.domesticViolence.total,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">
                    Juridische escalatie
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>• Juridische bijstand burger</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.legal.legalAid,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Rechtbankprocedures</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.legal.courtProcedures,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Deurwaarder/beslag</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.legal.enforcement,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-300">
                    <span>Subtotaal:</span>
                    <span>
                      {formatCurrency(
                        societalImpact.estimatedCosts.legal.total,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Societal Cost */}
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-red-900 text-lg">
                      TOTALE MAATSCHAPPELIJKE KOSTEN
                    </div>
                    <div className="text-sm text-red-700 mt-1">
                      💡 Voor een schuld van{" "}
                      {formatCurrency(financialAnalysis.debtAmount)} ontstaat{" "}
                      {formatCurrency(
                        societalImpact.estimatedCosts.totalSocietalCost,
                      )}{" "}
                      maatschappelijke schade
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Ratio: {societalImpact.totalCostToDebtRatio.toFixed(0)}:1
                      (schade vs schuld)
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-900">
                    {formatCurrency(
                      societalImpact.estimatedCosts.totalSocietalCost,
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Actions */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🎯 Aanbeveling
          <AlertCircle className="w-5 h-5 text-gray-500" />
        </h3>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold text-green-700 mb-2">
            ✅ {recommendationLabels[recommendation.action].toUpperCase()}
          </h4>

          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p className="font-medium">Voorgestelde actie:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              {recommendation.suggestedSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Geschatte totale besparing:
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">• Direct:</span>
                <span className="font-medium">
                  {formatCurrency(estimatedSavings.direct)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">• Maatschappelijk:</span>
                <span className="font-medium">
                  {formatCurrency(estimatedSavings.societal)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-green-700 text-lg pt-2 border-t border-gray-200">
                <span>TOTAAL:</span>
                <span>{formatCurrency(estimatedSavings.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              alert(
                "In een echte implementatie zou hier de actie worden uitgevoerd",
              )
            }
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {recommendationLabels[recommendation.action]} Uitvoeren
          </button>
          <button
            onClick={() =>
              alert(
                "In een echte implementatie zou dit een alternatief scenario starten",
              )
            }
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Toch Invorderen
          </button>
        </div>
      </div>
    </div>
  );
}
