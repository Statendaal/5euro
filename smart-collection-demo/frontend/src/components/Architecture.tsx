import { Server, Database, Brain, Users, Shield, BarChart3 } from "lucide-react";

export function Architecture() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Collection Architectuur
        </h2>
        <p className="text-lg text-gray-700">
          Een moderne, schaalbare en veilige architectuur voor data-gedreven schuldinvordering
          met menselijke proportionaliteit.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Systeemarchitectuur</h3>

        <div className="space-y-8">
          {/* Layer 1: Frontend */}
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="text-xl font-bold text-gray-900">Frontend / User Interface</h4>
                <p className="text-sm text-gray-600">React + TypeScript + Tailwind CSS</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Debt Analysis</p>
                <p className="text-xs text-gray-600">Input schuld gegevens</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Results Display</p>
                <p className="text-xs text-gray-600">Visualisatie aanbeveling</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Dashboard</p>
                <p className="text-xs text-gray-600">KPI monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-gray-400">
              <div className="text-2xl">↕</div>
              <p className="text-xs">REST API</p>
              <p className="text-xs">(JSON over HTTPS)</p>
            </div>
          </div>

          {/* Layer 2: Backend */}
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="text-xl font-bold text-gray-900">Backend API</h4>
                <p className="text-sm text-gray-600">Python + FastAPI + Uvicorn</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-11">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">API Routes</p>
                <p className="text-xs text-gray-600">/analyze, /stats, /cbs</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Business Logic</p>
                <p className="text-xs text-gray-600">Kosten-baten berekening</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Data Validation</p>
                <p className="text-xs text-gray-600">Pydantic schemas</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">CORS & Security</p>
                <p className="text-xs text-gray-600">Authentication ready</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-gray-400">
              <div className="text-2xl">↕</div>
              <p className="text-xs">Internal API</p>
            </div>
          </div>

          {/* Layer 3: ML Service */}
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="text-xl font-bold text-gray-900">ML Prediction Service</h4>
                <p className="text-sm text-gray-600">Neural Network (20 features, 89.49% accuracy)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Feature Engineering</p>
                <p className="text-xs text-gray-600">20 CBS + debt features</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Neural Network</p>
                <p className="text-xs text-gray-600">Keras/TensorFlow model</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Prediction Output</p>
                <p className="text-xs text-gray-600">FORGIVE / PAYMENT_PLAN / REFER</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-gray-400">
              <div className="text-2xl">↕</div>
              <p className="text-xs">SQL Queries</p>
            </div>
          </div>

          {/* Layer 4: Database */}
          <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="text-xl font-bold text-gray-900">Database Layer</h4>
                <p className="text-sm text-gray-600">PostgreSQL (Structured Data)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">CBS Statistics</p>
                <p className="text-xs text-gray-600">721K households, 14 patterns</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Training Data</p>
                <p className="text-xs text-gray-600">10K labeled cases</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="font-medium text-gray-900">Analysis Results</p>
                <p className="text-xs text-gray-600">Historical predictions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Security & Privacy</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>AVG Compliance:</strong> Privacy by design, bewerkersovereenkomsten</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Data Encryption:</strong> In transit (TLS) en at rest</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Access Control:</strong> Role-based permissions (RBAC)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Audit Logging:</strong> Alle beslissingen traceerbaar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>ISO 27001:</strong> Certificering gepland voor productie</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Scalability & Performance</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Horizontal Scaling:</strong> Kubernetes ready, stateless design</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Performance:</strong> {'<'}100ms response tijd per analyse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Throughput:</strong> 400K cases/jaar (5 organisaties)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Database:</strong> PostgreSQL met indexing en partitioning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Caching:</strong> Redis voor frequent accessed data</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Data Integrations */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Integraties</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">CBS StatLine</h4>
            <p className="text-sm text-gray-600 mb-3">
              Centraal Bureau voor de Statistiek
            </p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• 721.290 huishoudens met schuld</li>
              <li>• 14 risico patronen geïdentificeerd</li>
              <li>• Inkomen, vermogen, gezinssamenstelling</li>
              <li>• Real-time updates mogelijk</li>
            </ul>
          </div>

          <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">BRP (Basisregistratie Personen)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Gemeentelijke basisadministratie
            </p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Adresgegevens en gezinssamenstelling</li>
              <li>• Leeftijd en demografische data</li>
              <li>• Historische woonplaatsen</li>
              <li>• Privacy-conform via bewerkersovereenkomst</li>
            </ul>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">UWV / Belastingdienst</h4>
            <p className="text-sm text-gray-600 mb-3">
              Inkomen en uitkeringsinformatie
            </p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Actueel inkomen en uitkeringen</li>
              <li>• Werkgeversinformatie</li>
              <li>• Betaalvermogen inschatting</li>
              <li>• Toeslagen en belastingschulden</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ML Model Details */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">ML Model V2 Specificaties</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Model Architectuur</h4>
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">Neural Network</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Framework:</span>
                <span className="font-medium">Keras/TensorFlow</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Layers:</span>
                <span className="font-medium">Input → Dense(64) → Dense(32) → Output(3)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Activation:</span>
                <span className="font-medium">ReLU + Softmax</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Training Data:</span>
                <span className="font-medium">10.000 labeled cases</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-bold text-green-600">89.49%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Input Features (20)</h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-medium text-blue-900">Schuld Features (6)</p>
                  <p className="text-xs text-gray-600">Bedrag, type, leeftijd schuld, historisch gedrag, betalingsbereidheid</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="font-medium text-green-900">CBS Features (14)</p>
                  <p className="text-xs text-gray-600">Inkomen, vermogen, gezinssamenstelling, woonsituatie, risicopatronen</p>
                </div>
                <div className="bg-purple-50 p-2 rounded mt-4">
                  <p className="font-medium text-purple-900">Output (3 klassen)</p>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>1. FORGIVE - Kwijtschelden (11%)</li>
                    <li>2. PAYMENT_PLAN - Betaalregeling (50%)</li>
                    <li>3. REFER_TO_ASSISTANCE - Schuldhulp (39%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3">Model Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">89.49%</p>
              <p className="text-xs text-gray-600">Overall Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">91%</p>
              <p className="text-xs text-gray-600">Precision (FORGIVE)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">88%</p>
              <p className="text-xs text-gray-600">Recall (PAYMENT_PLAN)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">90%</p>
              <p className="text-xs text-gray-600">F1-Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Deployment & Infrastructure</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Development</h4>
            <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
              <p>• Docker Compose lokaal</p>
              <p>• Hot reload (Vite + Uvicorn)</p>
              <p>• Git version control</p>
              <p>• CI/CD ready</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Staging</h4>
            <div className="bg-yellow-50 p-4 rounded space-y-2 text-sm">
              <p>• Kubernetes cluster (test)</p>
              <p>• PostgreSQL managed (test data)</p>
              <p>• Automated testing</p>
              <p>• Performance benchmarks</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Production</h4>
            <div className="bg-green-50 p-4 rounded space-y-2 text-sm">
              <p>• Kubernetes (AKS/EKS/GKE)</p>
              <p>• PostgreSQL managed (HA)</p>
              <p>• Load balancing + auto-scaling</p>
              <p>• 99.9% uptime SLA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Roadmap & Toekomstige Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-3 text-blue-100">Q2 2025 - Pilot Phase</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• CAK integration (50K cases/jaar)</li>
              <li>• A/B testing framework</li>
              <li>• Real-time monitoring dashboard</li>
              <li>• Bias detection & fairness metrics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-blue-100">Q3-Q4 2025 - Scaling</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• 5 organisaties integratie (400K cases/jaar)</li>
              <li>• ML Model V3 (95%+ accuracy)</li>
              <li>• Gemeentelijke schuldhulp koppeling</li>
              <li>• Open source community edition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
