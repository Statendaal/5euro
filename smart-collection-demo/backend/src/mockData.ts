import { DebtAnalysisRequest, DebtType, IncomeSource } from './types';

export const mockDebts: DebtAnalysisRequest[] = [
  {
    debt: {
      amount: 8.50,
      type: DebtType.CAK_EIGEN_BIJDRAGE,
      originDate: '2024-09-15',
      dueDate: '2024-09-30',
    },
    citizen: {
      bsn: '123456789',
      income: 1450,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 3,
      inDebtAssistance: false,
      paymentHistory: [
        { date: '2024-08-15', amount: 8.50, daysLate: 12 },
        { date: '2024-07-15', amount: 8.50, daysLate: 8 },
      ],
    },
  },
  {
    debt: {
      amount: 65,
      type: DebtType.PARKEERBOETE,
      originDate: '2024-10-01',
      dueDate: '2024-10-15',
    },
    citizen: {
      bsn: '987654321',
      income: 2200,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 1,
      inDebtAssistance: false,
      paymentHistory: [
        { date: '2024-09-01', amount: 65, daysLate: 5 },
      ],
    },
  },
  {
    debt: {
      amount: 85,
      type: DebtType.HONDENBELASTING,
      originDate: '2024-01-01',
      dueDate: '2024-02-01',
    },
    citizen: {
      bsn: '111222333',
      income: 1650,
      incomeSource: IncomeSource.BENEFIT_UNEMPLOYMENT,
      otherDebtsCount: 4,
      inDebtAssistance: true,
      paymentHistory: [
        { date: '2023-12-15', amount: 85, daysLate: 45 },
        { date: '2023-11-15', amount: 85, daysLate: 30 },
      ],
    },
  },
  {
    debt: {
      amount: 42,
      type: DebtType.AFVALSTOFFENHEFFING,
      originDate: '2024-08-01',
      dueDate: '2024-09-01',
    },
    citizen: {
      bsn: '444555666',
      income: 1850,
      incomeSource: IncomeSource.BENEFIT_DISABILITY,
      otherDebtsCount: 2,
      inDebtAssistance: false,
      paymentHistory: [
        { date: '2024-07-01', amount: 42, daysLate: 0 },
        { date: '2024-06-01', amount: 42, daysLate: 3 },
      ],
    },
  },
  {
    debt: {
      amount: 120,
      type: DebtType.BIJZONDERE_BIJSTAND,
      originDate: '2024-09-01',
      dueDate: '2024-10-01',
    },
    citizen: {
      bsn: '777888999',
      income: 1350,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 5,
      inDebtAssistance: true,
      paymentHistory: [
        { date: '2024-08-01', amount: 100, daysLate: 20 },
        { date: '2024-07-01', amount: 120, daysLate: 35 },
      ],
    },
  },
  {
    debt: {
      amount: 89,
      type: DebtType.STUDIEFINANCIERING,
      originDate: '2024-09-15',
      dueDate: '2024-10-15',
    },
    citizen: {
      bsn: '222333444',
      income: 800,
      incomeSource: IncomeSource.SELF_EMPLOYED,
      otherDebtsCount: 1,
      inDebtAssistance: false,
      paymentHistory: [
        { date: '2024-08-15', amount: 89, daysLate: 0 },
      ],
    },
  },
  {
    debt: {
      amount: 45,
      type: DebtType.ZORGVERZEKERING_PREMIE,
      originDate: '2024-10-01',
      dueDate: '2024-10-10',
    },
    citizen: {
      bsn: '555666777',
      income: 2500,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      paymentHistory: [
        { date: '2024-09-01', amount: 45, daysLate: 0 },
        { date: '2024-08-01', amount: 45, daysLate: 0 },
      ],
    },
  },
  {
    debt: {
      amount: 95,
      type: DebtType.VERKEERSBOETE,
      originDate: '2024-09-20',
      dueDate: '2024-10-20',
    },
    citizen: {
      bsn: '888999000',
      income: 1950,
      incomeSource: IncomeSource.PENSION,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      paymentHistory: [],
    },
  },
  {
    debt: {
      amount: 12,
      type: DebtType.CAK_EIGEN_BIJDRAGE,
      originDate: '2024-10-01',
      dueDate: '2024-10-15',
    },
    citizen: {
      bsn: '123123123',
      income: 1400,
      incomeSource: IncomeSource.BENEFIT_SOCIAL,
      otherDebtsCount: 6,
      inDebtAssistance: true,
      paymentHistory: [
        { date: '2024-09-01', amount: 12, daysLate: 25 },
        { date: '2024-08-01', amount: 12, daysLate: 18 },
        { date: '2024-07-01', amount: 12, daysLate: 30 },
      ],
    },
  },
  {
    debt: {
      amount: 35,
      type: DebtType.PARKEERBOETE,
      originDate: '2024-10-10',
      dueDate: '2024-10-25',
    },
    citizen: {
      bsn: '456456456',
      income: 3200,
      incomeSource: IncomeSource.EMPLOYMENT,
      otherDebtsCount: 0,
      inDebtAssistance: false,
      paymentHistory: [],
    },
  },
];

// Generate more mock debts for bulk analysis
for (let i = 0; i < 100; i++) {
  const debtTypes = Object.values(DebtType);
  const incomeSources = Object.values(IncomeSource);

  mockDebts.push({
    debt: {
      amount: Math.floor(Math.random() * 90) + 10, // 10-100 euro
      type: debtTypes[Math.floor(Math.random() * debtTypes.length)],
      originDate: new Date(2024, Math.floor(Math.random() * 10), 1).toISOString().split('T')[0],
      dueDate: new Date(2024, Math.floor(Math.random() * 10) + 1, 1).toISOString().split('T')[0],
    },
    citizen: {
      bsn: `${100000000 + i}`,
      income: Math.floor(Math.random() * 2500) + 1000, // 1000-3500 euro
      incomeSource: incomeSources[Math.floor(Math.random() * incomeSources.length)],
      otherDebtsCount: Math.floor(Math.random() * 6),
      inDebtAssistance: Math.random() > 0.7,
      paymentHistory: Array.from({ length: Math.floor(Math.random() * 4) }, (_, j) => ({
        date: new Date(2024, Math.floor(Math.random() * 10), 1).toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 90) + 10,
        daysLate: Math.floor(Math.random() * 40),
      })),
    },
  });
}
