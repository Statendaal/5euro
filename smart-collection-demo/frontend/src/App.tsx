import { useState } from "react";
import { DebtAnalysisForm } from "./components/DebtAnalysisForm";
import { AnalysisResults } from "./components/AnalysisResults";
import { Dashboard } from "./components/Dashboard";
import { CBSDashboard } from "./components/CBSDashboard";
import { Simulation } from "./components/Simulation";
import { Problematiek } from "./components/Problematiek";
import { Architecture } from "./components/Architecture";
import { DebtAnalysisResponse } from "./types";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Play,
  Database,
  AlertCircle,
  Boxes,
} from "lucide-react";

type Tab = "analyze" | "results" | "dashboard" | "simulation" | "cbs" | "problematiek" | "architecture";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("simulation");
  const [analysisResult, setAnalysisResult] =
    useState<DebtAnalysisResponse | null>(null);

  const handleAnalysisComplete = (result: DebtAnalysisResponse) => {
    setAnalysisResult(result);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                De Slimme Invorderaar
              </h1>
              <p className="text-sm text-gray-600">
                Kosten-Baten Analyse voor Kleine Schulden
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Demo Applicatie</p>
              <p className="text-xs text-gray-500">IBO Schuldenproblematiek</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("simulation")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "simulation"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Play className="w-5 h-5" />
              Simulaties
            </button>
            <button
              onClick={() => setActiveTab("analyze")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "analyze"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <FileText className="w-5 h-5" />
              Schuld Analyse
            </button>
            <button
              onClick={() => setActiveTab("results")}
              disabled={!analysisResult}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "results"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
                ${!analysisResult && "opacity-50 cursor-not-allowed"}
              `}
            >
              <BarChart3 className="w-5 h-5" />
              Resultaten
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("cbs")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "cbs"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Database className="w-5 h-5" />
              CBS Data
            </button>
            <button
              onClick={() => setActiveTab("problematiek")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "problematiek"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <AlertCircle className="w-5 h-5" />
              Problematiek
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === "architecture"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Boxes className="w-5 h-5" />
              Architectuur
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "simulation" && <Simulation />}
        {activeTab === "analyze" && (
          <DebtAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
        )}
        {activeTab === "results" && analysisResult && (
          <AnalysisResults analysis={analysisResult} />
        )}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "cbs" && <CBSDashboard />}
        {activeTab === "problematiek" && <Problematiek />}
        {activeTab === "architecture" && <Architecture />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            De Slimme Invorderaar • Gebaseerd op IBO-rapport "De
            maatschappelijke kosten van schuldenproblematiek"
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
