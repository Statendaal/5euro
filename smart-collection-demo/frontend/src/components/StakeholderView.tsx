import { Building2, Heart, Home, GraduationCap, Scale, FileText, Landmark, Wallet } from "lucide-react";
import { useState } from "react";

interface Stakeholder {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  examples: string[];
  challenges: string[];
  debtTypes: string[];
}

const stakeholders: Stakeholder[] = [
  {
    id: "gemeente",
    name: "Gemeenten",
    icon: Building2,
    color: "blue",
    description: "Gemeenten zijn zowel schuldeiser als hulpverlener. Ze innen lokale belastingen en bieden schuldhulpverlening.",
    examples: [
      "Terugvorderingen bijzondere bijstand",
      "Afvalstoffenheffing",
      "Hondenbelasting",
      "Parkeerboetes"
    ],
    challenges: [
      "Vordering vaak < €500",
      "Incassotrajecten lopen op tot honderden euro's",
      "Dubbele rol: schuldeiser én hulpverlener"
    ],
    debtTypes: ["municipality", "parking"]
  },
  {
    id: "zorgverzekeraar",
    name: "Zorgverzekeraars",
    icon: Heart,
    color: "red",
    description: "Onbetaalde premies en eigen risico leiden tot kleine vorderingen die snel juridisch worden opgehoogd.",
    examples: [
      "Onbetaalde zorgpremie",
      "Eigen risico",
      "CAK inschrijving bij wanbetaling"
    ],
    challenges: [
      "Kleine bedragen escaleren snel",
      "Inschrijving bij CAK brengt extra kosten",
      "Administratieve lasten"
    ],
    debtTypes: ["healthcare"]
  },
  {
    id: "woningcorporatie",
    name: "Woningcorporaties",
    icon: Home,
    color: "green",
    description: "Achterstallige huur begint vaak klein, maar kan leiden tot ontruiming.",
    examples: [
      "Achterstallige huur",
      "Servicekosten",
      "Incassokosten"
    ],
    challenges: [
      "Kleine bedragen kunnen leiden tot ontruiming",
      "Deurwaarderskosten stapelen op",
      "Missen toegang tot schuldhulpdata"
    ],
    debtTypes: ["rent"]
  },
  {
    id: "onderwijs",
    name: "Onderwijsinstellingen",
    icon: GraduationCap,
    color: "purple",
    description: "Collegegeld en materiaalkosten kunnen leiden tot studieonderbreking.",
    examples: [
      "Onbetaald collegegeld",
      "Boetes voor materiaal",
      "Late inlevering"
    ],
    challenges: [
      "Kleine bedragen, grote persoonlijke impact",
      "Uitschrijving of blokkering studieresultaten",
      "Lange termijn effecten op carrière"
    ],
    debtTypes: ["tuition"]
  },
  {
    id: "cjib",
    name: "CJIB",
    icon: Scale,
    color: "orange",
    description: "Centraal Justitieel Incassobureau verwerkt verkeers- en strafrechtelijke boetes.",
    examples: [
      "Verkeersboetes",
      "Strafrechtelijke geldboetes",
      "OV-boetes"
    ],
    challenges: [
      "Veel boetes < €100",
      "Verhogingen bij uitblijvende betaling",
      "Stapelingseffect bij kwetsbare groepen"
    ],
    debtTypes: ["fine"]
  },
  {
    id: "cak",
    name: "CAK",
    icon: FileText,
    color: "teal",
    description: "Centraal Administratie Kantoor voert eigen bijdragen uit voor Wmo en WLZ.",
    examples: [
      "Eigen bijdrage Wmo",
      "Eigen bijdrage WLZ",
      "Wanbetalersregeling zorgverzekering"
    ],
    challenges: [
      "Eigen bijdragen enkele tientjes tot honderden euro's",
      "Inschrijving wanbetalersregeling verhoogt maandlasten",
      "Vooral bij mensen met GGZ-zorg of Wmo-ondersteuning"
    ],
    debtTypes: ["cak"]
  },
  {
    id: "belastingdienst",
    name: "Belastingdienst",
    icon: Landmark,
    color: "indigo",
    description: "Heft en int belastingen, strikte invorderingsprocessen.",
    examples: [
      "Inkomstenbelasting",
      "Motorrijtuigenbelasting",
      "BTW",
      "Boetes"
    ],
    challenges: [
      "Invorderingsrente loopt snel op",
      "Aanmaningskosten en dwangbevelen",
      "Vooral moeilijk voor zzp'ers en wisselend inkomen"
    ],
    debtTypes: ["tax"]
  },
  {
    id: "toeslagen",
    name: "Dienst Toeslagen",
    icon: Wallet,
    color: "pink",
    description: "Verstrekt en verrekent toeslagen voor huur, zorg en kinderopvang.",
    examples: [
      "Terugvordering huurtoeslag",
      "Terugvordering zorgtoeslag",
      "Terugvordering kinderopvangtoeslag"
    ],
    challenges: [
      "Terugvorderingen vaak < €500",
      "Komen onverwacht en automatisch",
      "Lastig te betwisten",
      "Meerdere toeslagen tegelijk teruggevorderd"
    ],
    debtTypes: ["subsidy"]
  }
];

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", hover: "hover:bg-blue-100" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", hover: "hover:bg-red-100" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", hover: "hover:bg-green-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", hover: "hover:bg-purple-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", hover: "hover:bg-orange-100" },
  teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", hover: "hover:bg-teal-100" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", hover: "hover:bg-indigo-100" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", hover: "hover:bg-pink-100" }
};

