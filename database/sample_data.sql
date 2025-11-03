-- Sample data voor schulden database
-- Gebaseerd op de simulatie scenarios

-- Organizations
INSERT INTO organizations (name, type) VALUES
    ('CAK', 'Healthcare'),
    ('DUO', 'Education'),
    ('CJIB', 'Justice'),
    ('Gemeente Amsterdam', 'Municipality'),
    ('Belastingdienst', 'Tax'),
    ('Ziekenhuis', 'Healthcare'),
    ('Woningcorporatie', 'Housing');

-- Citizens (matching simulation scenarios)
INSERT INTO citizens (bsn, age, has_children, number_of_children, income_source, monthly_income, in_debt_assistance) VALUES
    ('123456789', 34, true, 2, 'benefit_social', 1200.00, false),
    ('234567890', 52, false, 0, 'benefit_unemployment', 1500.00, false),
    ('345678901', 41, true, 1, 'benefit_social', 1100.00, true),
    ('456789012', 28, false, 0, 'employment', 1400.00, false),
    ('567890123', 39, true, 2, 'employment', 2800.00, false),
    ('678901234', 45, false, 0, 'self_employed', 2200.00, false),
    ('789012345', 35, true, 1, 'employment', 3500.00, false),
    ('890123456', 42, false, 0, 'employment', 4200.00, false),
    ('901234567', 48, true, 2, 'employment', 6500.00, false),
    ('012345678', 68, false, 0, 'pension', 2200.00, false);

-- Debts (matching simulation scenarios)
INSERT INTO debts (citizen_id, organization_id, amount, debt_type, origin_date, due_date, status) VALUES
    -- Kwetsbare burgers
    (1, 1, 15.00, 'cak_eigen_bijdrage', '2024-06-01', '2024-07-01', 'open'),
    (2, 6, 45.00, 'zorgverzekering_premie', '2024-05-15', '2024-06-15', 'open'),
    (3, 3, 8.00, 'verkeersboete', '2024-07-10', '2024-08-10', 'open'),

    -- Financieel worstelen
    (4, 2, 25.00, 'studiefinanciering', '2024-04-20', '2024-05-20', 'open'),
    (5, 4, 120.00, 'afvalstoffenheffing', '2024-03-01', '2024-04-01', 'open'),
    (6, 4, 35.00, 'hondenbelasting', '2024-05-05', '2024-06-05', 'open'),

    -- Werkend - Stabiel
    (7, 4, 75.00, 'parkeerboete', '2024-06-15', '2024-07-15', 'open'),
    (8, 3, 150.00, 'verkeersboete', '2024-05-20', '2024-06-20', 'open'),

    -- Stabiel - Klein verzuim
    (9, 1, 12.00, 'cak_eigen_bijdrage', '2024-07-01', '2024-08-01', 'open'),
    (10, 4, 5.00, 'afvalstoffenheffing', '2024-06-10', '2024-07-10', 'open');

