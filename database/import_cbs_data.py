#!/usr/bin/env python3
"""
Import CBS data into PostgreSQL database
Converts Dutch decimal format (comma) to standard format (dot)
"""

import csv
import psycopg2
from pathlib import Path

# Database connection
conn = psycopg2.connect(
    dbname="schulden",
    user="marc",
    host="localhost"
)
cur = conn.cursor()

def clean_decimal(value):
    """Convert Dutch decimal format to standard format"""
    if not value or value.strip() == '':
        return None
    return value.replace(',', '.')

def clean_int(value):
    """Convert to integer, handle empty strings"""
    if not value or value.strip() == '':
        return None
    return int(value)

# Import Ontwikkeling_NL.csv
print("Importing Ontwikkeling_NL.csv...")
with open('/Users/marc/Projecten/svb-cak/cbs-data/Ontwikkeling_NL.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    count = 0
    for row in reader:
        cur.execute("""
            INSERT INTO cbs_ontwikkeling
            (jaar, schuldenaren, aandeel_schuldenaren, niet_schuldenaren, groep)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            row['jaar'],
            clean_int(row['schuldenaren']),
            clean_decimal(row['aandeel_schuldenaren']),
            clean_int(row['nietschuldenaren']),
            row['Groep']
        ))
        count += 1
    print(f"  Imported {count} records")

# Import Aantal_schuldregistraties.csv
print("Importing Aantal_schuldregistraties.csv...")
with open('/Users/marc/Projecten/svb-cak/cbs-data/Aantal_schuldregistraties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    count = 0
    for row in reader:
        cur.execute("""
            INSERT INTO cbs_aantal_registraties
            (jaar, aantal_bronnen, aantal, percentage, groep)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            row['jaar'],
            row['aantalbron'],
            clean_int(row['Aantal']),
            clean_decimal(row['Percentage']),
            row['groep']
        ))
        count += 1
    print(f"  Imported {count} records")

# Import Schuldregistraties.csv
print("Importing Schuldregistraties.csv...")
with open('/Users/marc/Projecten/svb-cak/cbs-data/Schuldregistraties.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    count = 0
    for row in reader:
        cur.execute("""
            INSERT INTO cbs_schuldregistraties
            (jaar, bron_label, aantal, percentage, groep)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            row['jaar'],
            row['bronlabel'],
            clean_int(row['Aantal']),
            clean_decimal(row['Percentage']),
            row['groep']
        ))
        count += 1
    print(f"  Imported {count} records")

# Commit and close
conn.commit()

# Show summary
print("\nDatabase summary:")
cur.execute("""
    SELECT 'cbs_ontwikkeling' as table_name, COUNT(*) as records FROM cbs_ontwikkeling
    UNION ALL
    SELECT 'cbs_aantal_registraties', COUNT(*) FROM cbs_aantal_registraties
    UNION ALL
    SELECT 'cbs_schuldregistraties', COUNT(*) FROM cbs_schuldregistraties
""")
for row in cur.fetchall():
    print(f"  {row[0]}: {row[1]} records")

# Show latest statistics
print("\nLatest statistics (2024-01):")
cur.execute("""
    SELECT
        schuldenaren,
        aandeel_schuldenaren,
        niet_schuldenaren
    FROM cbs_ontwikkeling
    WHERE jaar = '2024-01' AND groep = 'Totaal huishoudens'
""")
row = cur.fetchone()
if row:
    print(f"  Schuldenaren: {row[0]:,}")
    print(f"  Aandeel: {row[1]}%")
    print(f"  Niet-schuldenaren: {row[2]:,}")

cur.close()
conn.close()

print("\n✅ CBS data successfully imported!")
