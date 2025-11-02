import { useState, useEffect } from 'react';
import { bulkAnalyze } from '../api';
import { Loader2, TrendingUp, Users, Euro, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await bulkAnalyze({ amountLessThan: 100, limit: 100 });
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-600">
        Geen data beschikbaar. Probeer het opnieuw.
      </div>
    );
  }

  const chartData = [
    {
      name: 'Traditioneel',
      Kosten: data.impact.traditionalApproach.collectionCosts,
      Opbrengst: data.impact.traditionalApproach.expectedRevenue,
      'Maatschappelijk': Math.abs(data.impact.traditionalApproach.societalCosts),
    },
    {
      name: 'Smart Collection',
      Kosten: data.impact.smartCollectionApproach.collectionCosts,
      Opbrengst: data.impact.smartCollectionApproach.expectedRevenue,
      'Maatschappelijk': data.impact.smartCollectionApproach.societalCostsPrevented,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Analyse Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Analyse van {data.summary.totalDebts} kleine schulden (€ {formatCurrency(data.summary.totalAmount)})
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Totale Besparing</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(data.impact.savings.total)}
              </p>
              <p className="text-xs text-gray-500 mt-1">per maand</p>
            </div>
            <Euro className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Burgers Geholpen</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {data.recommendations.forgive.count + data.recommendations.paymentPlan.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">i.p.v. bestraft</p>
            </div>
            <Users className="w-10 h-10 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Effectiviteit</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {Math.round((data.recommendations.forgive.count + data.recommendations.paymentPlan.count) / data.summary.totalDebts * 100)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">schulden opgelost</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kwijtgescholden</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {data.recommendations.forgive.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(data.recommendations.forgive.totalAmount)}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kosten Vergelijking: Traditioneel vs Smart Collection
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Kosten" fill="#ef4444" name="Invorderingskosten" />
            <Bar dataKey="Opbrengst" fill="#22c55e" name="Verwachte Opbrengst" />
            <Bar dataKey="Maatschappelijk" fill="#f59e0b" name="Maatschappelijke Impact" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Approach */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">
            ❌ Traditionele Aanpak
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-red-700">Invorderingskosten:</span>
              <span className="font-medium text-red-900">
                {formatCurrency(data.impact.traditionalApproach.collectionCosts)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Verwachte opbrengst:</span>
              <span className="font-medium text-red-900">
                {formatCurrency(data.impact.traditionalApproach.expectedRevenue)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-red-300">
              <span className="text-red-700">Netto verlies:</span>
              <span className="font-bold text-red-900">
                {formatCurrency(data.impact.traditionalApproach.netLoss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-700">Maatschappelijke kosten:</span>
              <span className="font-bold text-red-900">
                {formatCurrency(Math.abs(data.impact.traditionalApproach.societalCosts))}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-red-400">
              <span className="text-red-800 font-bold">TOTALE SCHADE:</span>
              <span className="font-bold text-lg text-red-900">
                {formatCurrency(Math.abs(data.impact.traditionalApproach.totalLoss))}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Collection Approach */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            ✅ Smart Collection Aanpak
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Invorderingskosten:</span>
              <span className="font-medium text-green-900">
                {formatCurrency(data.impact.smartCollectionApproach.collectionCosts)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Verwachte opbrengst:</span>
              <span className="font-medium text-green-900">
                {formatCurrency(data.impact.smartCollectionApproach.expectedRevenue)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-green-300">
              <span className="text-green-700">Netto winst:</span>
              <span className="font-bold text-green-900">
                {formatCurrency(data.impact.smartCollectionApproach.netProfit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Voorkomde schade:</span>
              <span className="font-bold text-green-900">
                {formatCurrency(data.impact.smartCollectionApproach.societalCostsPrevented)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-green-400">
              <span className="text-green-800 font-bold">TOTALE BAAT:</span>
              <span className="font-bold text-lg text-green-900">
                {formatCurrency(data.impact.smartCollectionApproach.totalBenefit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">📈 Resultaat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-blue-100 text-sm">Directe besparing</p>
            <p className="text-3xl font-bold">{formatCurrency(data.impact.savings.direct)}</p>
            <p className="text-blue-100 text-xs">per maand</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Voorkomde schade</p>
            <p className="text-3xl font-bold">{formatCurrency(data.impact.savings.societal)}</p>
            <p className="text-blue-100 text-xs">per maand</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Totaal per jaar</p>
            <p className="text-3xl font-bold">{formatCurrency(data.impact.savings.perYear)}</p>
            <p className="text-blue-100 text-xs">geschatte jaarlijkse besparing</p>
          </div>
        </div>
      </div>

      {/* Top Wasteful Debt Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 5 Meest Verspillende Schuldentypen
        </h3>
        <div className="space-y-3">
          {data.topWastefulDebtTypes.slice(0, 5).map((type: any, i: number) => (
            <div key={i} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">
                    {i + 1}. {type.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({type.count}× voorkomend)
                  </span>
                </div>
                <span className="text-lg font-bold text-red-700">
                  Verlies: {formatCurrency(type.loss)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  Invorderingskosten: <span className="font-medium">{formatCurrency(type.totalCosts)}</span>
                </div>
                <div>
                  Verwachte opbrengst: <span className="font-medium">{formatCurrency(type.expectedRevenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-900">
            💡 Als u alleen deze Top 5 aanpakt met Smart Collection:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-green-700">
            <li>• Besparing: {formatCurrency(data.topWastefulDebtTypes.slice(0, 5).reduce((sum: number, t: any) => sum + t.loss, 0))} per periode</li>
            <li>• Impact: {data.topWastefulDebtTypes.slice(0, 5).reduce((sum: number, t: any) => sum + t.count, 0)} burgers geholpen</li>
          </ul>
        </div>
      </div>

      {/* Recommendations Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aanbevelingen Verdeling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Kwijtschelden</span>
              <span className="text-2xl font-bold text-green-700">
                {data.recommendations.forgive.count}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Totaalbedrag:</span>
                <span>{formatCurrency(data.recommendations.forgive.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kosten:</span>
                <span>{formatCurrency(data.recommendations.forgive.estimatedCosts)}</span>
              </div>
              <div className="flex justify-between font-medium text-green-700">
                <span>Besparing:</span>
                <span>{formatCurrency(data.recommendations.forgive.estimatedSavings)}</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Betalingsregeling</span>
              <span className="text-2xl font-bold text-blue-700">
                {data.recommendations.paymentPlan.count}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Totaalbedrag:</span>
                <span>{formatCurrency(data.recommendations.paymentPlan.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kosten:</span>
                <span>{formatCurrency(data.recommendations.paymentPlan.estimatedCosts)}</span>
              </div>
              <div className="flex justify-between font-medium text-blue-700">
                <span>Verwacht:</span>
                <span>{formatCurrency(data.recommendations.paymentPlan.expectedRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Consolideren</span>
              <span className="text-2xl font-bold text-yellow-700">
                {data.recommendations.consolidate.count}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Totaalbedrag:</span>
                <span>{formatCurrency(data.recommendations.consolidate.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kosten:</span>
                <span>{formatCurrency(data.recommendations.consolidate.estimatedCosts)}</span>
              </div>
              <div className="flex justify-between font-medium text-yellow-700">
                <span>Verwacht:</span>
                <span>{formatCurrency(data.recommendations.consolidate.expectedRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-gray-500 bg-gray-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Regulier invorderen</span>
              <span className="text-2xl font-bold text-gray-700">
                {data.recommendations.collectStandard.count}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Totaalbedrag:</span>
                <span>{formatCurrency(data.recommendations.collectStandard.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kosten:</span>
                <span>{formatCurrency(data.recommendations.collectStandard.estimatedCosts)}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-700">
                <span>Verwacht:</span>
                <span>{formatCurrency(data.recommendations.collectStandard.expectedRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
