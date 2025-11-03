-- Database: schulden
-- Kosten-Baten Analyse voor Kleine Schulden

-- Drop tables if they exist (for clean recreate)
DROP TABLE IF EXISTS analysis_results CASCADE;
DROP TABLE IF EXISTS debts CASCADE;
DROP TABLE IF EXISTS citizens CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Organizations table (creditors)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- CAK, DUO, CJIB, Gemeente, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Citizens table
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    bsn VARCHAR(9) UNIQUE NOT NULL,
    age INTEGER,
    has_children BOOLEAN DEFAULT false,
    number_of_children INTEGER DEFAULT 0,
    income_source VARCHAR(50), -- employment, benefit_social, benefit_unemployment, pension, etc.
    monthly_income DECIMAL(10,2),
    in_debt_assistance BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Debts table
CREATE TABLE debts (
    id SERIAL PRIMARY KEY,
    citizen_id INTEGER REFERENCES citizens(id) ON DELETE CASCADE,
    organization_id INTEGER REFERENCES organizations(id),
    amount DECIMAL(10,2) NOT NULL,
    debt_type VARCHAR(50) NOT NULL, -- cak_eigen_bijdrage, parkeerboete, studiefinanciering, etc.
    origin_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- open, in_collection, paid, forgiven, payment_plan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Analysis results table
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    debt_id INTEGER REFERENCES debts(id) ON DELETE CASCADE,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Financial analysis
    collection_costs_total DECIMAL(10,2),
    success_probability DECIMAL(5,4), -- 0.0000 to 1.0000
    expected_revenue DECIMAL(10,2),
    net_result DECIMAL(10,2),
    cost_to_debt_ratio DECIMAL(10,2),

    -- Societal impact
    risk_score INTEGER, -- 0-100
    societal_costs_total DECIMAL(10,2),
    healthcare_costs DECIMAL(10,2),
    employment_costs DECIMAL(10,2),
    debt_assistance_costs DECIMAL(10,2),
    domestic_violence_costs DECIMAL(10,2),
    legal_costs DECIMAL(10,2),

    -- Recommendation
    recommended_action VARCHAR(50), -- forgive, payment_plan, consolidate, collect_standard, refer_to_assistance
    confidence INTEGER, -- 0-100
    reasoning TEXT[],

    -- Savings
    estimated_direct_savings DECIMAL(10,2),
    estimated_societal_savings DECIMAL(10,2),
    estimated_total_savings DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_debts_citizen ON debts(citizen_id);
CREATE INDEX idx_debts_organization ON debts(organization_id);
CREATE INDEX idx_debts_status ON debts(status);
CREATE INDEX idx_debts_amount ON debts(amount);
CREATE INDEX idx_analysis_debt ON analysis_results(debt_id);
CREATE INDEX idx_analysis_recommendation ON analysis_results(recommended_action);
CREATE INDEX idx_citizens_bsn ON citizens(bsn);

-- Comments for documentation
COMMENT ON TABLE organizations IS 'Creditor organizations like CAK, DUO, CJIB, municipalities';
COMMENT ON TABLE citizens IS 'Citizen profiles for debt analysis';
COMMENT ON TABLE debts IS 'Individual debts with amounts and types';
COMMENT ON TABLE analysis_results IS 'Cost-benefit analysis results per debt';

COMMENT ON COLUMN analysis_results.risk_score IS 'Risk of escalation (0-100): higher = more vulnerable';
COMMENT ON COLUMN analysis_results.recommended_action IS 'Smart collection recommendation based on analysis';
COMMENT ON COLUMN analysis_results.estimated_total_savings IS 'Total savings (direct + societal) from recommendation';
