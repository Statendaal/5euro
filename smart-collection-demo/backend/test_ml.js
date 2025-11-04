const axios = require('axios');

async function testML() {
  try {
    console.log('Testing ML API connection...');
    const response = await axios.post('http://127.0.0.1:8000/predict', {
      debt_amount: 15,
      monthly_income: 1200,
      income_source: 'BENEFIT_SOCIAL',
      has_children: false,
      in_debt_assistance: false,
      other_debts_count: 3
    });
    console.log('✅ ML API works!');
    console.log('Recommendation:', response.data.recommendation);
    console.log('Confidence:', response.data.confidence);
  } catch (error) {
    console.log('❌ ML API error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testML();
