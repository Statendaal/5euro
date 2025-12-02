import { useState } from 'react';
import { analyzeDebt } from '../api';
import { DebtAnalysisRequest, DebtAnalysisResponse, DebtType, IncomeSource, debtTypeLabels, incomeSourceLabels } from '../types';
import { Loader2, Sparkles } from 'lucide-react';
import { getRandomRealisticCase } from '../data/realisticCases';

interface DebtAnalysisFormProps {
  onAnalysisComplete: (result: DebtAnalysisResponse) => void;
}

export function DebtAnalysisForm({ onAnalysisComplete }: DebtAnalysisFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DebtAnalysisRequest>(getRandomRealisticCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await analyzeDebt(formData);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analyse mislukt. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const loadMockExample = () => {
    // Load a random realistic case from our 10 CBS-based examples
    const randomCase = getRandomRealisticCase();
    setFormData(randomCase);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Nieuwe Schuld Analyse</h2>
            <p className="text-sm text-gray-600 mt-1">
              Voer de schuld- en burgergegevens in voor een complete kosten-baten analyse
            </p>
          </div>
          <button
            type="button"
            onClick={loadMockExample}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Voorbeeld laden
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Schuld Gegevens */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schuld Gegevens</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrag (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.debt.amount}
                  onChange={(e) => setFormData({
                    ...formData,
                    debt: { ...formData.debt, amount: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Schuld
                </label>
                <select
                  value={formData.debt.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    debt: { ...formData.debt, type: e.target.value as DebtType }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(debtTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ontstaan op
                </label>
                <input
                  type="date"
                  value={formData.debt.originDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    debt: { ...formData.debt, originDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vervaldatum
                </label>
                <input
                  type="date"
                  value={formData.debt.dueDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    debt: { ...formData.debt, dueDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Burger Informatie */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Burger Informatie</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BSN
                </label>
                <input
                  type="text"
                  value={formData.citizen.bsn}
                  onChange={(e) => setFormData({
                    ...formData,
                    citizen: { ...formData.citizen, bsn: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inkomen per maand (€)
                </label>
                <input
                  type="number"
                  value={formData.citizen.income}
                  onChange={(e) => setFormData({
                    ...formData,
                    citizen: { ...formData.citizen, income: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inkomensbron
                </label>
                <select
                  value={formData.citizen.incomeSource}
                  onChange={(e) => setFormData({
                    ...formData,
                    citizen: { ...formData.citizen, incomeSource: e.target.value as IncomeSource }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {Object.entries(incomeSourceLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aantal andere schulden
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.citizen.otherDebtsCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    citizen: { ...formData.citizen, otherDebtsCount: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.citizen.inDebtAssistance}
                    onChange={(e) => setFormData({
                      ...formData,
                      citizen: { ...formData.citizen, inDebtAssistance: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Burger is al in schuldhulpverlening
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyseren...
                </>
              ) : (
                'Analyseer Schuld'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
