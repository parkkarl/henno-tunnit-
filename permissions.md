# Õiguste haldus

## Ülevaade

Fail `permissions.sql` sisaldab MariaDB/MySQL süntaksis õiguste halduse näiteid arvutiklasside broneerimise andmebaasi jaoks.

## Kasutajad ja rollid

| Kasutaja | Roll | Õigused |
|----------|------|---------|
| `admin` | Administraator | Täielik ligipääs (CRUD kõikidele tabelitele) |
| `viewer` | Vaataja | Ainult SELECT (lugemisõigus) |

## Mida demonstreeritakse

1. **CREATE USER** — kahe kasutaja loomine (admin, viewer)
2. **GRANT ALL** — administraatorile täisõiguste andmine
3. **GRANT SELECT** — vaatajale ainult lugemisõiguse andmine
4. **SHOW GRANTS** — õiguste kontrollimine
5. **REVOKE** — õiguse äravõtmine (viewer kaotab booking tabeli lugemisõiguse)

## SQLite ja õigused

SQLite ei toeta `GRANT`/`REVOKE` käske, kuna see on serverita andmebaas (fail kettal). SQLite puhul lahendatakse õiguste haldus **rakenduse tasemel**:

- Autentimine ja autoriseerimine toimub veebirakenduses (nt Hono middleware)
- Failisüsteemi õigused kontrollivad, kes saab andmebaasifailile ligi
- Tootmiskeskkonnas kasutataks MariaDB/PostgreSQL serverit, kus GRANT/REVOKE töötavad

Seetõttu on `permissions.sql` kirjutatud MariaDB süntaksis kui **demofail**, mis näitab, kuidas õiguste haldus päris andmebaasiserveris välja näeks.
