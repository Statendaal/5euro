import { useState } from "react";
import {
  Play,
  Database,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SimulationResult {
  system: string;
  num_cases: number;
  num_events: number;
  duration_seconds: number;
  events_per_second: number;
  cases_per_second: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
  latency_p99_ms: number;
  timestamp: string;
  metadata: {
    concurrent_limit: number;
    avg_events_per_case: number;
    [key: string]: any;
  };
}

export function EventSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [runningSystem, setRunningSystem] = useState<string | null>(null);
  const [postgresResult, setPostgresResult] =
    useState<SimulationResult | null>(null);
  const [natsResult, setNatsResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numCases, setNumCases] = useState(1000);
  const [concurrent, setConcurrent] = useState(50);

  const runSimulation = async (system: "postgres" | "nats") => {
    setIsRunning(true);
    setRunningSystem(system);
    setError(null);

    try {
      const response = await fetch("http://localhost:8001/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system,
          num_cases: numCases,
          concurrent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (system === "postgres") {
        setPostgresResult(result);
      } else {
        setNatsResult(result);
      }
    } catch (err) {
      setError(
        `Simulatie mislukt voor ${system}: ${err instanceof Error ? err.message : String(err)}. Controleer of de API draait op http://localhost:8001`,
      );
    } finally {
      setIsRunning(false);
      setRunningSystem(null);
    }
  };

  const runBothSimulations = async () => {
    await runSimulation("postgres");
    await runSimulation("nats");
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("nl-NL").format(Math.round(num));
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 1) {
      return `${(seconds * 1000).toFixed(0)}ms`;
    }
    return `${seconds.toFixed(2)}s`;
  };

  const getSpeedupFactor = () => {
    if (!postgresResult || !natsResult) return null;
    return (
      postgresResult.duration_seconds / natsResult.duration_seconds
    ).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Event System Performance Simulatie
        </h2>
        <p className="text-gray-600 mb-4">
          Test de performance van PostgreSQL Event Sourcing vs NATS JetStream
          voor het verwerken van schuld-casussen. Elk systeem verwerkt events
          voor intake, analyse, beslissing en afhandeling.
        </p>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aantal Casussen
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              step="10"
              value={numCases}
              onChange={(e) => setNumCases(parseInt(e.target.value) || 1000)}
              disabled={isRunning}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hoger = meer realistische benchmark (max 10.000)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Concurrent Verwerken
            </label>
            <input
              type="number"
              min="1"
              max="200"
              step="10"
              value={concurrent}
              onChange={(e) => setConcurrent(parseInt(e.target.value) || 50)}
              disabled={isRunning}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Aantal parallelle workers (max 200)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => runSimulation("postgres")}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-5 h-5" />
            {runningSystem === "postgres"
              ? "PostgreSQL loopt..."
              : "Test PostgreSQL"}
          </button>

          <button
            onClick={() => runSimulation("nats")}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-5 h-5" />
            {runningSystem === "nats" ? "NATS loopt..." : "Test NATS JetStream"}
          </button>

          <button
            onClick={runBothSimulations}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-5 h-5" />
            {isRunning ? "Bezig..." : "Test Beide"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Fout</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Start de API: <code>cd event-system && python api.py</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Comparison */}
      {(postgresResult || natsResult) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Performance Vergelijking
          </h3>

          {getSpeedupFactor() && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    NATS JetStream is
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {getSpeedupFactor()}x sneller
                  </p>
                  <p className="text-xs text-gray-600">
                    dan PostgreSQL voor pure event streaming
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PostgreSQL Results */}
            {postgresResult && (
              <div className="border-2 border-blue-200 rounded-lg p-5 bg-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-900">
                    PostgreSQL 18
                  </h4>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Casussen:</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(postgresResult.num_cases)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Events:</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(postgresResult.num_events)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Duur:</span>
                    <span className="font-semibold text-blue-700">
                      {formatDuration(postgresResult.duration_seconds)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-gray-700">
                      Events/sec:
                    </span>
                    <span className="font-bold text-blue-900">
                      {formatNumber(postgresResult.events_per_second)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">
                      Casussen/sec:
                    </span>
                    <span className="font-bold text-blue-900">
                      {formatNumber(postgresResult.cases_per_second)}
                    </span>
                  </div>
                  <div className="border-t pt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Latency:
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p50:</span>
                      <span className="font-mono text-gray-900">
                        {postgresResult.latency_p50_ms.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p95:</span>
                      <span className="font-mono text-gray-900">
                        {postgresResult.latency_p95_ms.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p99:</span>
                      <span className="font-mono text-gray-900">
                        {postgresResult.latency_p99_ms.toFixed(2)}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NATS Results */}
            {natsResult && (
              <div className="border-2 border-purple-200 rounded-lg p-5 bg-purple-50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-900">
                    NATS JetStream
                  </h4>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Casussen:</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(natsResult.num_cases)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Events:</span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(natsResult.num_events)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Duur:</span>
                    <span className="font-semibold text-purple-700">
                      {formatDuration(natsResult.duration_seconds)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-gray-700">
                      Events/sec:
                    </span>
                    <span className="font-bold text-purple-900">
                      {formatNumber(natsResult.events_per_second)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">
                      Casussen/sec:
                    </span>
                    <span className="font-bold text-purple-900">
                      {formatNumber(natsResult.cases_per_second)}
                    </span>
                  </div>
                  <div className="border-t pt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Latency:
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p50:</span>
                      <span className="font-mono text-gray-900">
                        {natsResult.latency_p50_ms.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p95:</span>
                      <span className="font-mono text-gray-900">
                        {natsResult.latency_p95_ms.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">p99:</span>
                      <span className="font-mono text-gray-900">
                        {natsResult.latency_p99_ms.toFixed(2)}ms
                      </span>
                    </div>
                  </div>
                </div>

                {natsResult.metadata?.simulation_mode && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <p className="text-xs text-purple-700">
                      ℹ️ {natsResult.metadata.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visual Comparison Chart */}
          {postgresResult && natsResult && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Throughput Vergelijking (Events/sec)
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-700 font-medium">
                      PostgreSQL
                    </span>
                    <span className="font-mono text-gray-900">
                      {formatNumber(postgresResult.events_per_second)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${Math.min((postgresResult.events_per_second / Math.max(postgresResult.events_per_second, natsResult.events_per_second)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-700 font-medium">
                      NATS JetStream
                    </span>
                    <span className="font-mono text-gray-900">
                      {formatNumber(natsResult.events_per_second)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${Math.min((natsResult.events_per_second / Math.max(postgresResult.events_per_second, natsResult.events_per_second)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">
              Over deze simulatie
            </p>
            <ul className="text-blue-800 space-y-1 text-xs">
              <li>
                • <strong>PostgreSQL 18:</strong> Event Sourcing met ACID
                garanties en volledige replay mogelijkheden
              </li>
              <li>
                • <strong>NATS JetStream:</strong> High-performance event
                streaming voor real-time verwerking
              </li>
              <li>
                • Elke casus genereert ~4-5 events (intake, analyse, beslissing,
                afhandeling)
              </li>
              <li>
                • Performance hangt af van hardware, netwerk en configuratie
              </li>
              <li>
                • Hybride aanpak aanbevolen: NATS voor ingest, PostgreSQL voor
                durable storage
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
