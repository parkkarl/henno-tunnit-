# Varundamine ja taastamine

## Eeldused

- Bun (v1.0+) on paigaldatud
- Andmebaas on olemas failis `database.db` (pärast importi)

## 1. Varundamine (backup)

Varukoopia loodi Bun skriptiga, mis ekspordib kõik tabelid SQL-lausetena:

```
backup/backup_2026-02-11.sql
```

Fail sisaldab `CREATE TABLE` ja `INSERT INTO` lauseid kõikide tabelite jaoks (classroom, user_or_group, lesson_type, booking).

Alternatiiv `sqlite3` tööriistaga:
```bash
sqlite3 database.db .dump > backup/backup_2026-02-11.sql
```

## 2. Taastamise test — tõendus

### ENNE kustutamist

```
Broneeringute arv: 10
Näidisread:
  1  2026-02-09  Arvutiklass A101  Mart Tamm
  2  2026-02-09  Arvutiklass B205  Liis Kask
  3  2026-02-09  Arvutiklass C110  Andres Paju
```

### Simuleeritud andmekadu

```sql
DROP TABLE booking;
```

Tulemus: `Error: no such table: booking`

### PÄRAST taastamist

Taastamine varukoopiast:
```bash
rm database.db
sqlite3 database.db < backup/backup_2026-02-11.sql
```

```
Broneeringute arv: 10
Näidisread:
  1  2026-02-09  Arvutiklass A101  Mart Tamm
  2  2026-02-09  Arvutiklass B205  Liis Kask
  3  2026-02-09  Arvutiklass C110  Andres Paju
```

### Kokkuvõte

| Samm | Tegevus | Tulemus |
|------|---------|---------|
| 1. Varunda | SQL dump failina | `backup_2026-02-11.sql` loodud |
| 2. Enne | `SELECT COUNT(*) FROM booking` | **10** broneeringut |
| 3. Kustuta | `DROP TABLE booking` | Tabel kadunud, `no such table` |
| 4. Taasta | `< backup_2026-02-11.sql` | Andmebaas taastatud |
| 5. Pärast | `SELECT COUNT(*) FROM booking` | **10** broneeringut tagasi |

Taastamine õnnestus — kõik andmed tulid varukoopiast tagasi.
