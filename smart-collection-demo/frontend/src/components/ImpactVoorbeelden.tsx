import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  Euro,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  impactVoorbeelden,
  categoryLabels,
  categoryDescriptions,
  ImpactExample,
} from "../data/impactVoorbeelden";

export function ImpactVoorbeelden() {
  const [selectedCategory, setSelectedCategory] = useState<ImpactExample['category'] | 'all'>('all');
  const [selectedExample, setSelectedExample] = useState<ImpactExample | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredExamples = selectedCategory === 'all'
    ? impactVoorbeelden
    : impactVoorbeelden.filter(ex => ex.category === selectedCategory);

  const getCategoryColor = (category: ImpactExample['category']) => {
    switch (category) {
      case 'ambtshalve':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'vroegsignalering':
        return 'bg-blue-50 border-blue-300 text-blue-900';
      case 'beslissing':
        return 'bg-amber-50 border-amber-300 text-amber-900';
      case 'maatschappelijk':
        return 'bg-green-50 border-green-300 text-green-900';
    }
  };

  const getCategoryIcon = (category: ImpactExample['category']) => {
    switch (category) {
      case 'ambtshalve':
        return AlertTriangle;
      case 'vroegsignalering':
        return Eye;
      case 'beslissing':
        return Target;
      case 'maatschappelijk':
        return Users;
    }
  };

  if (selectedExample) {
    const CategoryIcon = getCategoryIcon(selectedExample.category);
    const savings = selectedExample.impact.financieel.voor - selectedExample.impact.financieel.na;
    const maatschappelijkeBesparing = selectedExample.impact.maatschappelijk.voor - selectedExample.impact.maatschappelijk.na;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedExample(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar overzicht
        </button>

        {/* Example Detail */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className={`${getCategoryColor(selectedExample.category)} rounded-lg p-6 mb-6`}>
            <div className="flex items-start gap-4">
              <CategoryIcon className="w-8 h-8 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedExample.title}</h2>
                <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-sm font-medium">
                  {categoryLabels[selectedExample.category]}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scenario</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Situatie:</p>
                <p className="text-gray-900">{selectedExample.scenario.situatie}</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <p className="text-sm font-medium text-red-900 mb-2">Traditionele Aanpak:</p>
                <p className="text-red-800">{selectedExample.scenario.beslissing}</p>
              </div>
              {selectedExample.scenario.alternatief && (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">Vroegsignalering / Smart Collection:</p>
                  <p className="text-green-800">{selectedExample.scenario.alternatief}</p>
                </div>
              )}
            </div>
          </div>

          {/* Impact Comparison */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Vergelijking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financieel */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Euro className="w-5 h-5 text-gray-600" />
                  Financiële Impact
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Traditionele aanpak:</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(selectedExample.impact.financieel.voor)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Met vroegsignalering:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedExample.impact.financieel.na)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${(selectedExample.impact.financieel.na / selectedExample.impact.financieel.voor) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-900">Besparing:</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(savings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Maatschappelijk */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  Maatschappelijke Impact
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Zonder interventie:</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(selectedExample.impact.maatschappelijk.voor)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Met vroegsignalering:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedExample.impact.maatschappelijk.na)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: selectedExample.impact.maatschappelijk.voor > 0
                            ? `${(selectedExample.impact.maatschappelijk.na / selectedExample.impact.maatschappelijk.voor) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                  {maatschappelijkeBesparing > 0 && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-900">Voorkomen schade:</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(maatschappelijkeBesparing)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Burger Impact */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact op Burger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedExample.impact.burger.map((impact, idx) => (
                <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-900">{impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lessen */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-yellow-600" />
              Belangrijkste Lessen
            </h3>
            <ul className="space-y-2">
              {selectedExample.lessen.map((les, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-900">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{les}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Impact van Beslissingen: Concrete Voorbeelden
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Bekijk hoe verschillende beslissingen en aanpakken impact hebben op burgers, organisaties en de maatschappij. 
          Elke case study toont een voor/na vergelijking met concrete cijfers en lessen.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter op Categorie</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alle Voorbeelden
          </button>
          {(Object.keys(categoryLabels) as ImpactExample['category'][]).map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? getCategoryColor(category)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {categoryLabels[category]}
              </button>
            );
          })}
        </div>
        {selectedCategory !== 'all' && (
          <p className="text-sm text-gray-600 mt-4">
            {categoryDescriptions[selectedCategory]}
          </p>
        )}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamples.map((example) => {
          const CategoryIcon = getCategoryIcon(example.category);
          const savings = example.impact.financieel.voor - example.impact.financieel.na;
          const maatschappelijkeBesparing = example.impact.maatschappelijk.voor - example.impact.maatschappelijk.na;

          return (
            <div
              key={example.id}
              className="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
              onClick={() => setSelectedExample(example)}
            >
              <div className={`${getCategoryColor(example.category)} p-4 rounded-t-lg`}>
                <div className="flex items-start gap-3">
                  <CategoryIcon className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{example.title}</h3>
                    <span className="inline-block px-2 py-1 bg-white/50 rounded text-xs font-medium">
                      {categoryLabels[example.category]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {example.scenario.situatie}
                </p>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Financiële besparing:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(savings)}
                    </span>
                  </div>
                  {maatschappelijkeBesparing > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Maatschappelijke besparing:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(maatschappelijkeBesparing)}
                      </span>
                    </div>
                  )}
                </div>

                <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Bekijk Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredExamples.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Geen voorbeelden gevonden voor deze categorie.</p>
        </div>
      )}
    </div>
  );
}