-- Analysis results (matching mock data from frontend)
INSERT INTO analysis_results (
    debt_id,
    collection_costs_total,
    success_probability,
    expected_revenue,
    net_result,
    cost_to_debt_ratio,
    risk_score,
    societal_costs_total,
    healthcare_costs,
    employment_costs,
    debt_assistance_costs,
    domestic_violence_costs,
    legal_costs,
    recommended_action,
    confidence,
    reasoning,
    estimated_direct_savings,
    estimated_societal_savings,
    estimated_total_savings
) VALUES
    -- Debt 1: Alleenstaande Ouder - Bijstand (€15)
    (1, 660.00, 0.1500, 2.25, -657.75, 44.00, 85, 13061.25, 1275.00, 3330.00, 5550.00, 1080.00, 1826.25,
     'forgive', 95,
     ARRAY['Burger heeft zeer hoog risicoprofiel voor escalatie (score: 85/100)',
           'Geschatte maatschappelijke kosten van €13,061 bij doorinnen',
           'Kwijtschelding kost slechts €5 en voorkomt verdere schade',
           'Alleenstaande ouder met 2 kinderen op bijstandsinkomen'],
     655.00, 13061.25, 13716.25),

    -- Debt 2: Werkzoekende - Zorgkosten (€45)
    (2, 660.00, 0.3500, 15.75, -644.25, 14.67, 70, 10785.00, 1050.00, 3052.50, 4320.00, 720.00, 1642.50,
     'forgive', 85,
     ARRAY['WW-uitkering is tijdelijk, kans op herstel aanwezig',
           'Maatschappelijke kosten (€10,785) zijn veel hoger dan schuld',
           'Kwijtschelding voorkomt escalatie en geeft ruimte voor werk zoeken'],
     655.00, 10785.00, 11440.00),

    -- Debt 3: In Schuldhulpverlening (€8)
    (3, 660.00, 0.0500, 0.40, -659.60, 82.50, 95, 15551.25, 1500.00, 3885.00, 6840.00, 1500.00, 1826.25,
     'forgive', 98,
     ARRAY['Burger is al in schuldhulpverlening - extra schulden verstoren traject',
           'Extreem hoog risicoprofiel (score: 95/100)',
           'Invoerkosten (€660) zijn 82x de schuld (€8)',
           'Maatschappelijke schade van €15,551 bij doorinnen'],
     655.00, 15551.25, 16206.25),

    -- Debt 4: Parttime Werker - DUO (€25)
    (4, 660.00, 0.4500, 11.25, -648.75, 26.40, 55, 6420.00, 825.00, 1665.00, 2160.00, 480.00, 1290.00,
     'payment_plan', 75,
     ARRAY['Parttime inkomen biedt kansen voor betalingsregeling',
           'Risico score middelmatig (55/100)',
           'Betalingsregeling van €10/maand is haalbaar'],
     620.00, 6420.00, 7040.00),

    -- Debt 5: Modaal Inkomen - Gemeente (€120)
    (5, 660.00, 0.6500, 78.00, -582.00, 5.50, 45, 4680.00, 675.00, 1215.00, 1440.00, 360.00, 990.00,
     'payment_plan', 80,
     ARRAY['Modaal inkomen geeft goede betalingscapaciteit',
           'Betalingsregeling voorkomt escalatie',
           'Risico score laag (45/100)'],
     620.00, 4680.00, 5300.00),

    -- Debt 6: ZZP''er - Hondenbelasting (€35)
    (6, 660.00, 0.5500, 19.25, -640.75, 18.86, 50, 3640.00, 525.00, 945.00, 1120.00, 300.00, 750.00,
     'payment_plan', 70,
     ARRAY['ZZP inkomen wisselend maar voldoende',
           'Betalingsregeling met flexibele termijnen',
           'Risico score gemiddeld (50/100)'],
     620.00, 3640.00, 4260.00),

    -- Debt 7: Fulltime - Parkeerboete (€75)
    (7, 660.00, 0.7500, 56.25, -603.75, 8.80, 25, 1950.00, 375.00, 585.00, 480.00, 150.00, 360.00,
     'collect_standard', 85,
     ARRAY['Goed inkomen en lage risico score (25/100)',
           'Waarschijnlijk vergeetachtigheid, niet onwil',
           'Standaard invordering met herinnering'],
     0.00, 1950.00, 1950.00),

    -- Debt 8: Werkend - Verkeersboete (€150)
    (8, 660.00, 0.8000, 120.00, -540.00, 4.40, 20, 1560.00, 300.00, 450.00, 360.00, 120.00, 330.00,
     'collect_standard', 90,
     ARRAY['Zeer goed inkomen en zeer lage risico score (20/100)',
           'Hoge slagingskans bij standaard invordering',
           'Verwachte opbrengst substantieel'],
     0.00, 1560.00, 1560.00),

    -- Debt 9: Hoog Inkomen - Admin fout (€12)
    (9, 660.00, 0.9000, 10.80, -649.20, 55.00, 15, 936.00, 180.00, 270.00, 216.00, 72.00, 198.00,
     'forgive', 60,
     ARRAY['Administratieve fout bij hoog inkomen',
           'Kwijtschelding voorkomt onnodige procedures',
           'Zeer lage risico score (15/100) maar onredelijk hoge kosten'],
     655.00, 936.00, 1591.00),

    -- Debt 10: Gepensioneerde - Klein bedrag (€5)
    (10, 660.00, 0.8500, 4.25, -655.75, 132.00, 10, 390.00, 75.00, 112.50, 90.00, 30.00, 82.50,
     'forgive', 70,
     ARRAY['Schuld van €5 met invoerkosten van €660 (132x)',
           'Gepensioneerde met stabiel inkomen',
           'Kwijtschelding is enige redelijke actie'],
     655.00, 390.00, 1045.00);

-- Verify data
SELECT
    'Organizations' as table_name,
    COUNT(*) as record_count
FROM organizations
UNION ALL
SELECT
    'Citizens',
    COUNT(*)
FROM citizens
UNION ALL
SELECT
    'Debts',
    COUNT(*)
FROM debts
UNION ALL
SELECT
    'Analysis Results',
    COUNT(*)
FROM analysis_results;