export function StakeholderView() {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);

  const selected = selectedStakeholder
    ? stakeholders.find(s => s.id === selectedStakeholder)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-3">
        👥 Kies Stakeholder Perspectief
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Bekijk de problematiek vanuit het perspectief van verschillende schuldeisers
      </p>

      {/* Stakeholder Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stakeholders.map((stakeholder) => {
          const Icon = stakeholder.icon;
          const colors = colorClasses[stakeholder.color];
          const isSelected = selectedStakeholder === stakeholder.id;

          return (
            <button
              key={stakeholder.id}
              onClick={() => setSelectedStakeholder(isSelected ? null : stakeholder.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${colors.bg} ${colors.border} shadow-md`
                  : `bg-white border-gray-200 ${colors.hover}`
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? colors.text : "text-gray-400"}`} />
              <p className={`text-sm font-medium text-center ${isSelected ? colors.text : "text-gray-700"}`}>
                {stakeholder.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Stakeholder Details */}
      {selected && (
        <div className={`mt-4 p-4 rounded-lg border-2 ${colorClasses[selected.color].bg} ${colorClasses[selected.color].border}`}>
          <div className="flex items-start gap-3 mb-4">
            {(() => {
              const Icon = selected.icon;
              return <Icon className={`w-6 h-6 ${colorClasses[selected.color].text}`} />;
            })()}
            <div>
              <h4 className={`font-bold text-lg ${colorClasses[selected.color].text}`}>
                {selected.name}
              </h4>
              <p className="text-sm text-gray-700 mt-1">{selected.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Examples */}
            <div>
              <h5 className="font-semibold text-sm text-gray-900 mb-2">
                📋 Voorbeelden van schulden:
              </h5>
              <ul className="space-y-1">
                {selected.examples.map((example, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h5 className="font-semibold text-sm text-gray-900 mb-2">
                ⚠️ Uitdagingen:
              </h5>
              <ul className="space-y-1">
                {selected.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Smart Collection Advice */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-semibold text-sm text-gray-900 mb-2">
              💡 Smart Collection Aanbeveling:
            </h5>
            <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
              {selected.id === "gemeente" && (
                <p>
                  <strong>Kies voor schuldhulp bij lage bedragen en kwetsbare burgers.</strong> Gemeenten hebben
                  de unieke positie om direct te kunnen doorverwijzen naar schuldhulpverlening. Dit voorkomt
                  verdere escalatie en maatschappelijke kosten die de gemeente later weer moet dragen.
                </p>
              )}
              {selected.id === "zorgverzekeraar" && (
                <p>
                  <strong>Werk samen met het CAK en gemeente.</strong> Bij wanbetaling: direct signaleren en
                  doorverwijzen naar schuldhulp in plaats van juridische route. Dit voorkomt gezondheidsschade
                  door uitgestelde zorg.
                </p>
              )}
              {selected.id === "woningcorporatie" && (
                <p>
                  <strong>Preventief contact bij eerste achterstand.</strong> Vroegtijdig persoonlijk contact
                  kan ontruiming voorkomen. Betalingsregelingen zijn effectiever en goedkoper dan juridische
                  procedures.
                </p>
              )}
              {selected.id === "onderwijs" && (
                <p>
                  <strong>Zet in op betalingsregelingen en studievertraging-preventie.</strong> Studieschuld
                  heeft grote impact op toekomstige carrière. Kleine regelingen nu voorkomen grotere maatschappelijke
                  kosten later.
                </p>
              )}
              {selected.id === "cjib" && (
                <p>
                  <strong>Differentieer op betalingscapaciteit.</strong> Automatische verhogingen werken
                  contraproductief bij mensen zonder inkomen. Overweeg kwijtschelding bij bedragen {"<"} €50
                  en geen verhaalsmogelijkheden.
                </p>
              )}
              {selected.id === "cak" && (
                <p>
                  <strong>Signaleer kwetsbaren en koppel aan gemeentelijke schuldhulp.</strong> CAK ziet vaak
                  als eerste financiële problemen bij mensen met zorgbehoefte. Vroeg signaleren voorkomt
                  grotere schuldenproblematiek.
                </p>
              )}
              {selected.id === "belastingdienst" && (
                <p>
                  <strong>Flexibele betalingsregelingen voor lage bedragen.</strong> Bij schulden {"<"} €500
                  en geen inkomsten: overweeg kwijtschelding of langdurige regeling. Invorderingskosten
                  overtreffen vaak het te verhalen bedrag.
                </p>
              )}
              {selected.id === "toeslagen" && (
                <p>
                  <strong>Spreiding en automatische kwijtschelding bij minimaal inkomen.</strong> Terugvorderingen
                  raken mensen die al financieel kwetsbaar zijn. Automatische spreiding over langere periode
                  en kwijtschelding bij extreem lage inkomens voorkomt verdere escalatie.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
