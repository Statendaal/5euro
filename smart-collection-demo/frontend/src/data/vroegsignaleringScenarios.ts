export interface VroegsignaleringStep {
  stap: number;
  titel: string;
  beschrijving: string;
  actie: string;
  kosten: number;
  tijdsduur: string;
  impact: {
    financieel: number;
    maatschappelijk: number;
    burger: string;
  };
}

export interface VroegsignaleringScenario {
  id: string;
  titel: string;
  categorie: 'ambtshalve' | 'vroegsignalering' | 'teruggave' | 'zzp';
  beschrijving: string;
  traditioneleAanpak: VroegsignaleringStep[];
  vroegsignaleringAanpak: VroegsignaleringStep[];
  totaalImpact: {
    financieel: { traditioneel: number; vroegsignalering: number };
    maatschappelijk: { traditioneel: number; vroegsignalering: number };
    burger: { traditioneel: string[]; vroegsignalering: string[] };
  };
  lessen: string[];
}

export const vroegsignaleringScenarios: VroegsignaleringScenario[] = [
  {
    id: 'ambtshalve-te-hoog',
    titel: 'Ambtshalve Aanslag Te Hoog Geschat',
    categorie: 'ambtshalve',
    beschrijving: 'Burger doet geen aangifte inkomstenbelasting. Belastingdienst schat inkomen op basis van beperkte gegevens.',
    traditioneleAanpak: [
      {
        stap: 1,
        titel: 'Geen Aangifte',
        beschrijving: 'Burger doet geen aangifte binnen de termijn',
        actie: 'Geen actie van burger',
        kosten: 0,
        tijdsduur: '0 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 0,
          burger: 'Geen actie ondernomen'
        }
      },
      {
        stap: 2,
        titel: 'Herinnering',
        beschrijving: 'Belastingdienst stuurt herinnering',
        actie: 'Brief verstuurd',
        kosten: 5,
        tijdsduur: '+14 dagen',
        impact: {
          financieel: 5,
          maatschappelijk: 0,
          burger: 'Herinnering ontvangen'
        }
      },
      {
        stap: 3,
        titel: 'Aanmaning',
        beschrijving: 'Belastingdienst stuurt aanmaning',
        actie: 'Brief verstuurd',
        kosten: 10,
        tijdsduur: '+28 dagen',
        impact: {
          financieel: 10,
          maatschappelijk: 200,
          burger: 'Stress door aanmaning'
        }
      },
      {
        stap: 4,
        titel: 'Ambtshalve Aanslag',
        beschrijving: 'Belastingdienst legt ambtshalve aanslag op (te hoog geschat)',
        actie: 'Aanslag €2.000 + verzuimboete €500',
        kosten: 2500,
        tijdsduur: '+60 dagen',
        impact: {
          financieel: 2500,
          maatschappelijk: 5000,
          burger: 'Onverwachte hoge aanslag, kan niet betalen'
        }
      },
      {
        stap: 5,
        titel: 'Incassotraject',
        beschrijving: 'Burger kan niet betalen, incassotraject start',
        actie: 'Incassobureau ingeschakeld',
        kosten: 500,
        tijdsduur: '+90 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 8000,
          burger: 'Escalatie, verlies van vertrouwen'
        }
      },
      {
        stap: 6,
        titel: 'Schuldenspiraal',
        beschrijving: 'Problemen stapelen zich op',
        actie: 'Andere schulden escaleren',
        kosten: 0,
        tijdsduur: '+120 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 5000,
          burger: 'Schuldenspiraal, GGZ zorg nodig'
        }
      }
    ],
    vroegsignaleringAanpak: [
      {
        stap: 1,
        titel: 'Patroonherkenning',
        beschrijving: 'Systeem herkent patroon: geen aangifte vorig jaar, uitkering, andere schulden',
        actie: 'Vroegsignalering systeem triggert',
        kosten: 2,
        tijdsduur: '0 dagen',
        impact: {
          financieel: 2,
          maatschappelijk: 0,
          burger: 'Geen impact'
        }
      },
      {
        stap: 2,
        titel: 'Proactief Contact',
        beschrijving: 'Belastingdienst neemt proactief contact op',
        actie: 'Telefoongesprek of brief met hulpaanbod',
        kosten: 10,
        tijdsduur: '+7 dagen',
        impact: {
          financieel: 10,
          maatschappelijk: 0,
          burger: 'Positief verrast door proactieve benadering'
        }
      },
      {
        stap: 3,
        titel: 'Aangifte Begeleiding',
        beschrijving: 'Burger krijgt hulp bij het doen van aangifte',
        actie: 'Begeleiding bij aangifte',
        kosten: 50,
        tijdsduur: '+14 dagen',
        impact: {
          financieel: 50,
          maatschappelijk: 0,
          burger: 'Aangifte succesvol afgerond'
        }
      },
      {
        stap: 4,
        titel: 'Werkelijke Aanslag',
        beschrijving: 'Correcte aanslag op basis van werkelijke gegevens',
        actie: 'Aanslag €500 (geen boete)',
        kosten: 500,
        tijdsduur: '+21 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 0,
          burger: 'Redelijke aanslag, kan betalen'
        }
      },
      {
        stap: 5,
        titel: 'Betalingsregeling',
        beschrijving: 'Betalingsregeling op maat',
        actie: 'Regeling getroffen',
        kosten: 20,
        tijdsduur: '+30 dagen',
        impact: {
          financieel: 20,
          maatschappelijk: 0,
          burger: 'Probleem opgelost, vertrouwen behouden'
        }
      }
    ],
    totaalImpact: {
      financieel: { traditioneel: 3015, vroegsignalering: 582 },
      maatschappelijk: { traditioneel: 18500, vroegsignalering: 0 },
      burger: {
        traditioneel: [
          'Stress en angst door onverwachte hoge aanslag',
          'Betalingsproblemen leiden tot incassotraject',
          'Verlies van vertrouwen in Belastingdienst',
          'Mogelijke schuldenspiraal'
        ],
        vroegsignalering: [
          'Probleem opgelost voordat het escaleert',
          'Behoud van financiële stabiliteit',
          'Behoud van vertrouwen in overheid',
          'Geen escalatie naar incassotraject'
        ]
      }
    },
    lessen: [
      'Vroegsignalering kan voorkomen dat ambtshalve aanslagen nodig zijn',
      'Proactieve benadering bespaart €2.433 voor burger en €18.500 maatschappelijke kosten',
      'Te hoog geschatte aanslagen veroorzaken onnodige problemen'
    ]
  },
  {
    id: 'teruggave-mist',
    titel: 'Geen Teruggave Mogelijk bij Geen Aangifte',
    categorie: 'teruggave',
    beschrijving: 'ZZP\'er heeft recht op teruggave maar doet geen aangifte.',
    traditioneleAanpak: [
      {
        stap: 1,
        titel: 'Geen Aangifte',
        beschrijving: 'ZZP\'er doet geen aangifte (vergeten/overweldigd)',
        actie: 'Geen actie',
        kosten: 0,
        tijdsduur: '0 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 0,
          burger: 'Geen aangifte gedaan'
        }
      },
      {
        stap: 2,
        titel: 'Herinnering',
        beschrijving: 'Herinnering verstuurd',
        actie: 'Brief',
        kosten: 5,
        tijdsduur: '+14 dagen',
        impact: {
          financieel: 5,
          maatschappelijk: 0,
          burger: 'Herinnering ontvangen'
        }
      },
      {
        stap: 3,
        titel: 'Geen Reactie',
        beschrijving: 'Geen reactie op herinnering',
        actie: 'Geen actie',
        kosten: 0,
        tijdsduur: '+28 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 500,
          burger: 'Stress, maar nog geen actie'
        }
      },
      {
        stap: 4,
        titel: 'Geen Teruggave',
        beschrijving: 'Geen teruggave mogelijk zonder aangifte',
        actie: 'Burger mist €800 teruggave',
        kosten: 0,
        tijdsduur: '+60 dagen',
        impact: {
          financieel: -800,
          maatschappelijk: 1500,
          burger: 'Mist €800 die nodig is voor dagelijkse kosten'
        }
      },
      {
        stap: 5,
        titel: 'Financiële Problemen',
        beschrijving: 'Burger moet leningen aangaan',
        actie: 'Leningen, achterstanden',
        kosten: 0,
        tijdsduur: '+90 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 1200,
          burger: 'Verhoogde financiële stress, achterstanden'
        }
      }
    ],
    vroegsignaleringAanpak: [
      {
        stap: 1,
        titel: 'ZZP\'er Herkend',
        beschrijving: 'Systeem herkent ZZP\'er die mogelijk recht heeft op teruggave',
        actie: 'Vroegsignalering triggert',
        kosten: 2,
        tijdsduur: '0 dagen',
        impact: {
          financieel: 2,
          maatschappelijk: 0,
          burger: 'Geen impact'
        }
      },
      {
        stap: 2,
        titel: 'Proactieve Herinnering',
        beschrijving: 'Persoonlijke herinnering met hulpaanbod',
        actie: 'Brief/telefoon met hulpaanbod',
        kosten: 10,
        tijdsduur: '+7 dagen',
        impact: {
          financieel: 10,
          maatschappelijk: 0,
          burger: 'Positief verrast, hulp aangeboden'
        }
      },
      {
        stap: 3,
        titel: 'Aangifte Hulp',
        beschrijving: 'Administratieve ondersteuning bij aangifte',
        actie: 'Hulp bij aangifte',
        kosten: 50,
        tijdsduur: '+14 dagen',
        impact: {
          financieel: 50,
          maatschappelijk: 0,
          burger: 'Aangifte succesvol afgerond'
        }
      },
      {
        stap: 4,
        titel: 'Teruggave',
        beschrijving: '€800 teruggave uitgekeerd',
        actie: 'Teruggave verwerkt',
        kosten: -800,
        tijdsduur: '+21 dagen',
        impact: {
          financieel: -800,
          maatschappelijk: 0,
          burger: '€800 teruggave ontvangen, financiële stabiliteit'
        }
      }
    ],
    totaalImpact: {
      financieel: { traditioneel: -795, vroegsignalering: -738 },
      maatschappelijk: { traditioneel: 3200, vroegsignalering: 0 },
      burger: {
        traditioneel: [
          'Mist €800 teruggave die nodig is',
          'Moet leningen aangaan voor dagelijkse kosten',
          'Verhoogde financiële stress',
          'Mogelijk betalingsachterstanden bij andere schuldeisers'
        ],
        vroegsignalering: [
          '€800 teruggave ontvangen',
          'Geen leningen nodig',
          'Financiële stabiliteit behouden',
          'Vertrouwen in overheid behouden'
        ]
      }
    },
    lessen: [
      'Vroegsignalering kan helpen om aangifte te stimuleren',
      'Teruggave is belangrijk voor financiële stabiliteit',
      'Proactieve hulp voorkomt grotere problemen'
    ]
  },
  {
    id: 'patroon-herkenning',
    titel: 'Vroegtijdige Interventie Voorkomt Escalatie',
    categorie: 'vroegsignalering',
    beschrijving: 'Belastingdienst ziet patroon: burger heeft 3 jaar geen aangifte gedaan.',
    traditioneleAanpak: [
      {
        stap: 1,
        titel: 'Geen Aangifte (Jaar 1)',
        beschrijving: 'Eerste jaar geen aangifte',
        actie: 'Geen actie',
        kosten: 0,
        tijdsduur: 'Jaar 1',
        impact: {
          financieel: 0,
          maatschappelijk: 0,
          burger: 'Geen aangifte'
        }
      },
      {
        stap: 2,
        titel: 'Geen Aangifte (Jaar 2)',
        beschrijving: 'Tweede jaar geen aangifte',
        actie: 'Herinnering verstuurd',
        kosten: 10,
        tijdsduur: 'Jaar 2',
        impact: {
          financieel: 10,
          maatschappelijk: 500,
          burger: 'Herinnering, maar geen actie'
        }
      },
      {
        stap: 3,
        titel: 'Geen Aangifte (Jaar 3)',
        beschrijving: 'Derde jaar geen aangifte',
        actie: 'Aanmaning verstuurd',
        kosten: 20,
        tijdsduur: 'Jaar 3',
        impact: {
          financieel: 20,
          maatschappelijk: 2000,
          burger: 'Meer stress, maar nog geen actie'
        }
      },
      {
        stap: 4,
        titel: 'Ambtshalve Aanslag',
        beschrijving: 'Ambtshalve aanslag opgelegd',
        actie: 'Aanslag + boete',
        kosten: 3000,
        tijdsduur: '+60 dagen',
        impact: {
          financieel: 3000,
          maatschappelijk: 5000,
          burger: 'Onverwachte hoge aanslag'
        }
      },
      {
        stap: 5,
        titel: 'Incassotraject',
        beschrijving: 'Burger kan niet betalen',
        actie: 'Incassobureau',
        kosten: 500,
        tijdsduur: '+90 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 5000,
          burger: 'Escalatie, schuldenspiraal'
        }
      },
      {
        stap: 6,
        titel: 'Schuldenspiraal',
        beschrijving: 'Problemen stapelen op',
        actie: 'Andere schulden escaleren',
        kosten: 0,
        tijdsduur: '+120 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 5000,
          burger: 'GGZ zorg nodig, werkverzuim'
        }
      }
    ],
    vroegsignaleringAanpak: [
      {
        stap: 1,
        titel: 'Patroonherkenning',
        beschrijving: 'Systeem herkent patroon: 3 jaar geen aangifte, uitkering, andere schulden',
        actie: 'Vroegsignalering systeem triggert',
        kosten: 2,
        tijdsduur: 'Jaar 3, dag 1',
        impact: {
          financieel: 2,
          maatschappelijk: 0,
          burger: 'Geen impact'
        }
      },
      {
        stap: 2,
        titel: 'Proactief Contact',
        beschrijving: 'Persoonlijk contact met hulpaanbod',
        actie: 'Telefoongesprek',
        kosten: 10,
        tijdsduur: '+7 dagen',
        impact: {
          financieel: 10,
          maatschappelijk: 0,
          burger: 'Positief verrast'
        }
      },
      {
        stap: 3,
        titel: 'Aangifte Begeleiding',
        beschrijving: 'Hulp bij alle 3 de aangiften',
        actie: 'Begeleiding',
        kosten: 100,
        tijdsduur: '+21 dagen',
        impact: {
          financieel: 100,
          maatschappelijk: 0,
          burger: 'Aangiften afgerond'
        }
      },
      {
        stap: 4,
        titel: 'Correcte Aanslagen',
        beschrijving: 'Correcte aanslagen op basis van werkelijke gegevens',
        actie: 'Aanslagen verwerkt',
        kosten: 500,
        tijdsduur: '+30 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 0,
          burger: 'Redelijke aanslagen'
        }
      },
      {
        stap: 5,
        titel: 'Betalingsregeling',
        beschrijving: 'Regeling op maat',
        actie: 'Regeling getroffen',
        kosten: 20,
        tijdsduur: '+45 dagen',
        impact: {
          financieel: 20,
          maatschappelijk: 0,
          burger: 'Probleem opgelost'
        }
      }
    ],
    totaalImpact: {
      financieel: { traditioneel: 3530, vroegsignalering: 632 },
      maatschappelijk: { traditioneel: 15000, vroegsignalering: 0 },
      burger: {
        traditioneel: [
          'Probleem escaleert over 3 jaar',
          'Onverwachte hoge aanslag',
          'Schuldenspiraal',
          'GGZ zorg nodig, werkverzuim'
        ],
        vroegsignalering: [
          'Probleem opgelost voordat het escaleert',
          'Behoud van financiële stabiliteit',
          'Voorkomen van schuldenspiraal',
          'Behoud van vertrouwen in overheid'
        ]
      }
    },
    lessen: [
      'Vroegsignalering kan €15.000+ maatschappelijke kosten voorkomen',
      'Proactieve aanpak is kosteneffectiever dan reactieve',
      'Patroonherkenning is cruciaal voor vroegsignalering'
    ]
  },
  {
    id: 'zzp-administratie',
    titel: 'Proactieve Benadering ZZP\'ers',
    categorie: 'zzp',
    beschrijving: 'ZZP\'er heeft 2 jaar geen aangifte gedaan, administratie is overweldigend.',
    traditioneleAanpak: [
      {
        stap: 1,
        titel: 'Geen Aangifte (Jaar 1)',
        beschrijving: 'Eerste jaar geen aangifte',
        actie: 'Geen actie',
        kosten: 0,
        tijdsduur: 'Jaar 1',
        impact: {
          financieel: 0,
          maatschappelijk: 0,
          burger: 'Geen aangifte'
        }
      },
      {
        stap: 2,
        titel: 'Geen Aangifte (Jaar 2)',
        beschrijving: 'Tweede jaar geen aangifte',
        actie: 'Herinnering',
        kosten: 10,
        tijdsduur: 'Jaar 2',
        impact: {
          financieel: 10,
          maatschappelijk: 500,
          burger: 'Stress, maar administratie te overweldigend'
        }
      },
      {
        stap: 3,
        titel: 'Ambtshalve Aanslag',
        beschrijving: 'Te hoog geschatte aanslag',
        actie: 'Aanslag + boete',
        kosten: 2500,
        tijdsduur: '+60 dagen',
        impact: {
          financieel: 2500,
          maatschappelijk: 3000,
          burger: 'Onverwachte hoge aanslag, kan niet betalen'
        }
      },
      {
        stap: 4,
        titel: 'Betalingsproblemen',
        beschrijving: 'Burger kan niet betalen',
        actie: 'Incassotraject',
        kosten: 500,
        tijdsduur: '+90 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 5000,
          burger: 'Escalatie, mogelijk einde ondernemerschap'
        }
      },
      {
        stap: 5,
        titel: 'Ondernemerschap Risico',
        beschrijving: 'Ondernemerschap komt in gevaar',
        actie: 'Mogelijk stopzetten',
        kosten: 0,
        tijdsduur: '+120 dagen',
        impact: {
          financieel: 0,
          maatschappelijk: 4000,
          burger: 'Ondernemerschap in gevaar'
        }
      }
    ],
    vroegsignaleringAanpak: [
      {
        stap: 1,
        titel: 'ZZP\'er Herkend',
        beschrijving: 'Systeem herkent ZZP\'er met administratieve problemen',
        actie: 'Vroegsignalering triggert',
        kosten: 2,
        tijdsduur: 'Jaar 2, dag 1',
        impact: {
          financieel: 2,
          maatschappelijk: 0,
          burger: 'Geen impact'
        }
      },
      {
        stap: 2,
        titel: 'Administratieve Hulp Aangeboden',
        beschrijving: 'Persoonlijk contact met aanbod voor administratieve ondersteuning',
        actie: 'Telefoongesprek + hulpaanbod',
        kosten: 10,
        tijdsduur: '+7 dagen',
        impact: {
          financieel: 10,
          maatschappelijk: 0,
          burger: 'Hulp aangeboden, opluchting'
        }
      },
      {
        stap: 3,
        titel: 'Administratieve Ondersteuning',
        beschrijving: 'Hulp bij administratie en aangiften',
        actie: 'Begeleiding bij aangiften',
        kosten: 150,
        tijdsduur: '+21 dagen',
        impact: {
          financieel: 150,
          maatschappelijk: 0,
          burger: 'Administratie op orde, aangiften gedaan'
        }
      },
      {
        stap: 4,
        titel: 'Correcte Aanslagen',
        beschrijving: 'Correcte aanslagen op basis van werkelijke gegevens',
        actie: 'Aanslagen verwerkt',
        kosten: 500,
        tijdsduur: '+30 dagen',
        impact: {
          financieel: 500,
          maatschappelijk: 0,
          burger: 'Redelijke aanslagen, kan betalen'
        }
      },
      {
        stap: 5,
        titel: 'Ondernemerschap Behouden',
        beschrijving: 'Ondernemerschap kan doorgaan',
        actie: 'Regeling getroffen',
        kosten: 20,
        tijdsduur: '+45 dagen',
        impact: {
          financieel: 20,
          maatschappelijk: 0,
          burger: 'Ondernemerschap behouden, toekomst veiliggesteld'
        }
      }
    ],
    totaalImpact: {
      financieel: { traditioneel: 3010, vroegsignalering: 682 },
      maatschappelijk: { traditioneel: 12500, vroegsignalering: 0 },
      burger: {
        traditioneel: [
          'Administratieve problemen escaleren',
          'Onverwachte hoge aanslag',
          'Ondernemerschap komt in gevaar',
          'Mogelijk einde ondernemerschap'
        ],
        vroegsignalering: [
          'Administratieve ondersteuning gekregen',
          'Aangiften succesvol afgerond',
          'Voorkomen van onnodige boetes',
          'Ondernemerschap behouden'
        ]
      }
    },
    lessen: [
      'ZZP\'ers hebben vaak behoefte aan administratieve ondersteuning',
      'Proactieve hulp voorkomt problemen',
      'Vroegsignalering kan ondernemerschap ondersteunen'
    ]
  }
];

export const categorieLabels: Record<VroegsignaleringScenario['categorie'], string> = {
  ambtshalve: 'Ambtshalve Aanslagen',
  vroegsignalering: 'Vroegsignalering',
  teruggave: 'Teruggave',
  zzp: 'ZZP\'ers'
};

export const categorieDescriptions: Record<VroegsignaleringScenario['categorie'], string> = {
  ambtshalve: 'Scenario\'s rondom ambtshalve aanslagen en de problematiek daarvan',
  vroegsignalering: 'Voorbeelden van succesvolle vroegsignalering',
  teruggave: 'Scenario\'s waarbij teruggave gemist wordt zonder vroegsignalering',
  zzp: 'Specifieke scenario\'s voor zelfstandigen zonder personeel'
};

