# Loogiline disain

## Tabelite valikud

Andmebaas koosneb 4 tabelist, mis katavad arvutiklasside broneerimise põhivajadused:

- **classroom** — arvutiklassid (nimi, hoone, ruuminumber, kohtade arv, projektori olemasolu)
- **user_or_group** — kasutajad, kes broneerivad (õpetajad või grupid, eristatavad `type` välja kaudu)
- **lesson_type** — tunnitüüp (loeng, labor, eksam, seminar) — eraldi tabel normaliseerimiseks
- **booking** — broneeringud, mis seovad klassi, kasutaja ja tunnitüübi konkreetse kuupäeva ja kellaajaga

## N:M seos

Klassiruum ja kasutaja vahel on mitu-mitmele (N:M) seos: üks kasutaja saab broneerida mitut klassi ja üht klassi saab broneerida mitu kasutajat. See on lahendatud **booking** vahetabeliga, mis sisaldab võõrvõtmeid mõlemale poolele (`classroom_id`, `user_id`).

## Ärireeglid (CHECK)

1. `CHECK (end_time > start_time)` — broneeringu lõpuaeg peab olema hiljem kui algusaeg
2. `CHECK (participants >= 0)` — osalejate arv ei tohi olla negatiivne
3. `CHECK (type IN ('teacher', 'group'))` — kasutaja tüüp saab olla ainult 'teacher' või 'group'
