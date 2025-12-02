import { CBSDashboardData } from '../components/CBSDashboard';

/**
 * Mock CBS data gebaseerd op echte CBS statistieken
 * Gebaseerd op: CBS Kenmerken van huishoudens met problematische schulden (2024-01)
 * 
 * Belangrijkste cijfers:
 * - 721.290 huishoudens met geregistreerde problematische schulden
 * - 88.7% heeft uitkering
 * - 75.6% is werkloos
 * - 62.6% heeft laag inkomen (<€1500)
 * - 68.4% heeft kleine schuld (<€100)
 * - 14.8% is eenouder
 * - 17.7% heeft jeugdzorg
 */
export const mockCBSDashboardData: CBSDashboardData = {
  totalDebtors: 721290,
  year: '2024-01',
  overview: [
    {
      thema: 'Uitkering',
      totalRecords: 640000,
      avgPercentage: 88.7,
      topLabels: [
        { label: 'Bijstand', percentage: 13.9 },
        { label: 'AOW', percentage: 16.8 },
        { label: 'WW', percentage: 3.5 },
        { label: 'WIA/WAO', percentage: 8.2 },
      ],
    },
    {
      thema: 'Werkloosheid',
      totalRecords: 545000,
      avgPercentage: 75.6,
      topLabels: [
        { label: 'Werkloos', percentage: 75.6 },
        { label: 'Werkzaam', percentage: 24.4 },
      ],
    },
    {
      thema: 'Inkomen',
      totalRecords: 451000,
      avgPercentage: 62.6,
      topLabels: [
        { label: 'Laag inkomen (<€1500)', percentage: 62.6 },
        { label: 'Middel inkomen (€1500-2500)', percentage: 28.3 },
        { label: 'Hoog inkomen (>€2500)', percentage: 9.1 },
      ],
    },
    {
      thema: 'Schuldomvang',
      totalRecords: 493000,
      avgPercentage: 68.4,
      topLabels: [
        { label: 'Kleine schuld (<€100)', percentage: 68.4 },
        { label: 'Middelgrote schuld (€100-500)', percentage: 24.2 },
        { label: 'Grote schuld (>€500)', percentage: 7.4 },
      ],
    },
    {
      thema: 'Eenoudergezin',
      totalRecords: 107000,
      avgPercentage: 14.8,
      topLabels: [
        { label: 'Eenouder', percentage: 14.8 },
        { label: 'Twee ouders', percentage: 85.2 },
      ],
    },
    {
      thema: 'Jeugdzorg',
      totalRecords: 128000,
      avgPercentage: 17.7,
      topLabels: [
        { label: 'Met jeugdzorg', percentage: 17.7 },
        { label: 'Zonder jeugdzorg', percentage: 82.3 },
      ],
    },
  ],
  vulnerableGroups: [
    { thema: 'Uitkering', label: 'Bijstand', percentage: 13.9, aantal: 100000 },
    { thema: 'Uitkering', label: 'AOW', percentage: 16.8, aantal: 121000 },
    { thema: 'Uitkering', label: 'WW', percentage: 3.5, aantal: 25000 },
    { thema: 'Werkloosheid', label: 'Werkloos', percentage: 75.6, aantal: 545000 },
    { thema: 'Inkomen', label: 'Laag inkomen', percentage: 62.6, aantal: 451000 },
    { thema: 'Eenoudergezin', label: 'Eenouder', percentage: 14.8, aantal: 107000 },
    { thema: 'Jeugdzorg', label: 'Met jeugdzorg', percentage: 17.7, aantal: 128000 },
  ],
  income: {
    lowIncome: 62.6,
    benefits: [
      { type: 'Bijstand', percentage: 13.9 },
      { type: 'AOW', percentage: 16.8 },
      { type: 'WW', percentage: 3.5 },
      { type: 'WIA/WAO', percentage: 8.2 },
      { type: 'Andere uitkering', percentage: 46.3 },
    ],
    averageIncome: [
      { label: '<€1000', percentage: 28.4 },
      { label: '€1000-1500', percentage: 34.2 },
      { label: '€1500-2000', percentage: 22.1 },
      { label: '€2000-2500', percentage: 10.2 },
      { label: '>€2500', percentage: 5.1 },
    ],
  },
  demographics: {
    age: [
      { range: '18-25', percentage: 12.3 },
      { range: '26-35', percentage: 24.7 },
      { range: '36-45', percentage: 28.9 },
      { range: '46-55', percentage: 18.4 },
      { range: '56-65', percentage: 10.2 },
      { range: '65+', percentage: 5.5 },
    ],
    household: [
      { type: 'Alleenstaand', percentage: 42.3 },
      { type: 'Eenoudergezin', percentage: 14.8 },
      { type: 'Twee ouders', percentage: 35.6 },
      { type: 'Anders', percentage: 7.3 },
    ],
    origin: [
      { category: 'Nederlandse achtergrond', percentage: 68.4 },
      { category: 'Westerse migratieachtergrond', percentage: 12.7 },
      { category: 'Niet-westerse migratieachtergrond', percentage: 18.9 },
    ],
  },
  topMunicipalities: [
    { gemeentenaam: 'Amsterdam', avgPercentage: 8.2, totalRecords: 59200 },
    { gemeentenaam: 'Rotterdam', avgPercentage: 7.8, totalRecords: 56300 },
    { gemeentenaam: 'Den Haag', avgPercentage: 6.9, totalRecords: 49800 },
    { gemeentenaam: 'Utrecht', avgPercentage: 5.4, totalRecords: 39000 },
    { gemeentenaam: 'Eindhoven', avgPercentage: 4.8, totalRecords: 34600 },
    { gemeentenaam: 'Groningen', avgPercentage: 4.2, totalRecords: 30300 },
    { gemeentenaam: 'Tilburg', avgPercentage: 3.9, totalRecords: 28100 },
    { gemeentenaam: 'Almere', avgPercentage: 3.7, totalRecords: 26700 },
    { gemeentenaam: 'Breda', avgPercentage: 3.5, totalRecords: 25200 },
    { gemeentenaam: 'Nijmegen', avgPercentage: 3.3, totalRecords: 23800 },
  ],
};

