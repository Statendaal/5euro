import { useState, useEffect } from 'react';
import { Loader2, Users, TrendingDown, AlertCircle, MapPin, Briefcase, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CBSDashboardData {
  overview: Array<{
    thema: string;
    totalRecords: number;
    avgPercentage: number;
    topLabels: Array<{ label: string; percentage: number }>;
  }>;
  vulnerableGroups: Array<{
    thema: string;
    label: string;
    percentage: number;
    aantal: number;
  }>;
  income: {
    lowIncome: number;
    benefits: Array<{ type: string; percentage: number }>;
    averageIncome: Array<{ label: string; percentage: number }>;
  };
  demographics: {
    age: Array<{ range: string; percentage: number }>;
    household: Array<{ type: string; percentage: number }>;
    origin: Array<{ category: string; percentage: number }>;
  };
  topMunicipalities: Array<{
    gemeentenaam: string;
    avgPercentage: number;
    totalRecords: number;
  }>;
  totalDebtors: number;
  year: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function CBSDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CBSDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCBSData();
  }, []);

  const loadCBSData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/v1/cbs/dashboard?jaar=2024-01');
      if (!response.ok) throw new Error('Failed to fetch CBS data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to load CBS data:', error);
      setError('Kon CBS data niet laden. Controleer of de backend draait.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('nl-NL').format(Math.round(num));
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-red-700">{error || 'Geen data beschikbaar'}</p>
        <button
          onClick={loadCBSData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Probeer opnieuw
        </button>
      </div>
    );
  }

  // Prepare chart data
  const themaData = data.overview.map(o => ({
    name: o.thema.length > 20 ? o.thema.substring(0, 18) + '...' : o.thema,
    percentage: o.avgPercentage
  }));

  const benefitsData = data.income.benefits.slice(0, 3).map(b => ({
    name: b.type.replace(' in huishouden', '').substring(0, 25),
    percentage: b.percentage
  }));

  const householdData = data.demographics.household.map(h => ({
    name: h.type.replace(/^\d+\s/, ''),
    value: h.percentage
  }));

  const ageData = data.demographics.age.map(a => ({
    name: a.range.replace(/^\d+\s/, ''),
    percentage: a.percentage
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">CBS Schuldenstatistieken {data.year.split('-')[0]}</h2>
        <p className="text-blue-100 text-lg">
          Echte data van {formatNumber(data.totalDebtors)} huishoudens met geregistreerde schulden in Nederland
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-red-600" />
            <span className="text-xs text-gray-500">Totaal</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalDebtors)}</p>
          <p className="text-sm text-gray-600 mt-1">Huishoudens met schulden</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-orange-600" />
            <span className="text-xs text-gray-500">Inkomen</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.income.lowIncome)}</p>
          <p className="text-sm text-gray-600 mt-1">Laag huishoudinkomen</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-gray-500">Uitkeringen</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPercentage(data.income.benefits[0]?.percentage || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Met uitkering</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-gray-500">Kwetsbaar</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(data.vulnerableGroups.length)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Kwetsbare groepen</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thema Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Schuldenaren per Thema</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={themaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="percentage" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Household Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Type Huishouden</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={householdData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name.substring(0, 15)}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {householdData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Benefits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Uitkeringen</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benefitsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} style={{ fontSize: '12px' }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="percentage" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leeftijdsverdeling</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="percentage" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Municipalities */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Top 10 Gemeenten met Meeste Schulden</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {data.topMunicipalities.map((gemeente, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-600">#{idx + 1}</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-2">{gemeente.gemeentenaam}</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(gemeente.totalRecords)}</p>
              <p className="text-xs text-gray-600">huishoudens met schulden</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerable Groups */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">Meest Kwetsbare Groepen (Top 10)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thema</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.vulnerableGroups.slice(0, 10).map((group, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{group.label.substring(0, 50)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{group.thema}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-orange-600">
                    {formatPercentage(group.percentage)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{formatNumber(group.aantal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-semibold mb-1">📊 Databron</p>
        <p>
          Deze statistieken zijn gebaseerd op officiële CBS data over {formatNumber(data.totalDebtors)} huishoudens
          met geregistreerde schulden in Nederland ({data.year.split('-')[0]}).
          De data toont demografische kenmerken, inkomenssituatie, en kwetsbare groepen.
        </p>
      </div>
    </div>
  );
}
