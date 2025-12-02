import { useState } from "react";
import {
  Play,
  Eye,
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  Clock,
  Euro,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  vroegsignaleringScenarios,
  categorieLabels,
  VroegsignaleringScenario,
} from "../data/vroegsignaleringScenarios";

export function VroegsignaleringSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<VroegsignaleringScenario | null>(null);
  const [selectedAanpak, setSelectedAanpak] = useState<"traditioneel" | "vroegsignalering" | "beide">("beide");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const playAnimation = () => {
    if (!selectedScenario) return;
    
    setIsPlaying(true);
    const maxSteps = Math.max(
      selectedScenario.traditioneleAanpak.length,
      selectedScenario.vroegsignaleringAanpak.length
    );
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      
      if (step >= maxSteps) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1500);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const getStepColor = (stepIndex: number, isVroegsignalering: boolean) => {
    if (stepIndex <= currentStep) {
      return isVroegsignalering ? "bg-green-500" : "bg-red-500";
    }
    return "bg-gray-300";
  };

  const getStepBorderColor = (stepIndex: number, isVroegsignalering: boolean) => {
    if (stepIndex <= currentStep) {
      return isVroegsignalering ? "border-green-500" : "border-red-500";
    }
    return "border-gray-300";
  };

  // Prepare chart data based on current step
  const prepareChartData = (scenario: VroegsignaleringScenario) => {
    const traditioneleSteps = scenario.traditioneleAanpak;
    const vroegsignaleringSteps = scenario.vroegsignaleringAanpak;
    const maxSteps = Math.max(traditioneleSteps.length, vroegsignaleringSteps.length);
    
    const chartData = [];
    for (let i = 0; i < maxSteps; i++) {
      const tradStep = traditioneleSteps[i];
      const vroegStep = vroegsignaleringSteps[i];
      
      // Calculate cumulative costs up to current step
      let tradCumulative = 0;
      let vroegCumulative = 0;
      
      for (let j = 0; j <= Math.min(i, currentStep); j++) {
        if (traditioneleSteps[j]) tradCumulative += traditioneleSteps[j].kosten;
        if (vroegsignaleringSteps[j]) vroegCumulative += vroegsignaleringSteps[j].kosten;
      }
      
      chartData.push({
        stap: `Stap ${i + 1}`,
        traditioneel: tradStep && i <= currentStep ? tradCumulative : 0,
        vroegsignalering: vroegStep && i <= currentStep ? vroegCumulative : 0,
        tradStepKosten: tradStep ? tradStep.kosten : 0,
        vroegStepKosten: vroegStep ? vroegStep.kosten : 0,
        tradLabel: tradStep ? tradStep.titel : '',
        vroegLabel: vroegStep ? vroegStep.titel : '',
      });
    }
    
    return chartData;
  };

  if (selectedScenario) {
    const traditioneleSteps = selectedScenario.traditioneleAanpak;
    const vroegsignaleringSteps = selectedScenario.vroegsignaleringAanpak;

    const traditioneleTotaal = traditioneleSteps.reduce((sum, step) => sum + step.kosten, 0);
    const vroegsignaleringTotaal = vroegsignaleringSteps.reduce((sum, step) => sum + step.kosten, 0);
    const financieelBesparing = traditioneleTotaal - vroegsignaleringTotaal;
    const maatschappelijkBesparing = selectedScenario.totaalImpact.maatschappelijk.traditioneel - selectedScenario.totaalImpact.maatschappelijk.vroegsignalering;
    
    const chartData = prepareChartData(selectedScenario);

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedScenario(null);
            resetAnimation();
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar overzicht
        </button>

        {/* Scenario Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedScenario.titel}</h2>
              <p className="text-gray-700">{selectedScenario.beschrijving}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {categorieLabels[selectedScenario.categorie]}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedAanpak("traditioneel")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedAanpak === "traditioneel"
                    ? "bg-red-100 text-red-900 border-2 border-red-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Traditioneel
              </button>
              <button
                onClick={() => setSelectedAanpak("vroegsignalering")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedAanpak === "vroegsignalering"
                    ? "bg-green-100 text-green-900 border-2 border-green-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vroegsignalering
              </button>
              <button
                onClick={() => setSelectedAanpak("beide")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedAanpak === "beide"
                    ? "bg-blue-100 text-blue-900 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Beide Vergelijken
              </button>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={playAnimation}
                disabled={isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {isPlaying ? "Afspelen..." : "Animaties Afspelen"}
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Bar Charts - Kosten per Stap */}
        <div className="space-y-6">
          {/* Cumulatieve Kosten */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cumulatieve Kosten per Stap</h3>
            
            {selectedAanpak === "beide" && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stap" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'traditioneel') {
                        return [`€${value.toFixed(0)} (cumulatief)`, 'Traditioneel'];
                      }
                      if (name === 'vroegsignalering') {
                        return [`€${value.toFixed(0)} (cumulatief)`, 'Vroegsignalering'];
                      }
                      return value;
                    }}
                    labelFormatter={(label) => `Stap ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="traditioneel" 
                    fill="#ef4444" 
                    name="Traditioneel (cumulatief)"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Bar 
                    dataKey="vroegsignalering" 
                    fill="#10b981" 
                    name="Vroegsignalering (cumulatief)"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {(selectedAanpak === "traditioneel" || selectedAanpak === "vroegsignalering") && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={chartData.map(d => ({
                    stap: d.stap,
                    kosten: selectedAanpak === "traditioneel" ? d.traditioneel : d.vroegsignalering,
                    label: selectedAanpak === "traditioneel" ? d.tradLabel : d.vroegLabel,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stap" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toFixed(0)} (cumulatief)`, 'Cumulatieve Kosten']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.label || label;
                      }
                      return label;
                    }}
                  />
                  <Bar 
                    dataKey="kosten" 
                    fill={selectedAanpak === "traditioneel" ? "#ef4444" : "#10b981"}
                    name="Cumulatieve Kosten"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Individuele Stap Kosten */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kosten per Individuele Stap</h3>
            
            {selectedAanpak === "beide" && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={chartData.map(d => ({
                    stap: d.stap,
                    traditioneel: d.tradStepKosten > 0 && chartData.indexOf(d) <= currentStep ? d.tradStepKosten : 0,
                    vroegsignalering: d.vroegStepKosten > 0 && chartData.indexOf(d) <= currentStep ? d.vroegStepKosten : 0,
                    tradLabel: d.tradLabel,
                    vroegLabel: d.vroegLabel,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stap" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'traditioneel') {
                        return [`€${value.toFixed(0)}`, 'Traditioneel'];
                      }
                      if (name === 'vroegsignalering') {
                        return [`€${value.toFixed(0)}`, 'Vroegsignalering'];
                      }
                      return value;
                    }}
                    labelFormatter={(label) => `Stap ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="traditioneel" 
                    fill="#ef4444" 
                    name="Traditioneel (per stap)"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Bar 
                    dataKey="vroegsignalering" 
                    fill="#10b981" 
                    name="Vroegsignalering (per stap)"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {(selectedAanpak === "traditioneel" || selectedAanpak === "vroegsignalering") && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={chartData.map(d => ({
                    stap: d.stap,
                    kosten: selectedAanpak === "traditioneel" 
                      ? (d.tradStepKosten > 0 && chartData.indexOf(d) <= currentStep ? d.tradStepKosten : 0)
                      : (d.vroegStepKosten > 0 && chartData.indexOf(d) <= currentStep ? d.vroegStepKosten : 0),
                    label: selectedAanpak === "traditioneel" ? d.tradLabel : d.vroegLabel,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stap" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toFixed(0)}`, 'Kosten per stap']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.label || label;
                      }
                      return label;
                    }}
                  />
                  <Bar 
                    dataKey="kosten" 
                    fill={selectedAanpak === "traditioneel" ? "#ef4444" : "#10b981"}
                    name="Kosten per Stap"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Totaal Kosten Vergelijking */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Totaal Kosten Vergelijking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={[
                  {
                    naam: 'Traditioneel',
                    financieel: traditioneleTotaal,
                    maatschappelijk: selectedScenario.totaalImpact.maatschappelijk.traditioneel,
                    totaal: traditioneleTotaal + selectedScenario.totaalImpact.maatschappelijk.traditioneel,
                  },
                  {
                    naam: 'Vroegsignalering',
                    financieel: vroegsignaleringTotaal,
                    maatschappelijk: selectedScenario.totaalImpact.maatschappelijk.vroegsignalering,
                    totaal: vroegsignaleringTotaal + selectedScenario.totaalImpact.maatschappelijk.vroegsignalering,
                  }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="naam" />
                <YAxis 
                  label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'financieel') return [`€${value.toFixed(0)}`, 'Financieel'];
                    if (name === 'maatschappelijk') return [`€${value.toFixed(0)}`, 'Maatschappelijk'];
                    if (name === 'totaal') return [`€${value.toFixed(0)}`, 'Totaal'];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="financieel" fill="#3b82f6" name="Financieel" />
                <Bar dataKey="maatschappelijk" fill="#f59e0b" name="Maatschappelijk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison View */}
        {selectedAanpak === "beide" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traditionele Aanpak */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Traditionele Aanpak</h3>
              </div>
              <div className="space-y-4">
                {traditioneleSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      index <= currentStep
                        ? getStepBorderColor(index, false)
                        : "border-gray-200 opacity-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            getStepColor(index, false)
                          }`}
                        >
                          {step.stap}
                        </div>
                        <h4 className="font-bold text-gray-900">{step.titel}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {formatCurrency(step.kosten)}
                        </div>
                        <div className="text-xs text-gray-500">{step.tijdsduur}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{step.beschrijving}</p>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs font-medium text-gray-600">Actie:</p>
                      <p className="text-xs text-gray-900">{step.actie}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Impact burger: {step.impact.burger}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900">Totaal Kosten:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(traditioneleTotaal)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-red-800">
                    Maatschappelijke kosten: {formatCurrency(selectedScenario.totaalImpact.maatschappelijk.traditioneel)}
                  </div>
                </div>
              </div>
            </div>

            {/* Vroegsignalering Aanpak */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Vroegsignalering Aanpak</h3>
              </div>
              <div className="space-y-4">
                {vroegsignaleringSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      index <= currentStep
                        ? getStepBorderColor(index, true)
                        : "border-gray-200 opacity-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            getStepColor(index, true)
                          }`}
                        >
                          {step.stap}
                        </div>
                        <h4 className="font-bold text-gray-900">{step.titel}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(step.kosten)}
                        </div>
                        <div className="text-xs text-gray-500">{step.tijdsduur}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{step.beschrijving}</p>
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-xs font-medium text-green-600">Actie:</p>
                      <p className="text-xs text-gray-900">{step.actie}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Impact burger: {step.impact.burger}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-900">Totaal Kosten:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(vroegsignaleringTotaal)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-green-800">
                    Maatschappelijke kosten: {formatCurrency(selectedScenario.totaalImpact.maatschappelijk.vroegsignalering)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Single View */}
        {(selectedAanpak === "traditioneel" || selectedAanpak === "vroegsignalering") && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              {selectedAanpak === "traditioneel" ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {selectedAanpak === "traditioneel" ? "Traditionele Aanpak" : "Vroegsignalering Aanpak"}
              </h3>
            </div>
            <div className="space-y-4">
              {(selectedAanpak === "traditioneel" ? traditioneleSteps : vroegsignaleringSteps).map((step, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    index <= currentStep
                      ? selectedAanpak === "traditioneel"
                        ? "border-red-500"
                        : "border-green-500"
                      : "border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index <= currentStep
                            ? selectedAanpak === "traditioneel"
                              ? "bg-red-500"
                              : "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {step.stap}
                      </div>
                      <h4 className="font-bold text-gray-900">{step.titel}</h4>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        selectedAanpak === "traditioneel" ? "text-red-600" : "text-green-600"
                      }`}>
                        {formatCurrency(step.kosten)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.tijdsduur}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{step.beschrijving}</p>
                  <div className={`rounded p-2 ${
                    selectedAanpak === "traditioneel" ? "bg-red-50" : "bg-green-50"
                  }`}>
                    <p className={`text-xs font-medium ${
                      selectedAanpak === "traditioneel" ? "text-red-600" : "text-green-600"
                    }`}>
                      Actie:
                    </p>
                    <p className="text-xs text-gray-900">{step.actie}</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Impact burger: {step.impact.burger}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Vergelijking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">Financiële Besparing</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(financieelBesparing)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formatCurrency(traditioneleTotaal)} → {formatCurrency(vroegsignaleringTotaal)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">Maatschappelijke Besparing</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(maatschappelijkBesparing)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Voorkomen schade
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">Totale Besparing</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(financieelBesparing + maatschappelijkBesparing)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Financieel + maatschappelijk
              </p>
            </div>
          </div>
        </div>

        {/* Burger Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Impact Burger (Traditioneel)
            </h4>
            <ul className="space-y-2">
              {selectedScenario.totaalImpact.burger.traditioneel.map((impact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-600">•</span>
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Impact Burger (Vroegsignalering)
            </h4>
            <ul className="space-y-2">
              {selectedScenario.totaalImpact.burger.vroegsignalering.map((impact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-600">•</span>
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lessen */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-yellow-600" />
            Belangrijkste Lessen
          </h3>
          <ul className="space-y-2">
            {selectedScenario.lessen.map((les, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-900">
                <span className="text-yellow-600 font-bold">•</span>
                <span>{les}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <div className="flex items-start gap-4">
          <Eye className="w-16 h-16 text-blue-600 opacity-20" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vroegsignalering Simulator
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Interactieve simulator die laat zien hoe vroegsignalering werkt en wat de impact is 
              van verschillende aanpakken. Bekijk stap-voor-stap hoe vroegsignalering problemen 
              voorkomt en kosten bespaart.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vroegsignaleringScenarios.map((scenario) => {
          const traditioneleTotaal = scenario.traditioneleAanpak.reduce((sum, step) => sum + step.kosten, 0);
          const vroegsignaleringTotaal = scenario.vroegsignaleringAanpak.reduce((sum, step) => sum + step.kosten, 0);
          const besparing = traditioneleTotaal - vroegsignaleringTotaal + 
            (scenario.totaalImpact.maatschappelijk.traditioneel - scenario.totaalImpact.maatschappelijk.vroegsignalering);

          return (
            <div
              key={scenario.id}
              className="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
              onClick={() => {
                setSelectedScenario(scenario);
                resetAnimation();
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.titel}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-2">
                      {categorieLabels[scenario.categorie]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{scenario.beschrijving}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Traditionele kosten:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(traditioneleTotaal + scenario.totaalImpact.maatschappelijk.traditioneel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Vroegsignalering kosten:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(vroegsignaleringTotaal + scenario.totaalImpact.maatschappelijk.vroegsignalering)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Besparing:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(besparing)}
                    </span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Simuleer Scenario
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

