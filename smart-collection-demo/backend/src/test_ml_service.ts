import { getMLRecommendation } from './mlService';
import { DebtAnalysisRequest, DebtType, IncomeSource } from './types';

const testRequest: DebtAnalysisRequest = {
  debt: {
    amount: 15,
    type: DebtType.CAK_EIGEN_BIJDRAGE,
    originDate: '2024-06-01',
    dueDate: '2024-07-01'
  },
  citizen: {
    bsn: 'TEST001',
    income: 1200,
    incomeSource: IncomeSource.BENEFIT_SOCIAL,
    otherDebtsCount: 3,
    inDebtAssistance: false,
    paymentHistory: []
  }
};

getMLRecommendation(testRequest)
  .then(result => {
    console.log('✅ ML Service works!');
    console.log('Recommendation:', result.recommendation);
    console.log('Confidence:', result.confidence);
    console.log('Probabilities:', result.mlInsights.probabilities);
  })
  .catch(error => {
    console.log('❌ ML Service error:', error.message);
  });
