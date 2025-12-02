-- CBS Kenmerken tabel: Gedetailleerde kenmerken van huishoudens met schulden per gemeente
DROP TABLE IF EXISTS cbs_kenmerken CASCADE;

CREATE TABLE cbs_kenmerken (
    id SERIAL PRIMARY KEY,
    jaar VARCHAR(10) NOT NULL,
    gemeentecode VARCHAR(10),
    gemeentenaam VARCHAR(100),
    groep VARCHAR(100),
    schuldenaren VARCHAR(100),
    kenmerken_cat VARCHAR(200),
    aantal DECIMAL(10,2),
    percentage DECIMAL(5,2),
    ondergrens_aantal DECIMAL(10,2),
    bovengrens_aantal DECIMAL(10,2),
    ondergrens_percentage DECIMAL(5,2),
    bovengrens_percentage DECIMAL(5,2),
    tooltip TEXT,
    thema VARCHAR(100),
    hoofdthema VARCHAR(100),
    label VARCHAR(200),
    niveau VARCHAR(50),
    voetnoot TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kenmerken_jaar ON cbs_kenmerken(jaar);
CREATE INDEX idx_kenmerken_gemeente ON cbs_kenmerken(gemeentecode);
CREATE INDEX idx_kenmerken_thema ON cbs_kenmerken(thema);
CREATE INDEX idx_kenmerken_hoofdthema ON cbs_kenmerken(hoofdthema);

COMMENT ON TABLE cbs_kenmerken IS 'CBS data over kenmerken van huishoudens met problematische schulden per gemeente';
COMMENT ON COLUMN cbs_kenmerken.kenmerken_cat IS 'Categorie van het kenmerk (bijv. GGZ-kosten, inkomen, leeftijd)';
COMMENT ON COLUMN cbs_kenmerken.thema IS 'Thema van het kenmerk (bijv. Zorg, Inkomen)';
COMMENT ON COLUMN cbs_kenmerken.hoofdthema IS 'Hoofdthema (bijv. Kwetsbare groepen, Sociaaleconomische positie)';
