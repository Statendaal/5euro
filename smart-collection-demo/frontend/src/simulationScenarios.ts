import { DebtAnalysisRequest, DebtType, IncomeSource } from "./types";

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  category: "vulnerable" | "working" | "struggling" | "stable";
  iconColor: string;
  request: DebtAnalysisRequest;
}

export const simulationScenarios: SimulationScenario[] = [
  // Kwetsbare burgers
  {
    id: "bijstand-klein",
    name: "Alleenstaande Ouder - Bijstand",
    description: "€15 CAK schuld, bijstandsuitkering, 2 kinderen",
    category: "vulnerable",
    iconColor: "text-red-600",
    request: {
      debt: {
        amount: 15,
        type: DebtType.CAK_EIGEN_BIJDRAGE,
        originDate: "2024-06-01",
        dueDate: "2024-07-01",
      },
      citizen: {
        bsn: "SIMULATED_001",
        income: 1200,
        incomeSource: IncomeSource.BENEFIT_SOCIAL,
        otherDebtsCount: 3,
        inDebtAssistance: false,
        paymentHistory: [],
      },
    },
  },
  {
    id: "ww-zorgkosten",
    name: "Werkzoekende - Zorgkosten",
    description: "€45 zorgverzekering, WW-uitkering",
    category: "vulnerable",
    iconColor: "text-red-600",
    request: {
      debt: {
        amount: 45,
        type: DebtType.ZORGVERZEKERING_PREMIE,
        originDate: "2024-05-15",
        dueDate: "2024-06-15",
      },
      citizen: {
        bsn: "SIMULATED_002",
        income: 1500,
        incomeSource: IncomeSource.BENEFIT_UNEMPLOYMENT,
        otherDebtsCount: 2,
        inDebtAssistance: false,
        paymentHistory: [],
      },
    },
  },
  {
    id: "schuldhulp-actief",
    name: "In Schuldhulpverlening",
    description: "€8 verkeersboete, al in schuldhulptraject",
    category: "vulnerable",
    iconColor: "text-red-600",
    request: {
      debt: {
        amount: 8,
        type: DebtType.VERKEERSBOETE,
        originDate: "2024-07-10",
        dueDate: "2024-08-10",
      },
      citizen: {
        bsn: "SIMULATED_003",
        income: 1100,
        incomeSource: IncomeSource.BENEFIT_SOCIAL,
        otherDebtsCount: 8,
        inDebtAssistance: true,
        paymentHistory: [],
      },
    },
  },

  // Werkende burgers met financiële problemen
  {
    id: "parttime-duo",
    name: "Parttime Werker - Studieschuld",
    description: "€25 DUO terugvorderingsrente, parttime inkomen",
    category: "struggling",
    iconColor: "text-orange-600",
    request: {
      debt: {
        amount: 25,
        type: DebtType.STUDIEFINANCIERING,
        originDate: "2024-04-20",
        dueDate: "2024-05-20",
      },
      citizen: {
        bsn: "SIMULATED_004",
        income: 1400,
        incomeSource: IncomeSource.EMPLOYMENT,
        otherDebtsCount: 4,
        inDebtAssistance: false,
        paymentHistory: [
          { date: "2024-01-15", amount: 10, daysLate: 5 },
          { date: "2023-12-20", amount: 15, daysLate: 12 },
        ],
      },
    },
  },
  {
    id: "modaal-belasting",
    name: "Modaal Inkomen - Afvalstoffenheffing",
    description: "€120 gemeente heffing, modaal inkomen, betalingsachterstand",
    category: "struggling",
    iconColor: "text-orange-600",
    request: {
      debt: {
        amount: 120,
        type: DebtType.AFVALSTOFFENHEFFING,
        originDate: "2024-03-01",
        dueDate: "2024-04-01",
      },
      citizen: {
        bsn: "SIMULATED_005",
        income: 2800,
        incomeSource: IncomeSource.EMPLOYMENT,
        otherDebtsCount: 2,
        inDebtAssistance: false,
        paymentHistory: [{ date: "2024-02-10", amount: 50, daysLate: 8 }],
      },
    },
  },
  {
    id: "zzp-gemeente",
    name: "ZZP'er - Gemeentelijke Schuld",
    description: "€35 hondenbelasting, wisselend inkomen",
    category: "struggling",
    iconColor: "text-orange-600",
    request: {
      debt: {
        amount: 35,
        type: DebtType.HONDENBELASTING,
        originDate: "2024-05-05",
        dueDate: "2024-06-05",
      },
      citizen: {
        bsn: "SIMULATED_006",
        income: 2200,
        incomeSource: IncomeSource.SELF_EMPLOYED,
        otherDebtsCount: 1,
        inDebtAssistance: false,
        paymentHistory: [{ date: "2023-11-15", amount: 35, daysLate: 3 }],
      },
    },
  },

  // Werkende burgers met stabiel inkomen
  {
    id: "fulltime-parkeren",
    name: "Fulltime Werkend - Parkeerboete",
    description: "€75 parkeerboete, goed inkomen, vergeten te betalen",
    category: "working",
    iconColor: "text-yellow-600",
    request: {
      debt: {
        amount: 75,
        type: DebtType.PARKEERBOETE,
        originDate: "2024-06-15",
        dueDate: "2024-07-15",
      },
      citizen: {
        bsn: "SIMULATED_007",
        income: 3500,
        incomeSource: IncomeSource.EMPLOYMENT,
        otherDebtsCount: 0,
        inDebtAssistance: false,
        paymentHistory: [{ date: "2023-08-10", amount: 60, daysLate: 2 }],
      },
    },
  },
  {
    id: "fulltime-cjib",
    name: "Werkend - Verkeersboete",
    description: "€150 verkeersboete, stabiel inkomen",
    category: "working",
    iconColor: "text-yellow-600",
    request: {
      debt: {
        amount: 150,
        type: DebtType.VERKEERSBOETE,
        originDate: "2024-05-20",
        dueDate: "2024-06-20",
      },
      citizen: {
        bsn: "SIMULATED_008",
        income: 4200,
        incomeSource: IncomeSource.EMPLOYMENT,
        otherDebtsCount: 0,
        inDebtAssistance: false,
        paymentHistory: [{ date: "2023-12-05", amount: 100, daysLate: 5 }],
      },
    },
  },

  // Stabiele burgers met klein verzuim
  {
    id: "hoog-inkomen-zorg",
    name: "Hoog Inkomen - Admin Fout",
    description: "€12 CAK, administratieve fout, hoog inkomen",
    category: "stable",
    iconColor: "text-green-600",
    request: {
      debt: {
        amount: 12,
        type: DebtType.CAK_EIGEN_BIJDRAGE,
        originDate: "2024-07-01",
        dueDate: "2024-08-01",
      },
      citizen: {
        bsn: "SIMULATED_009",
        income: 6500,
        incomeSource: IncomeSource.EMPLOYMENT,
        otherDebtsCount: 0,
        inDebtAssistance: false,
        paymentHistory: [
          { date: "2024-01-10", amount: 20, daysLate: 0 },
          { date: "2023-10-15", amount: 25, daysLate: 0 },
        ],
      },
    },
  },
  {
    id: "pensioen-klein",
    name: "Gepensioneerde - Klein Bedrag",
    description: "€5 afvalstoffenheffing, pensioeninkomen",
    category: "stable",
    iconColor: "text-green-600",
    request: {
      debt: {
        amount: 5,
        type: DebtType.AFVALSTOFFENHEFFING,
        originDate: "2024-06-10",
        dueDate: "2024-07-10",
      },
      citizen: {
        bsn: "SIMULATED_010",
        income: 2200,
        incomeSource: IncomeSource.PENSION,
        otherDebtsCount: 0,
        inDebtAssistance: false,
        paymentHistory: [{ date: "2023-06-10", amount: 5, daysLate: 0 }],
      },
    },
  },
];

export const categoryLabels = {
  vulnerable: "Kwetsbare Burgers",
  struggling: "Financieel Worstelen",
  working: "Werkend - Stabiel",
  stable: "Stabiel - Klein Verzuim",
};

export const categoryDescriptions = {
  vulnerable:
    "Burgers met minimuminkomen, schuldhulp, of complexe problematiek",
  struggling:
    "Werkende burgers met betalingsachterstanden of meerdere schulden",
  working: "Werkend met goed inkomen, vergeten betalingen",
  stable: "Stabiel inkomen, administratieve fouten of klein verzuim",
};
