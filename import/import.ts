import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "..", "database.db");
const db = new Database(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Init schema
const schema = await Bun.file(join(import.meta.dir, "..", "schema.sql")).text();
db.exec(schema);

// --- CSV: classes ---
console.log("Importing classes from CSV...");
const csvText = await Bun.file(join(import.meta.dir, "classes.csv")).text();
const csvLines = csvText.trim().split("\n").slice(1); // skip header

const insertClassroom = db.prepare(
  "INSERT OR IGNORE INTO classroom (name, building, room_number, capacity, has_projector) VALUES (?, ?, ?, ?, ?)"
);

for (const line of csvLines) {
  const [name, building, room_number, capacity, has_projector] = line.split(",");
  insertClassroom.run(name, building, room_number, Number(capacity), Number(has_projector));
}
console.log(`  ${csvLines.length} classrooms imported.`);

// --- JSON: teachers/groups ---
console.log("Importing users from JSON...");
const users = await Bun.file(join(import.meta.dir, "teachers.json")).json();

const insertUser = db.prepare(
  "INSERT OR IGNORE INTO user_or_group (name, email, type) VALUES (?, ?, ?)"
);

for (const u of users) {
  insertUser.run(u.name, u.email, u.type);
}
console.log(`  ${users.length} users imported.`);

// --- XML: bookings ---
console.log("Importing bookings from XML...");
const xmlText = await Bun.file(join(import.meta.dir, "bookings.xml")).text();

// Simple XML parsing with regex
const bookingBlocks = xmlText.match(/<booking>([\s\S]*?)<\/booking>/g) || [];

const insertBooking = db.prepare(
  `INSERT OR IGNORE INTO booking (classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

function xmlVal(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1].trim() : "";
}

for (const block of bookingBlocks) {
  insertBooking.run(
    Number(xmlVal(block, "classroom_id")),
    Number(xmlVal(block, "user_id")),
    Number(xmlVal(block, "lesson_type_id")),
    xmlVal(block, "date"),
    xmlVal(block, "start_time"),
    xmlVal(block, "end_time"),
    Number(xmlVal(block, "participants")),
    xmlVal(block, "description")
  );
}
console.log(`  ${bookingBlocks.length} bookings imported.`);

console.log("Import complete!");
