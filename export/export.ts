import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "..", "database.db");
const db = new Database(DB_PATH, { readonly: true });

// --- CSV export: bookings summary by month ---
console.log("Exporting bookings summary CSV...");

const summary = db
  .query(
    `SELECT substr(b.date, 1, 7) as month,
            c.name as classroom,
            COUNT(b.id) as bookings,
            ROUND(SUM(
              (CAST(substr(b.end_time,1,2) AS REAL) + CAST(substr(b.end_time,4,2) AS REAL)/60)
              - (CAST(substr(b.start_time,1,2) AS REAL) + CAST(substr(b.start_time,4,2) AS REAL)/60)
            ), 1) as total_hours
     FROM booking b
     JOIN classroom c ON b.classroom_id = c.id
     GROUP BY month, c.id
     ORDER BY month, classroom`
  )
  .all() as any[];

let csv = "month,classroom,bookings,total_hours\n";
for (const row of summary) {
  csv += `${row.month},${row.classroom},${row.bookings},${row.total_hours}\n`;
}

await Bun.write(join(import.meta.dir, "bookings_summary.csv"), csv);
console.log(`  bookings_summary.csv written (${summary.length} rows).`);

// --- JSON export: top 5 most used classrooms ---
console.log("Exporting top 5 classrooms JSON...");

const top5 = db
  .query(
    `SELECT c.name as classroom, c.building, c.room_number,
            COUNT(b.id) as total_bookings,
            ROUND(SUM(
              (CAST(substr(b.end_time,1,2) AS REAL) + CAST(substr(b.end_time,4,2) AS REAL)/60)
              - (CAST(substr(b.start_time,1,2) AS REAL) + CAST(substr(b.start_time,4,2) AS REAL)/60)
            ), 1) as total_hours
     FROM classroom c
     LEFT JOIN booking b ON c.id = b.classroom_id
     GROUP BY c.id
     ORDER BY total_bookings DESC
     LIMIT 5`
  )
  .all();

await Bun.write(join(import.meta.dir, "top5_classes.json"), JSON.stringify(top5, null, 2));
console.log(`  top5_classes.json written.`);

console.log("Export complete!");
