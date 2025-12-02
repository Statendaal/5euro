export interface ImpactExample {
  id: string;
  title: string;
  category: 'ambtshalve' | 'vroegsignalering' | 'beslissing' | 'maatschappelijk';
  scenario: {
    situatie: string;
    beslissing: string;
    alternatief?: string;
  };
  impact: {
    financieel: { voor: number; na: number };
    maatschappelijk: { voor: number; na: number };
    burger: string[];
  };
  lessen: string[];
}

export const impactVoorbeelden: ImpactExample[] = [
  {
    id: 'ambtshalve-1',
    title: 'Ambtshalve Aanslag Te Hoog Geschat',
    category: 'ambtshalve',
    scenario: {
      situatie: 'Burger doet geen aangifte inkomstenbelasting. Belastingdienst schat inkomen op basis van beperkte gegevens (vorig jaar + inflatie).',
      beslissing: 'Ambtshalve aanslag van €2.000 opgelegd + verzuimboete €500 = €2.500 totaal. Burger kan dit niet betalen.',
      alternatief: 'Vroegsignalering: Patroon herkend → proactief contact → aangifte begeleiding → werkelijke aanslag €500'
    },
    impact: {
      financieel: { voor: 2500, na: 500 },
      maatschappelijk: { voor: 18500, na: 0 },
      burger: [
        'Stress en angst door onverwachte hoge aanslag',
        'Betalingsproblemen leiden tot incassotraject',
        'Verlies van vertrouwen in Belastingdienst',
        'Mogelijke schuldenspiraal'
      ]
    },
    lessen: [
      'Vroegsignalering kan voorkomen dat ambtshalve aanslagen nodig zijn',
      'Proactieve benadering bespaart kosten voor burger én overheid',
      'Te hoog geschatte aanslagen veroorzaken onnodige problemen'
    ]
  },
  {
    id: 'ambtshalve-2',
    title: 'Geen Teruggave Mogelijk bij Geen Aangifte',
    category: 'ambtshalve',
    scenario: {
      situatie: 'ZZP\'er heeft recht op €800 teruggave door aftrekposten, maar doet geen aangifte (vergeten/overweldigd).',
      beslissing: 'Geen aangifte → geen teruggave mogelijk → burger mist €800 die hij nodig heeft',
      alternatief: 'Vroegsignalering: ZZP\'er herkend → herinnering + hulpaanbod → aangifte gedaan → €800 teruggave'
    },
    impact: {
      financieel: { voor: 0, na: 800 },
      maatschappelijk: { voor: 3200, na: 0 },
      burger: [
        'Mist €800 teruggave die hij nodig heeft',
        'Moet leningen aangaan voor dagelijkse kosten',
        'Verhoogde financiële stress',
        'Mogelijk betalingsachterstanden bij andere schuldeisers'
      ]
    },
    lessen: [
      'Vroegsignalering kan helpen om aangifte te stimuleren',
      'Teruggave is belangrijk voor financiële stabiliteit',
      'Proactieve hulp voorkomt grotere problemen'
    ]
  },
  {
    id: 'vroegsignalering-1',
    title: 'Vroegtijdige Interventie Voorkomt Escalatie',
    category: 'vroegsignalering',
    scenario: {
      situatie: 'Belastingdienst ziet patroon: burger heeft 3 opeenvolgende jaren geen aangifte gedaan, heeft uitkering, andere schulden bekend.',
      beslissing: 'Vroegsignalering systeem triggert → proactief contact → hulpaanbod → aangifte begeleiding → probleem opgelost',
      alternatief: 'Geen vroegsignalering → ambtshalve aanslag → escalatie → incassotraject → schuldenspiraal'
    },
    impact: {
      financieel: { voor: 15000, na: 200 },
      maatschappelijk: { voor: 15000, na: 0 },
      burger: [
        'Probleem opgelost voordat het escaleert',
        'Behoud van financiële stabiliteit',
        'Voorkomen van schuldenspiraal',
        'Behoud van vertrouwen in overheid'
      ]
    },
    lessen: [
      'Vroegsignalering kan €15.000+ maatschappelijke kosten voorkomen',
      'Proactieve aanpak is kosteneffectiever dan reactieve',
      'Patroonherkenning is cruciaal voor vroegsignalering'
    ]
  },
  {
    id: 'beslissing-1',
    title: '€8,50 Schuld: Innen vs Kwijtschelden',
    category: 'beslissing',
    scenario: {
      situatie: 'CAK eigen bijdrage van €8,50 bij burger met bijstandsuitkering, 3 andere schulden, geen betalingsgeschiedenis.',
      beslissing: 'Smart Collection analyse → aanbeveling: kwijtschelden (kosten €5 vs invorderingskosten €660)',
      alternatief: 'Traditionele aanpak → automatisch incassotraject → €660 kosten → 12% succeskans → verlies €658,98'
    },
    impact: {
      financieel: { voor: 660, na: 5 },
      maatschappelijk: { voor: 20080, na: 0 },
      burger: [
        'Voorkomen van extra financiële druk',
        'Voorkomen van escalatie naar deurwaarder',
        'Behoud van vertrouwen in overheid',
        'Geen schuldenspiraal risico'
      ]
    },
    lessen: [
      'Kleine schulden kunnen grote maatschappelijke kosten veroorzaken',
      'Kwijtschelden kan kosteneffectiever zijn dan innen',
      'Data-gedreven beslissingen voorkomen onnodige escalatie'
    ]
  },
  {
    id: 'beslissing-2',
    title: 'Betalingsregeling vs Doorverwijzing',
    category: 'beslissing',
    scenario: {
      situatie: 'Burger met €450 belastingschuld, modaal inkomen, maar 5 andere schulden bekend bij verschillende schuldeisers.',
      beslissing: 'Smart Collection analyse → doorverwijzing naar schuldhulpverlening (consolidatie)',
      alternatief: 'Traditionele aanpak → betalingsregeling alleen voor deze schuld → andere schulden escaleren → totale problematiek groeit'
    },
    impact: {
      financieel: { voor: 1200, na: 300 },
      maatschappelijk: { voor: 8500, na: 1200 },
      burger: [
        'Integrale aanpak van alle schulden',
        'Begeleiding bij schuldhulpverlening',
        'Voorkomen van verdere escalatie',
        'Langetermijn oplossing in plaats van kortetermijn fix'
      ]
    },
    lessen: [
      'Doorverwijzing naar schuldhulp kan effectiever zijn dan individuele regelingen',
      'Integrale aanpak voorkomt dat problemen verschuiven',
      'Vroegtijdige doorverwijzing bespaart kosten'
    ]
  },
  {
    id: 'maatschappelijk-1',
    title: 'Voorkomen van Schuldenspiraal',
    category: 'maatschappelijk',
    scenario: {
      situatie: 'Jonge alleenstaande ouder met €85 gemeentebelasting, bijstandsuitkering, 2 kinderen, al 2 andere kleine schulden.',
      beslissing: 'Vroegsignalering → doorverwijzing naar schuldhulpverlening → preventie schuldenspiraal',
      alternatief: 'Geen vroegsignalering → incassotraject → escalatie → schuldenspiraal → GGZ zorg nodig → werkverzuim'
    },
    impact: {
      financieel: { voor: 450, na: 85 },
      maatschappelijk: { voor: 25000, na: 2000 },
      burger: [
        'Voorkomen van schuldenspiraal',
        'Behoud van werk en inkomen',
        'Voorkomen van GGZ zorg nodig',
        'Stabiliteit voor kinderen'
      ]
    },
    lessen: [
      'Vroegsignalering kan schuldenspiralen voorkomen',
      'Maatschappelijke kosten van schuldenspiralen zijn enorm',
      'Preventie is veel goedkoper dan behandeling'
    ]
  },
  {
    id: 'maatschappelijk-2',
    title: 'Impact op Gezondheid en Werk',
    category: 'maatschappelijk',
    scenario: {
      situatie: 'Werkende burger met €320 zorgverzekeringsschuld, parttime baan, stress door financiële problemen.',
      beslissing: 'Vroegsignalering → betalingsregeling op maat → stress vermindert → werk behouden',
      alternatief: 'Geen vroegsignalering → incassotraject → verhoogde stress → werkverzuim → GGZ zorg → €15.000+ kosten'
    },
    impact: {
      financieel: { voor: 800, na: 320 },
      maatschappelijk: { voor: 15000, na: 0 },
      burger: [
        'Voorkomen van werkverzuim',
        'Voorkomen van GGZ zorg nodig',
        'Behoud van inkomen en stabiliteit',
        'Minder stress en angst'
      ]
    },
    lessen: [
      'Financiële stress heeft directe impact op gezondheid en werk',
      'Vroegtijdige interventie kan gezondheidsproblemen voorkomen',
      'Werk behoud is cruciaal voor financiële stabiliteit'
    ]
  },
  {
    id: 'vroegsignalering-2',
    title: 'Proactieve Benadering ZZP\'ers',
    category: 'vroegsignalering',
    scenario: {
      situatie: 'ZZP\'er heeft 2 jaar achter elkaar geen aangifte gedaan, heeft wisselend inkomen, administratie is overweldigend.',
      beslissing: 'Vroegsignalering → proactief contact → administratiehulp aangeboden → aangifte begeleiding → aangifte gedaan',
      alternatief: 'Geen vroegsignalering → ambtshalve aanslag → te hoog geschat → betalingsproblemen → escalatie'
    },
    impact: {
      financieel: { voor: 3500, na: 500 },
      maatschappelijk: { voor: 12000, na: 0 },
      burger: [
        'Administratieve ondersteuning gekregen',
        'Aangifte succesvol afgerond',
        'Voorkomen van onnodige boetes',
        'Behoud van ondernemerschap'
      ]
    },
    lessen: [
      'ZZP\'ers hebben vaak behoefte aan administratieve ondersteuning',
      'Proactieve hulp voorkomt problemen',
      'Vroegsignalering kan ondernemerschap ondersteunen'
    ]
  }
];

export const categoryLabels: Record<ImpactExample['category'], string> = {
  ambtshalve: 'Ambtshalve Aanslagen',
  vroegsignalering: 'Vroegsignalering Succes',
  beslissing: 'Beslissingsimpact',
  maatschappelijk: 'Maatschappelijke Impact'
};

export const categoryDescriptions: Record<ImpactExample['category'], string> = {
  ambtshalve: 'Voorbeelden van problemen met ambtshalve aanslagen en de impact daarvan',
  vroegsignalering: 'Casussen waar vroegtijdige interventie problemen voorkwam',
  beslissing: 'Vergelijking tussen verschillende aanpakken en hun impact',
  maatschappelijk: 'Concrete voorbeelden van voorkomen maatschappelijke schade'
};

