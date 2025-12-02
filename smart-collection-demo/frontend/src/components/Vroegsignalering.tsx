import { useState } from "react";
import { Eye, FileText, AlertTriangle, TrendingUp, CheckCircle, XCircle, Play } from "lucide-react";
import { VroegsignaleringSimulator } from "./VroegsignaleringSimulator";

export function Vroegsignalering() {
  const [showSimulator, setShowSimulator] = useState(false);
  // PDF path voor GitHub Pages (relatief pad vanuit public folder)
  const pdfPath = "/5euro/Onderzoeksrapport+Vroegsignalering+-+Eerder+herkennen+en+oplossen+van+problemen.pdf";

  if (showSimulator) {
    return (
      <div>
        <button
          onClick={() => setShowSimulator(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <XCircle className="w-5 h-5" />
          Terug naar informatie
        </button>
        <VroegsignaleringSimulator />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vroegsignalering: Eerder Herkennen en Oplossen van Problemen
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Onderzoek naar hoe de Belastingdienst problemen van burgers en zzp'ers eerder kan herkennen en oplossen.
              <strong> Hoe eerder zichtbaar wordt dat iemand in de problemen gaat komen, hoe sneller en eenvoudiger de oplossing vaak is.</strong>
            </p>
            <div className="flex gap-3">
              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Open Volledig Rapport (PDF)
              </a>
              <button
                onClick={() => setShowSimulator(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Simulator
              </button>
            </div>
          </div>
          <Eye className="w-16 h-16 text-blue-600 opacity-20 ml-4" />
        </div>
      </div>

      {/* Wat is Vroegsignalering */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Eye className="w-8 h-8 text-blue-600" />
          Wat is Vroegsignalering?
        </h3>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            Onder vroegsignalering verstaan we dat de Belastingdienst problemen die mensen met belastingen ervaren 
            <strong className="text-blue-600"> zo vroeg mogelijk herkent en oplost</strong>.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
            <p className="font-medium text-gray-900 mb-2">Belangrijke principes:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Hoe eerder problemen zichtbaar worden, hoe sneller en eenvoudiger de oplossing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Voorkomen dat schulden en zorgen van mensen (verder) oplopen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Beperken van problemen op andere gebieden én maatschappelijke kosten</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Problemen op organisatieniveau in samenhang bezien voor structurele verbetering</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ambtshalve Aanslagen Problematiek */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          Ambtshalve Aanslagen: Een Belangrijke Knelpunt
        </h3>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Een <strong>ambtshalve aanslag</strong> is een belastingaanslag die de Belastingdienst oplegt als een belastingplichtige 
            geen aangifte heeft gedaan. Deze personen hebben wel een uitnodiging, herinnering en aanmaning ontvangen, 
            maar hebben daar niet op gereageerd of niet op kunnen reageren.
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-medium text-red-900 mb-2">⚠️ Belangrijk:</p>
            <p className="text-red-800">
              Een ambtshalve aanslag gaat <strong>in de regel gepaard met een verzuimboete</strong> (wegens het niet doen van de aangifte), 
              waardoor het aan de Belastingdienst verschuldigde bedrag toeneemt. Het niet opleggen van een boete is een weinig 
              voorkomende uitzonderingssituatie.
            </p>
          </div>
        </div>

        {/* Knelpunten Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Knelpunt 1: Te hoog schatten */}
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Knelpunt 1: Te Hoog Schatten
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              De Belastingdienst schat het inkomen vaak te hoog in bij ambtshalve aanslagen, omdat ze alleen beschikking heeft 
              over beperkte gegevens.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-medium text-gray-600 mb-1">Gevolg:</p>
              <p className="text-sm text-gray-900">
                Burgers krijgen een hogere aanslag dan werkelijk verschuldigd, wat betalingsproblemen kan veroorzaken of verergeren.
              </p>
            </div>
          </div>

          {/* Knelpunt 2: Geen teruggave */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Knelpunt 2: Geen Teruggave bij Geen Aangifte
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Als iemand geen aangifte doet, kan de Belastingdienst geen teruggave verlenen, ook niet als de burger daar 
              recht op zou hebben.
            </p>
            <div className="bg-white p-3 rounded">
              <p className="text-xs font-medium text-gray-600 mb-1">Gevolg:</p>
              <p className="text-sm text-gray-900">
                Burgers die recht hebben op teruggave krijgen deze niet, wat onnodige financiële druk veroorzaakt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doorwerking op Andere Processen */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Doorwerking op Andere Processen
        </h3>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold text-gray-900 mb-2">1. Doorwerking van Niet Doen van Aangifte</h4>
            <p className="text-gray-700 text-sm mb-2">
              Wanneer iemand geen aangifte doet, heeft dit gevolgen voor andere processen en kan het leiden tot 
              verdere escalatie en kosten.
            </p>
          </div>

          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-bold text-gray-900 mb-2">2. Maatwerk bij Boetes</h4>
            <p className="text-gray-700 text-sm mb-2">
              Er zijn mogelijkheden voor maatwerk bij boetes, maar deze worden niet altijd benut. Vroegsignalering 
              kan helpen om te bepalen wanneer maatwerk passend is.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-gray-900 mb-2">3. Voorwaardelijke Boetes</h4>
            <p className="text-gray-700 text-sm mb-2">
              Voorwaardelijke boetes kunnen worden opgelegd, waarbij de boete vervalt als alsnog aangifte wordt gedaan. 
              Dit biedt kansen voor vroegsignalering en preventie.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-bold text-gray-900 mb-2">4. Uitnodigingsbeleid tot Aangifte</h4>
            <p className="text-gray-700 text-sm mb-2">
              Het uitnodigingsbeleid kan worden verbeterd om mensen eerder te helpen en te voorkomen dat ze in problemen komen. 
              Proactieve benadering kan escalatie voorkomen.
            </p>
          </div>
        </div>
      </div>

      {/* Belangrijke Bevindingen */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Belangrijkste Bevindingen uit het Onderzoek
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Programma Vroegsignalering
            </h4>
            <p className="text-sm text-gray-700">
              De Belastingdienst heeft een programma vroegsignalering ontwikkeld dat loopt tot en met eind 2025. 
              Dit programma richt zich op het voorkomen en oplossen van problemen.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Signaalmodel en Privacy
            </h4>
            <p className="text-sm text-gray-700">
              Er is een signaalmodel ontwikkeld, maar dit mag nog niet gebruikt worden zolang onduidelijk is of de AVG 
              een grondslag biedt voor gebruik van gegevens voor dienstverlening als uitvoering van een wettelijke taak.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Van Oplossen naar Aanpak bij de Wortel
            </h4>
            <p className="text-sm text-gray-700">
              Er is een verschuiving nodig van alleen problemen oplossen naar het aanpakken van problemen bij de wortel, 
              zodat bepaalde problemen zich niet steeds weer herhalen.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Organisatieniveau
            </h4>
            <p className="text-sm text-gray-700">
              Vroegsignalering heeft niet alleen betrekking op individuen, maar ook op organisatieniveau waar problemen 
              in samenhang moeten worden bezien voor structurele verbetering.
            </p>
          </div>
        </div>
      </div>

      {/* Link naar Rapport */}
      <div className="bg-blue-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Wil je het Volledige Rapport Lezen?
            </h3>
            <p className="opacity-90 mb-4">
              Het volledige onderzoeksrapport bevat gedetailleerde analyses, casussen en aanbevelingen 
              voor de Belastingdienst.
            </p>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Open Rapport (PDF)
            </a>
          </div>
          <FileText className="w-24 h-24 opacity-20" />
        </div>
      </div>
    </div>
  );
}

