-- Views and useful queries for CBS data analysis

-- View: Latest statistics (2024-01)
CREATE OR REPLACE VIEW v_latest_stats AS
SELECT
    'Totaal huishoudens met schulden' as metric,
    schuldenaren as value,
    aandeel_schuldenaren || '%' as percentage
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
UNION ALL
SELECT
    'Huishoudens zonder schulden',
    niet_schuldenaren,
    (100 - aandeel_schuldenaren) || '%'
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
UNION ALL
SELECT
    'Nieuwe instromers (2024)',
    schuldenaren,
    aandeel_schuldenaren || '%'
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Instromers';

-- View: Top schuldbronnen 2024
CREATE OR REPLACE VIEW v_top_schuldbronnen_2024 AS
SELECT
    ROW_NUMBER() OVER (ORDER BY aantal DESC) as rank,
    bron_label,
    aantal,
    percentage,
    ROUND((aantal::DECIMAL / 747560) * 100, 1) as pct_van_totaal
FROM cbs_schuldregistraties
WHERE jaar = '2024-01'
ORDER BY aantal DESC;

-- View: Trend schuldenaren over tijd
CREATE OR REPLACE VIEW v_trend_schuldenaren AS
SELECT
    jaar,
    schuldenaren,
    aandeel_schuldenaren,
    LAG(schuldenaren) OVER (ORDER BY jaar) as vorig_jaar,
    schuldenaren - LAG(schuldenaren) OVER (ORDER BY jaar) as verschil,
    ROUND(
        ((schuldenaren::DECIMAL - LAG(schuldenaren) OVER (ORDER BY jaar)) /
         NULLIF(LAG(schuldenaren) OVER (ORDER BY jaar), 0)) * 100,
        1
    ) as groei_percentage
FROM cbs_ontwikkeling
WHERE groep = 'Totaal huishoudens'
ORDER BY jaar;

-- View: Schulden per aantal bronnen (2024)
CREATE OR REPLACE VIEW v_meerdere_bronnen_2024 AS
SELECT
    aantal_bronnen,
    aantal,
    percentage,
    CASE
        WHEN aantal_bronnen = '1 bron' THEN 'Laag risico'
        WHEN aantal_bronnen IN ('2 bronnen', '3 bronnen') THEN 'Gemiddeld risico'
        WHEN aantal_bronnen IN ('4 bronnen', '5 bronnen') THEN 'Hoog risico'
        ELSE 'Zeer hoog risico'
    END as risico_categorie
FROM cbs_aantal_registraties
WHERE jaar = '2024-01'
ORDER BY
    CASE
        WHEN aantal_bronnen LIKE '%10%' THEN 10
        WHEN aantal_bronnen LIKE '%9%' THEN 9
        WHEN aantal_bronnen LIKE '%8%' THEN 8
        WHEN aantal_bronnen LIKE '%7%' THEN 7
        WHEN aantal_bronnen LIKE '%6%' THEN 6
        WHEN aantal_bronnen LIKE '%5%' THEN 5
        WHEN aantal_bronnen LIKE '%4%' THEN 4
        WHEN aantal_bronnen LIKE '%3%' THEN 3
        WHEN aantal_bronnen LIKE '%2%' THEN 2
        ELSE 1
    END;

-- Useful queries

-- 1. Totaal overzicht 2024
SELECT
    'Totaal huishoudens met schulden' as metric,
    TO_CHAR(schuldenaren, 'FM999,999') as waarde
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
UNION ALL
SELECT
    'Percentage van alle huishoudens',
    aandeel_schuldenaren || '%'
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
UNION ALL
SELECT
    'Nieuwe instromers in 2024',
    TO_CHAR(schuldenaren, 'FM999,999')
FROM cbs_ontwikkeling
WHERE jaar = '2024-01' AND groep = 'Instromers';

-- 2. Top 5 schuldbronnen
SELECT
    bron_label,
    TO_CHAR(aantal, 'FM999,999') as aantal_huishoudens,
    percentage || '%' as percentage
FROM cbs_schuldregistraties
WHERE jaar = '2024-01'
ORDER BY aantal DESC
LIMIT 5;

-- 3. Groei schuldenaren 2015-2024
SELECT
    jaar,
    TO_CHAR(schuldenaren, 'FM999,999') as schuldenaren,
    aandeel_schuldenaren || '%' as percentage
FROM cbs_ontwikkeling
WHERE groep = 'Totaal huishoudens' AND jaar NOT LIKE '%-%'
ORDER BY jaar;

-- 4. Huishoudens met meerdere schulden (hoog risico)
SELECT
    SUM(aantal) as totaal_meerdere_schulden,
    ROUND(SUM(percentage), 1) as percentage_van_totaal
FROM cbs_aantal_registraties
WHERE jaar = '2024-01'
  AND aantal_bronnen NOT IN ('1 bron', '2 bronnen');

-- 5. Vergelijking 2018 vs 2024
WITH stats AS (
    SELECT
        jaar,
        schuldenaren,
        aandeel_schuldenaren
    FROM cbs_ontwikkeling
    WHERE groep = 'Totaal huishoudens'
      AND jaar IN ('2018', '2024-01')
)
SELECT
    '2018' as jaar,
    TO_CHAR(MAX(CASE WHEN jaar = '2018' THEN schuldenaren END), 'FM999,999') as schuldenaren,
    MAX(CASE WHEN jaar = '2018' THEN aandeel_schuldenaren END) || '%' as percentage
FROM stats
UNION ALL
SELECT
    '2024',
    TO_CHAR(MAX(CASE WHEN jaar = '2024-01' THEN schuldenaren END), 'FM999,999'),
    MAX(CASE WHEN jaar = '2024-01' THEN aandeel_schuldenaren END) || '%'
FROM stats
UNION ALL
SELECT
    'Groei',
    TO_CHAR(
        MAX(CASE WHEN jaar = '2024-01' THEN schuldenaren END) -
        MAX(CASE WHEN jaar = '2018' THEN schuldenaren END),
        'FM999,999'
    ),
    ROUND(
        ((MAX(CASE WHEN jaar = '2024-01' THEN schuldenaren END)::DECIMAL -
          MAX(CASE WHEN jaar = '2018' THEN schuldenaren END)) /
         MAX(CASE WHEN jaar = '2018' THEN schuldenaren END)) * 100,
        1
    ) || '%'
FROM stats;

COMMENT ON VIEW v_latest_stats IS 'Meest recente statistieken (2024-01)';
COMMENT ON VIEW v_top_schuldbronnen_2024 IS 'Top schuldbronnen gerangschikt op aantal huishoudens';
COMMENT ON VIEW v_trend_schuldenaren IS 'Trend van aantal schuldenaren over tijd met groeipercentages';
COMMENT ON VIEW v_meerdere_bronnen_2024 IS 'Verdeling schulden over aantal bronnen met risico categorisering';
