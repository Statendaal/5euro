import { AlertCircle, TrendingDown, Users, Euro } from "lucide-react";

export function Problematiek() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border border-red-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Het Kernprobleem: Beleidsruimte versus Procedurele Automatisering
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          In Nederland hebben <strong className="text-red-600">721.290 huishoudens</strong> problematische schulden.
          Van deze schulden is <strong className="text-red-600">75% kleiner dan €500</strong>. De vraag die centraal staat:
          <strong> maken wij voldoende gebruik van de beleidsruimte die wet- en regelgeving ons biedt,
          of verschuilen wij ons onbedoeld achter geautomatiseerde processen?</strong>
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Huishoudens met Schuld</p>
              <p className="text-3xl font-bold text-gray-900">721.290</p>
            </div>
            <Users className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schulden &lt; €500</p>
              <p className="text-3xl font-bold text-gray-900">75%</p>
            </div>
            <TrendingDown className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Incassokosten/Jaar</p>
              <p className="text-3xl font-bold text-gray-900">€200M+</p>
            </div>
            <Euro className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maatschappelijke Schade</p>
              <p className="text-3xl font-bold text-gray-900">€8.2mrd</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Concrete Voorbeeld */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Een Illustratief Voorbeeld: Het €8,50 Drama
        </h3>

        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-medium text-gray-900">Start: CAK eigen bijdrage</p>
            <p className="text-3xl font-bold text-blue-600">€8,50</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="text-center text-gray-500">
              ↓<br />
              <span className="text-xs">Automatisch incassotraject</span>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="font-medium text-gray-900">Na incassotraject</p>
            <p className="text-3xl font-bold text-red-600">€268,50</p>
            <p className="text-sm text-gray-600 mt-2">
              + €200 incassokosten + €60 aanmaningskosten
            </p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="text-center text-gray-500">
              ↓<br />
              <span className="text-xs">Netto resultaat</span>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 rounded">
            <p className="font-medium">CAK verlies</p>
            <p className="text-3xl font-bold">-€191,50</p>
            <p className="text-sm opacity-80 mt-2">
              + beschadigde burgerrelatie + schuldenspiraal risico
            </p>
          </div>
        </div>
      </div>

      {/* Veelgehoorde Argumenten */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Veelgehoorde Overwegingen (en de Realiteit)
        </h3>

        <div className="space-y-6">
          {/* Argument 1 */}
          <div className="border-l-4 border-gray-400 pl-4">
            <blockquote className="text-gray-600 italic mb-2">
              "De wetgeving verplicht ons tot incasso"
            </blockquote>
            <div className="bg-green-50 p-4 rounded mt-2">
              <p className="font-medium text-gray-900 mb-2">Juridische realiteit:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Geen enkele wet verplicht tot <em>disproportionele</em> incasso</li>
                <li>Artikel 6:2 BW verplicht juist tot redelijkheid en billijkheid</li>
                <li>Awb zorgvuldigheidsbeginsel vereist proportionaliteit</li>
                <li>AVG artikel 22 vereist menselijke tussenkomst bij geautomatiseerde beslissingen</li>
              </ul>
              <p className="mt-2 font-medium text-green-700">
                ✓ Conclusie: Dit argument verwarrt "recht om te innen" met "verplichting om zó te innen"
              </p>
            </div>
          </div>

          {/* Argument 2 */}
          <div className="border-l-4 border-gray-400 pl-4">
            <blockquote className="text-gray-600 italic mb-2">
              "Het systeem doet het automatisch"
            </blockquote>
            <div className="bg-green-50 p-4 rounded mt-2">
              <p className="font-medium text-gray-900 mb-2">Realiteit:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Systemen zijn ontworpen door mensen op basis van beleidskeuzes</li>
                <li>Automatisering is een middel, geen doel of excuus</li>
                <li>AVG artikel 22 geeft burgers expliciet recht op menselijke beoordeling</li>
                <li>Er is altijd beleidsruimte om systemen anders in te richten</li>
              </ul>
              <p className="mt-2 font-medium text-green-700">
                ✓ Conclusie: Dit argument verschuilt beleidsverantwoordelijkheid achter technische implementatie
              </p>
            </div>
          </div>

          {/* Argument 3 */}
          <div className="border-l-4 border-gray-400 pl-4">
            <blockquote className="text-gray-600 italic mb-2">
              "We hebben geen capaciteit voor maatwerk"
            </blockquote>
            <div className="bg-green-50 p-4 rounded mt-2">
              <p className="font-medium text-gray-900 mb-2">Realiteit:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-medium text-red-800">Huidige werkwijze</p>
                  <p className="text-2xl font-bold text-red-600">€200</p>
                  <p className="text-xs text-red-700">per zaak (handmatig)</p>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <p className="font-medium text-green-800">Nieuwe werkwijze</p>
                  <p className="text-2xl font-bold text-green-600">€40</p>
                  <p className="text-xs text-green-700">per zaak (AI + maatwerk)</p>
                </div>
              </div>
              <p className="mt-2 font-medium text-green-700">
                ✓ Conclusie: 80% capaciteitsbesparing • ML accuratesse: 89,49%
              </p>
            </div>
          </div>

          {/* Argument 4 */}
          <div className="border-l-4 border-gray-400 pl-4">
            <blockquote className="text-gray-600 italic mb-2">
              "Incassobureaus hebben contracten"
            </blockquote>
            <div className="bg-green-50 p-4 rounded mt-2">
              <p className="font-medium text-gray-900 mb-2">Realiteit:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Contracten zijn opzegbaar en heronderhandelbaar</li>
                <li>Outcome-based pricing is alternatief voor step-based pricing</li>
                <li>Pilot kan parallel aan bestaande contracten</li>
                <li>Meerdere incassobureaus tonen interesse in nieuwe aanpak</li>
              </ul>
              <p className="mt-2 font-medium text-green-700">
                ✓ Conclusie: Contracten zijn het resultaat van eerdere beleidskeuzes, niet een blokkade
              </p>
            </div>
          </div>

          {/* Argument 5 */}
          <div className="border-l-4 border-gray-400 pl-4">
            <blockquote className="text-gray-600 italic mb-2">
              "Privacy wet verbiedt data-uitwisseling"
            </blockquote>
            <div className="bg-green-50 p-4 rounded mt-2">
              <p className="font-medium text-gray-900 mb-2">Realiteit:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>AVG artikel 6 lid 1 sub c: wettelijke verplichting (proportionaliteitstoets)</li>
                <li>AVG artikel 6 lid 1 sub e: publieke taak</li>
                <li>Bewerkersovereenkomsten faciliteren rechtmatige verwerking</li>
                <li>CBS, BRP, UWV data is beschikbaar voor publieke dienstverlening</li>
              </ul>
              <p className="mt-2 font-medium text-green-700">
                ✓ Conclusie: AVG beoogt juist betere bescherming burgers, niet bureaucratische blokkades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* De Onderliggende Dynamiek */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border border-gray-300">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          De Onderliggende Dynamiek
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="font-bold text-gray-900 mb-3">Wat hier speelt:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Risico-aversie:</strong> Veranderen = potentieel aansprakelijk, niets doen = verscholen in systeem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Versnipperde verantwoordelijkheid:</strong> Niemand voelt zich verantwoordelijk voor totaalresultaat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Budgettaire prikkels:</strong> Incassokosten zijn "noodzakelijke uitgaven"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Bestaande belangen:</strong> Incassobureaus, leveranciers hebben momentum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Gebrek aan transparantie:</strong> Totaalkosten niet zichtbaar</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
            <h4 className="font-bold text-gray-900 mb-3">Het Resultaat:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>€200M+/jaar publiek geld aan ineffectieve incasso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>721.290 huishoudens in problematische schulden</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>270.000 schuldenspiralen per jaar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>€8,2 miljard maatschappelijke schade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span>Beschadigde overheid-burger relatie</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
          <p className="text-lg font-bold text-gray-900">
            Dit systeem moet doorbroken worden.
          </p>
          <p className="text-gray-700 mt-2">
            Niet door meer regels of meer controle, maar door beleidsruimte te benutten die al bestaat.
            Door proportionaliteit niet als last maar als kans te zien. Door data-gedreven maatwerk
            te omarmen in plaats van procedurele automatisering.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">De Oplossing: Smart Collection</h3>
        <p className="text-lg mb-6 opacity-90">
          Een AI-gestuurd platform dat voor elke schuld de meest effectieve aanpak bepaalt:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-3xl font-bold">11%</p>
            <p className="text-sm opacity-90">Kwijtschelden (kosten {'>'} schuld)</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-3xl font-bold">50%</p>
            <p className="text-sm opacity-90">Betaalregeling op maat</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-3xl font-bold">39%</p>
            <p className="text-sm opacity-90">Schuldhulpverlening</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">89,49%</p>
            <p className="text-sm opacity-90">ML Accuratesse</p>
          </div>
          <div>
            <p className="text-2xl font-bold">80%</p>
            <p className="text-sm opacity-90">Kostenbesparing</p>
          </div>
          <div>
            <p className="text-2xl font-bold">3×</p>
            <p className="text-sm opacity-90">Hogere Opbrengst</p>
          </div>
          <div>
            <p className="text-2xl font-bold">106×</p>
            <p className="text-sm opacity-90">ROI voor CAK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
