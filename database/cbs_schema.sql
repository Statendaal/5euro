-- CBS Statistics Tables
-- Data over schuldenproblematiek in Nederland

-- Drop tables if exist
DROP TABLE IF EXISTS cbs_schuldregistraties CASCADE;
DROP TABLE IF EXISTS cbs_aantal_registraties CASCADE;
DROP TABLE IF EXISTS cbs_ontwikkeling CASCADE;

-- Table: Ontwikkeling schuldenaren in Nederland
CREATE TABLE cbs_ontwikkeling (
    id SERIAL PRIMARY KEY,
    jaar VARCHAR(10) NOT NULL,
    schuldenaren INTEGER,
    aandeel_schuldenaren DECIMAL(5,2),
    niet_schuldenaren INTEGER,
    groep VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Aantal schuldregistraties per aantal bronnen
CREATE TABLE cbs_aantal_registraties (
    id SERIAL PRIMARY KEY,
    jaar VARCHAR(10) NOT NULL,
    aantal_bronnen VARCHAR(50) NOT NULL,
    aantal INTEGER,
    percentage DECIMAL(5,2),
    groep VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Schuldregistraties per type/bron
CREATE TABLE cbs_schuldregistraties (
    id SERIAL PRIMARY KEY,
    jaar VARCHAR(10) NOT NULL,
    bron_label VARCHAR(200) NOT NULL,
    aantal INTEGER,
    percentage DECIMAL(5,2),
    groep VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ontwikkeling_jaar ON cbs_ontwikkeling(jaar);
CREATE INDEX idx_ontwikkeling_groep ON cbs_ontwikkeling(groep);
CREATE INDEX idx_aantal_jaar ON cbs_aantal_registraties(jaar);
CREATE INDEX idx_schuldregistraties_jaar ON cbs_schuldregistraties(jaar);
CREATE INDEX idx_schuldregistraties_bron ON cbs_schuldregistraties(bron_label);

-- Comments
COMMENT ON TABLE cbs_ontwikkeling IS 'CBS data: ontwikkeling aantal schuldenaren in Nederland (2015-2024)';
COMMENT ON TABLE cbs_aantal_registraties IS 'CBS data: aantal schuldregistraties per aantal bronnen';
COMMENT ON TABLE cbs_schuldregistraties IS 'CBS data: schuldregistraties per type/organisatie';

COMMENT ON COLUMN cbs_ontwikkeling.schuldenaren IS 'Aantal huishoudens met schulden';
COMMENT ON COLUMN cbs_ontwikkeling.aandeel_schuldenaren IS 'Percentage huishoudens met schulden';
COMMENT ON COLUMN cbs_aantal_registraties.aantal_bronnen IS 'Aantal verschillende bronnen waar schuld staat geregistreerd (1-10)';
COMMENT ON COLUMN cbs_schuldregistraties.bron_label IS 'Type schuld of organisatie (BKR, ZvW, Belastingdienst, etc.)';
