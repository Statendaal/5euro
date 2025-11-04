/**
 * CBS Data Service
 * Provides access to real CBS (Centraal Bureau voor de Statistiek) data
 */

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "schulden",
  user: process.env.DB_USER || "marc",
  password: process.env.DB_PASSWORD || "",
});

export interface CBSStatistic {
  thema: string;
  label: string;
  percentage: number;
  aantal: number;
  gemeentenaam?: string;
}

export interface CBSThemaOverview {
  thema: string;
  totalRecords: number;
  avgPercentage: number;
  topLabels: Array<{
    label: string;
    percentage: number;
  }>;
}

/**
 * Get overview statistics per thema
 */
export async function getCBSOverview(
  jaar: string = "2024-01",
): Promise<CBSThemaOverview[]> {
  const query = `
    SELECT
      thema,
      COUNT(*) as total_records,
      AVG(percentage) as avg_percentage
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND percentage IS NOT NULL
    GROUP BY thema
    ORDER BY avg_percentage DESC
  `;

  const result = await pool.query(query, [jaar]);

  const overviews: CBSThemaOverview[] = [];

  for (const row of result.rows) {
    // Get top labels for this thema
    const topLabelsQuery = `
      SELECT label, AVG(percentage) as avg_pct
      FROM cbs_kenmerken
      WHERE jaar = $1
        AND thema = $2
        AND schuldenaren LIKE '%Met geregistreerde%'
        AND percentage IS NOT NULL
      GROUP BY label
      ORDER BY avg_pct DESC
      LIMIT 5
    `;

    const topLabelsResult = await pool.query(topLabelsQuery, [jaar, row.thema]);

    overviews.push({
      thema: row.thema,
      totalRecords: parseInt(row.total_records),
      avgPercentage: parseFloat(row.avg_percentage),
      topLabels: topLabelsResult.rows.map((r) => ({
        label: r.label,
        percentage: parseFloat(r.avg_pct),
      })),
    });
  }

  return overviews;
}

/**
 * Get vulnerable groups statistics
 */
export async function getVulnerableGroups(
  jaar: string = "2024-01",
): Promise<CBSStatistic[]> {
  const query = `
    SELECT
      thema,
      label,
      kenmerken_cat,
      percentage,
      aantal
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND hoofdthema = 'Kwetsbare groepen'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND kenmerken_cat LIKE '0 %'
      AND percentage IS NOT NULL
    ORDER BY percentage DESC
    LIMIT 20
  `;

  const result = await pool.query(query, [jaar]);

  return result.rows.map((row) => ({
    thema: row.thema,
    label: row.label,
    percentage: parseFloat(row.percentage),
    aantal: parseInt(row.aantal),
  }));
}

/**
 * Get income and benefit statistics
 */
export async function getIncomeStatistics(jaar: string = "2024-01"): Promise<{
  lowIncome: number;
  benefits: Array<{ type: string; percentage: number }>;
  averageIncome: { label: string; percentage: number }[];
}> {
  // Low income percentage - use Nederland total only, filter for "heeft laag inkomen"
  const lowIncomeQuery = `
    SELECT percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND label = 'Laag huishoudinkomen'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND kenmerken_cat = '0 Laag huishoudinkomen'
      AND percentage IS NOT NULL
    LIMIT 1
  `;

  const lowIncomeResult = await pool.query(lowIncomeQuery, [jaar]);

  // Benefits breakdown - use Nederland total only, filter for "heeft uitkering" (kenmerken_cat = '0')
  const benefitsQuery = `
    SELECT
      label,
      percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND thema = 'Sociale zekerheid'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND kenmerken_cat LIKE '0 %'
      AND percentage IS NOT NULL
      AND (label LIKE '%uitkering%' OR label LIKE '%Bijstand%')
    ORDER BY percentage DESC
  `;

  const benefitsResult = await pool.query(benefitsQuery, [jaar]);

  // Income distribution - use Nederland total only
  const incomeDistQuery = `
    SELECT
      label,
      kenmerken_cat,
      percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND label LIKE '%inkomen%'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND percentage IS NOT NULL
    ORDER BY percentage DESC
    LIMIT 10
  `;

  const incomeDistResult = await pool.query(incomeDistQuery, [jaar]);

  return {
    lowIncome: lowIncomeResult.rows[0]
      ? parseFloat(lowIncomeResult.rows[0].avg_pct)
      : 0,
    benefits: benefitsResult.rows.map((r) => ({
      type: r.label,
      percentage: parseFloat(r.avg_pct),
    })),
    averageIncome: incomeDistResult.rows.map((r) => ({
      label: r.label,
      percentage: parseFloat(r.avg_pct),
    })),
  };
}

