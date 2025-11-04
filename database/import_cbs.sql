\copy cbs_ontwikkeling(jaar, schuldenaren, aandeel_schuldenaren, niet_schuldenaren, groep) FROM '../cbs-data/Ontwikkeling_NL_fixed.csv' WITH (FORMAT csv, DELIMITER ';', HEADER true, QUOTE '"');

\copy cbs_schuldregistraties(jaar, bron_label, aantal, percentage, groep) FROM '../cbs-data/Schuldregistraties_fixed.csv' WITH (FORMAT csv, DELIMITER ';', HEADER true, QUOTE '"');

\copy cbs_aantal_registraties(jaar, aantal_bronnen, aantal, percentage, groep) FROM '../cbs-data/Aantal_schuldregistraties_fixed.csv' WITH (FORMAT csv, DELIMITER ';', HEADER true, QUOTE '"');
