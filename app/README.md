# Arvutiklasside broneerimise rakendus

## Eeldused

- [Bun](https://bun.sh) (v1.0+)

## Käivitamine

```bash
cd app
bun install
bun run index.ts
```

Server käivitub aadressil: **http://localhost:3000**

## Andmete importimine

Enne kasutamist impordi näidisandmed:

```bash
cd import
bun run import.ts
```

## Funktsionaalsus

- **/** — broneeringute nimekiri (READ)
- **/bookings/new** — uue broneeringu lisamine (CREATE)
- **/bookings/:id/edit** — broneeringu muutmine (UPDATE)
- **/bookings/:id/delete** — broneeringu kustutamine (DELETE)
- **/stats** — statistikavaade (klasside kasutus tundides, tunnitüüpide jaotus)

## Ekraanipildid

### Broneeringute nimekiri
![Broneeringud](../screenshots/broneeringud.png)

### Uue broneeringu lisamine
![Uus broneering](../screenshots/uus_broneering.png)

### Statistikavaade
![Statistika](../screenshots/statistika.png)

## Andmebaas

SQLite andmebaas luuakse automaatselt faili `database.db` projekti juurkausta.
Skeem on defineeritud failis `schema.sql`.