/**
 * Get demographic statistics
 */
export async function getDemographics(jaar: string = "2024-01"): Promise<{
  age: Array<{ range: string; percentage: number }>;
  household: Array<{ type: string; percentage: number }>;
  origin: Array<{ category: string; percentage: number }>;
}> {
  // Age distribution - use Nederland only
  const ageQuery = `
    SELECT
      kenmerken_cat as age_range,
      percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND label = 'Leeftijd geselecteerd huishoudlid'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND percentage IS NOT NULL
    ORDER BY kenmerken_cat
  `;

  const ageResult = await pool.query(ageQuery, [jaar]);

  // Household types - use Nederland only
  const householdQuery = `
    SELECT
      kenmerken_cat as household_type,
      percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND label = 'Type huishouden'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND percentage IS NOT NULL
    ORDER BY percentage DESC
    LIMIT 10
  `;

  const householdResult = await pool.query(householdQuery, [jaar]);

  // Origin/migration background - use Nederland only
  const originQuery = `
    SELECT
      kenmerken_cat as origin,
      percentage as avg_pct
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND label LIKE '%Herkomst%'
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND percentage IS NOT NULL
    ORDER BY percentage DESC
    LIMIT 8
  `;

  const originResult = await pool.query(originQuery, [jaar]);

  return {
    age: ageResult.rows.map((r) => ({
      range: r.age_range,
      percentage: parseFloat(r.avg_pct),
    })),
    household: householdResult.rows.map((r) => ({
      type: r.household_type,
      percentage: parseFloat(r.avg_pct),
    })),
    origin: originResult.rows.map((r) => ({
      category: r.origin,
      percentage: parseFloat(r.avg_pct),
    })),
  };
}

/**
 * Get top municipalities with debt problems
 */
export async function getTopMunicipalities(
  jaar: string = "2024-01",
  limit: number = 10,
): Promise<
  Array<{
    gemeentenaam: string;
    avgPercentage: number;
    totalRecords: number;
  }>
> {
  // Use a consistent metric: "Geen WW-uitkering" which covers ~96.5% of all households with debts
  // This gives us the most accurate count of total households with debts per municipality
  const query = `
    SELECT
      gemeentenaam,
      aantal,
      percentage
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND label = 'WW-uitkering in huishouden'
      AND kenmerken_cat = '1 Geen WW-uitkering(en) in huishouden'
      AND aantal IS NOT NULL
      AND gemeentenaam != 'Nederland'
    ORDER BY aantal DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [jaar, limit]);

  return result.rows.map((row) => ({
    gemeentenaam: row.gemeentenaam,
    avgPercentage: parseFloat(row.percentage), // percentage of households with debts that have no WW
    totalRecords: parseInt(row.aantal), // total number of households with debts
  }));
}

/**
 * Get total number of people with registered debts
 */
export async function getTotalDebtors(
  jaar: string = "2024-01",
): Promise<number> {
  // Get the total from a record that represents 100% of households with debts
  // We use the maximum aantal for Nederland, which represents all households with debts
  const query = `
    SELECT aantal
    FROM cbs_kenmerken
    WHERE jaar = $1
      AND schuldenaren LIKE '%Met geregistreerde%'
      AND gemeentenaam = 'Nederland'
      AND aantal IS NOT NULL
    ORDER BY aantal DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [jaar]);
  return result.rows[0] ? parseInt(result.rows[0].aantal) : 0;
}

/**
 * Get comprehensive dashboard data
 */
export async function getDashboardData(jaar: string = "2024-01"): Promise<{
  overview: CBSThemaOverview[];
  vulnerableGroups: CBSStatistic[];
  income: any;
  demographics: any;
  topMunicipalities: any[];
  totalDebtors: number;
  year: string;
}> {
  const [
    overview,
    vulnerableGroups,
    income,
    demographics,
    topMunicipalities,
    totalDebtors,
  ] = await Promise.all([
    getCBSOverview(jaar),
    getVulnerableGroups(jaar),
    getIncomeStatistics(jaar),
    getDemographics(jaar),
    getTopMunicipalities(jaar),
    getTotalDebtors(jaar),
  ]);

  return {
    overview,
    vulnerableGroups,
    income,
    demographics,
    topMunicipalities,
    totalDebtors,
    year: jaar,
  };
}
