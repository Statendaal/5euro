# PostgreSQL 18 Upgrade - Voltooid

**Datum:** 9 november 2025  
**Van:** PostgreSQL 14.15  
**Naar:** PostgreSQL 18.0

## Uitgevoerde Stappen

### 1. Pre-upgrade
- ✅ Huidige versie geïdentificeerd: PostgreSQL 14.15 (Homebrew)
- ✅ Backup gemaakt: `database/backup_before_pg18_upgrade_20251109_084453.sql`
- ✅ Database connecties gereviewd in backend code

### 2. Installatie PostgreSQL 18
```bash
brew install postgresql@18
```

**Geïnstalleerde versie:** PostgreSQL 18.0 (Homebrew)  
**Locatie:** `/opt/homebrew/opt/postgresql@18`

### 3. Configuratie

**PATH update** (toegevoegd aan `~/.zshrc`):
```bash
export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"
```

**Data directory:** `/opt/homebrew/var/postgresql@18`

**Service management:**
```bash
# Start service
brew services start postgresql@18

# Stop service
brew services stop postgresql@18

# Restart service
brew services restart postgresql@18
```

### 4. Database Migratie

**Database aangemaakt:**
```bash
createdb schulden
```

**Schemas geïmporteerd:**
1. ✅ `schema.sql` - Hoofdschema (organizations, citizens, debts, analysis_results)
2. ✅ `sample_data.sql` - Sample data (10 debts)
3. ✅ `cbs_schema.sql` - CBS statistieken schema
4. ✅ `cbs_views.sql` - CBS views
5. ✅ `cbs_kenmerken_schema.sql` - CBS kenmerken schema

### 5. Verificatie

**Database status:**
```sql
-- Versie check
SELECT version();
-- PostgreSQL 18.0 (Postgres.app) on aarch64-apple-darwin23.6.0

-- Tabellen
\dt
-- 8 tables: analysis_results, cbs_aantal_registraties, cbs_kenmerken, 
--           cbs_ontwikkeling, cbs_schuldregistraties, citizens, debts, organizations

-- Data check
SELECT COUNT(*) FROM debts;
-- 10 debts, €490.00 totaal
```

**Backend connectie:**
- ✅ Node.js `pg` package (v8.16.3) werkt correct met PostgreSQL 18
- ✅ Connectie getest en succesvol
- ✅ Queries werken correct

## Database Configuratie

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `schulden`
- User: `marc`
- Connection string: `postgresql://localhost:5432/schulden`

## Backend Compatibility

De backend applicatie (`smart-collection-demo/backend`) is volledig compatibel:
- **Package:** `pg@8.16.3` - Ondersteunt PostgreSQL 18
- **TypeScript:** Geen wijzigingen nodig
- **Queries:** Alle bestaande queries werken zonder aanpassingen

## Belangrijke Verschillen PostgreSQL 14 → 18

PostgreSQL 18.0 bevat verbeteringen op gebied van:
- Performance optimalisaties
- JSON/JSONB verbeteringen
- Betere query planning
- Verbeterde replicatie
- Security updates

**Geen breaking changes** voor deze applicatie.

## Nuttige Commando's

```bash
# Check status
brew services list | grep postgresql

# Database connectie testen
psql -d schulden -c "SELECT version();"

# Alle tabellen tonen
psql -d schulden -c "\dt"

# Backup maken
pg_dump schulden > backup_$(date +%Y%m%d).sql

# Restore
psql schulden < backup_20251109.sql
```

## Oude PostgreSQL 14 Verwijderen (Optioneel)

Als PostgreSQL 18 goed werkt, kan PostgreSQL 14 verwijderd worden:

```bash
# Stop oude service
brew services stop postgresql@14

# Verwijder
brew uninstall postgresql@14

# Cleanup (optioneel - verwijdert data!)
rm -rf /opt/homebrew/var/postgresql@14
```

**⚠️ Waarschuwing:** Maak eerst een backup voordat je oude data verwijdert!

## Troubleshooting

### Probleem: `psql` gebruikt nog PostgreSQL 14
**Oplossing:**
```bash
# Open nieuwe terminal of reload shell
source ~/.zshrc

# Of gebruik volledige path
/opt/homebrew/opt/postgresql@18/bin/psql -d schulden
```

### Probleem: Backend kan niet verbinden
**Oplossing:**
1. Check of PostgreSQL 18 service draait: `brew services list`
2. Start service: `brew services start postgresql@18`
3. Test connectie: `psql -d schulden`

### Probleem: Database bestaat niet
**Oplossing:**
```bash
createdb schulden
cd /Users/marc/Projecten/svb-cak/database
psql -d schulden -f schema.sql
psql -d schulden -f sample_data.sql
```

## Database Statistieken

**Totale database:**
- Versie: PostgreSQL 18.0
- Totale grootte: 458 MB
- Aantal tabellen: 12 (8 data tables + 4 views)
- Totaal aantal records: 1,327,630

**Per tabel:**
| Tabel | Records | Grootte | Index Grootte |
|-------|---------|---------|---------------|
| cbs_kenmerken | 1,327,494 | 388 MB | 62 MB |
| debts | 10 | 8 KB | 80 KB |
| cbs_schuldregistraties | 94 | 16 KB | 72 KB |
| analysis_results | 10 | 8 KB | 56 KB |
| cbs_ontwikkeling | 25 | 8 KB | 48 KB |
| citizens | 10 | 8 KB | 48 KB |
| cbs_aantal_registraties | 84 | 8 KB | 32 KB |
| organizations | 7 | 8 KB | 16 KB |

**CBS Kenmerken data per jaar:**
- 2017: 2,848 records (356 gemeentes, 1 thema)
- 2018: 56,960 records (356 gemeentes, 7 themas)
- 2020-01: 173,728 records (356 gemeentes, 6 themas)
- 2020-10: 179,424 records (356 gemeentes, 6 themas)
- 2021-01: 177,912 records (353 gemeentes, 6 themas)
- 2021-10: 177,912 records (353 gemeentes, 6 themas)
- 2022-01: 193,760 records (346 gemeentes, 6 themas)
- 2023-01: 189,336 records (343 gemeentes, 6 themas)
- 2024-01: 175,614 records (343 gemeentes, 6 themas)

## Status: ✅ UPGRADE SUCCESVOL

Alle tests geslaagd. PostgreSQL 18 is operationeel en de applicatie werkt correct.

**✅ Alle 1,3+ miljoen CBS records succesvol geïmporteerd!**
