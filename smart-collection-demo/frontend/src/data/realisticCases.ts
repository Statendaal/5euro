import { DebtAnalysisRequest, DebtType, IncomeSource } from '../types';

/**
 * 10 Realistische casussen gebaseerd op CBS patronen
 *
 * CBS data laat zien:
 * - 88.7% heeft uitkering
 * - 75.6% is werkloos
 * - 62.6% heeft laag inkomen (<€1500)
 * - 68.4% heeft kleine schuld (<€100)
 * - 14.8% is eenouder
 * - 17.7% heeft jeugdzorg
 */
export const REALISTIC_CASES: DebtAnalysisRequest[] = [
  // Case 1: Klein CAK bedrag, bijstand, veel andere schulden, jeugdzorg
  {
    debt: {
      amount: 8.50,
      type: DebtType.CAK_EIGEN_BIJDRAGE,
      originDate: '2024-09-15',
      dueDate: '2024-09-30',
    },
    citizen: {
      bsn: '123456789',
      income: 1350,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 4,
      inDebtAssistance: false,
      hasChildren: true,
      isSingleParent: true,
      hasJeugdzorg: true,
      paymentHistory: [
        { date: '2024-08-15', amount: 8.50, daysLate: 12 },
        { date: '2024-07-15', amount: 8.50, daysLate: 8 },
      ],
    },
  },

  // Case 2: Zorgverzekering, werkloos, geen andere schulden
  {
    debt: {
      amount: 145.00,
      type: DebtType.HEALTHCARE_INSURANCE,
      originDate: '2024-08-01',
      dueDate: '2024-08-15',
    },
    citizen: {
      bsn: '234567890',
      income: 1200,
      incomeSource: IncomeSource.BENEFIT_UNEMPLOYMENT,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      hasChildren: false,
      isSingleParent: false,
      paymentHistory: [],
    },
  },

  // Case 3: Gemeentelijke belasting, laag inkomen uit werk, meerdere schulden
  {
    debt: {
      amount: 285.00,
      type: DebtType.MUNICIPALITY,
      originDate: '2024-06-01',
      dueDate: '2024-07-01',
    },
    citizen: {
      bsn: '345678901',
      income: 1600,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 2,
      inDebtAssistance: false,
      hasChildren: true,
      isSingleParent: false,
      paymentHistory: [
        { date: '2024-05-15', amount: 100, daysLate: 30 },
      ],
    },
  },

  // Case 4: Belastingschuld, ZZP met laag inkomen
  {
    debt: {
      amount: 450.00,
      type: DebtType.TAX,
      originDate: '2024-03-15',
      dueDate: '2024-04-15',
    },
    citizen: {
      bsn: '456789012',
      income: 1100,
      incomeSource: IncomeSource.SELF_EMPLOYED,
      otherDebtsCount: 1,
      inDebtAssistance: false,
      hasChildren: false,
      isSingleParent: false,
      isZzp: true,
      paymentHistory: [],
    },
  },

  // Case 5: Klein CAK bedrag, AOW, geen andere schulden
  {
    debt: {
      amount: 17.00,
      type: DebtType.CAK_EIGEN_BIJDRAGE,
      originDate: '2024-10-01',
      dueDate: '2024-10-15',
    },
    citizen: {
      bsn: '567890123',
      income: 1800,
      incomeSource: IncomeSource.PENSION,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      hasChildren: false,
      isSingleParent: false,
      ageCategory: 'oud',
      paymentHistory: [],
    },
  },

  // Case 6: Nutsbedrijven, bijstand, al in schuldhulpverlening
  {
    debt: {
      amount: 320.00,
      type: DebtType.UTILITIES,
      originDate: '2024-07-15',
      dueDate: '2024-08-15',
    },
    citizen: {
      bsn: '678901234',
      income: 1250,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 5,
      inDebtAssistance: true,
      hasChildren: true,
      isSingleParent: true,
      paymentHistory: [
        { date: '2024-06-15', amount: 50, daysLate: 45 },
        { date: '2024-05-15', amount: 50, daysLate: 60 },
      ],
    },
  },

  // Case 7: Zorgverzekering, WIA uitkering, eenouder
  {
    debt: {
      amount: 195.00,
      type: DebtType.HEALTHCARE_INSURANCE,
      originDate: '2024-09-01',
      dueDate: '2024-09-15',
    },
    citizen: {
      bsn: '789012345',
      income: 1400,
      incomeSource: IncomeSource.BENEFIT_DISABILITY,
      otherDebtsCount: 2,
      inDebtAssistance: false,
      hasChildren: true,
      numChildren: 2,
      isSingleParent: true,
      paymentHistory: [],
    },
  },

  // Case 8: Hoog CAK bedrag, werkend, flexcontract
  {
    debt: {
      amount: 425.00,
      type: DebtType.CAK_EIGEN_BIJDRAGE,
      originDate: '2024-01-15',
      dueDate: '2024-02-15',
    },
    citizen: {
      bsn: '890123456',
      income: 1550,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 1,
      inDebtAssistance: false,
      hasChildren: false,
      hasFlexWork: true,
      ageCategory: 'jong',
      paymentHistory: [
        { date: '2023-12-15', amount: 100, daysLate: 90 },
      ],
    },
  },

  // Case 9: Gemeente belasting, bijstand, jeugdzorg, veel schulden
  {
    debt: {
      amount: 85.00,
      type: DebtType.MUNICIPALITY,
      originDate: '2024-10-10',
      dueDate: '2024-10-25',
    },
    citizen: {
      bsn: '901234567',
      income: 1300,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 6,
      inDebtAssistance: false,
      hasChildren: true,
      numChildren: 3,
      isSingleParent: true,
      hasJeugdzorg: true,
      paymentHistory: [
        { date: '2024-09-10', amount: 50, daysLate: 20 },
        { date: '2024-08-10', amount: 50, daysLate: 35 },
      ],
    },
  },

  // Case 10: Klein belastingbedrag, goed inkomen, jonge professional
  {
    debt: {
      amount: 65.00,
      type: DebtType.TAX,
      originDate: '2024-10-20',
      dueDate: '2024-11-05',
    },
    citizen: {
      bsn: '012345678',
      income: 2400,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      hasChildren: false,
      ageCategory: 'jong',
      paymentHistory: [],
    },
  },
];

/**
 * Get a random realistic case
 */
export function getRandomRealisticCase(): DebtAnalysisRequest {
  const randomIndex = Math.floor(Math.random() * REALISTIC_CASES.length);
  return REALISTIC_CASES[randomIndex];
}

/**
 * Get case by index (0-9)
 */
export function getRealisticCase(index: number): DebtAnalysisRequest {
  if (index < 0 || index >= REALISTIC_CASES.length) {
    throw new Error(`Invalid case index: ${index}. Must be between 0 and ${REALISTIC_CASES.length - 1}`);
  }
  return REALISTIC_CASES[index];
}
