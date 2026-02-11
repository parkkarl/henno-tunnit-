import { Hono } from "hono";
import db from "./db";

const app = new Hono();

// --- Helpers ---

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Arvutiklassid</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #222; }
    h1 { margin-bottom: 0.5rem; }
    nav { margin-bottom: 1.5rem; }
    nav a { margin-right: 1rem; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ccc; padding: 0.4rem 0.6rem; text-align: left; }
    th { background: #f5f5f5; }
    form label { display: block; margin-top: 0.5rem; font-weight: 600; }
    form input, form select, form textarea { width: 100%; padding: 0.3rem; margin-top: 0.2rem; box-sizing: border-box; }
    form textarea { height: 60px; }
    button, .btn { padding: 0.4rem 1rem; margin-top: 0.8rem; cursor: pointer; }
    .btn-danger { background: #c00; color: #fff; border: none; }
    .actions { display: flex; gap: 0.5rem; }
  </style>
</head>
<body>
  <h1>Arvutiklasside broneerimine</h1>
  <nav>
    <a href="/">Broneeringud</a>
    <a href="/bookings/new">Lisa uus</a>
    <a href="/stats">Statistika</a>
  </nav>
  ${body}
</body>
</html>`;
}

// --- Routes ---

// List bookings
app.get("/", (c) => {
  const rows = db
    .query(
      `SELECT b.id, c.name as classroom, u.name as user_name, lt.name as lesson,
              b.date, b.start_time, b.end_time, b.participants, b.description
       FROM booking b
       JOIN classroom c ON b.classroom_id = c.id
       JOIN user_or_group u ON b.user_id = u.id
       JOIN lesson_type lt ON b.lesson_type_id = lt.id
       ORDER BY b.date DESC, b.start_time`
    )
    .all();

  const tableRows = rows.length
    ? rows
        .map(
          (r: any) => `<tr>
        <td>${r.date}</td>
        <td>${r.classroom}</td>
        <td>${r.user_name}</td>
        <td>${r.lesson}</td>
        <td>${r.start_time}–${r.end_time}</td>
        <td>${r.participants}</td>
        <td>${r.description || ""}</td>
        <td class="actions">
          <a href="/bookings/${r.id}/edit">Muuda</a>
          <form method="POST" action="/bookings/${r.id}/delete" style="margin:0">
            <button class="btn-danger" type="submit" onclick="return confirm('Kustuta?')">X</button>
          </form>
        </td>
      </tr>`
        )
        .join("")
    : '<tr><td colspan="8">Broneeringuid pole. <a href="/bookings/new">Lisa esimene!</a></td></tr>';

  return c.html(
    layout(
      "Broneeringud",
      `<table>
      <tr><th>Kuupäev</th><th>Klass</th><th>Kasutaja</th><th>Tüüp</th><th>Aeg</th><th>Osalised</th><th>Kirjeldus</th><th></th></tr>
      ${tableRows}
    </table>`
    )
  );
});

// New booking form
app.get("/bookings/new", (c) => {
  const classrooms = db.query("SELECT id, name FROM classroom ORDER BY name").all() as any[];
  const users = db.query("SELECT id, name, type FROM user_or_group ORDER BY name").all() as any[];
  const lessonTypes = db.query("SELECT id, name FROM lesson_type ORDER BY name").all() as any[];

  return c.html(
    layout(
      "Uus broneering",
      `<h2>Uus broneering</h2>
    <form method="POST" action="/bookings">
      <label>Klass
        <select name="classroom_id" required>
          <option value="">— vali —</option>
          ${classrooms.map((r) => `<option value="${r.id}">${r.name}</option>`).join("")}
        </select>
      </label>
      <label>Kasutaja
        <select name="user_id" required>
          <option value="">— vali —</option>
          ${users.map((r) => `<option value="${r.id}">${r.name} (${r.type})</option>`).join("")}
        </select>
      </label>
      <label>Tunnitüüp
        <select name="lesson_type_id" required>
          ${lessonTypes.map((r) => `<option value="${r.id}">${r.name}</option>`).join("")}
        </select>
      </label>
      <label>Kuupäev <input type="date" name="date" required></label>
      <label>Algusaeg <input type="time" name="start_time" required></label>
      <label>Lõpuaeg <input type="time" name="end_time" required></label>
      <label>Osalejate arv <input type="number" name="participants" min="0" value="0"></label>
      <label>Kirjeldus <textarea name="description"></textarea></label>
      <button type="submit">Salvesta</button>
    </form>`
    )
  );
});

// Create booking
app.post("/bookings", async (c) => {
  const body = await c.req.parseBody();
  try {
    db.query(
      `INSERT INTO booking (classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      body.classroom_id,
      body.user_id,
      body.lesson_type_id,
      body.date,
      body.start_time,
      body.end_time,
      Number(body.participants) || 0,
      body.description || null
    );
  } catch (e: any) {
    return c.html(layout("Viga", `<p style="color:red">Viga: ${e.message}</p><a href="/bookings/new">Tagasi</a>`));
  }
  return c.redirect("/");
});

// Edit booking form
app.get("/bookings/:id/edit", (c) => {
  const id = c.req.param("id");
  const booking = db.query("SELECT * FROM booking WHERE id = ?").get(id) as any;
  if (!booking) return c.html(layout("Ei leitud", "<p>Broneeringut ei leitud.</p>"), 404);

  const classrooms = db.query("SELECT id, name FROM classroom ORDER BY name").all() as any[];
  const users = db.query("SELECT id, name, type FROM user_or_group ORDER BY name").all() as any[];
  const lessonTypes = db.query("SELECT id, name FROM lesson_type ORDER BY name").all() as any[];

  return c.html(
    layout(
      "Muuda broneeringut",
      `<h2>Muuda broneeringut #${id}</h2>
    <form method="POST" action="/bookings/${id}">
      <label>Klass
        <select name="classroom_id" required>
          ${classrooms.map((r) => `<option value="${r.id}" ${r.id === booking.classroom_id ? "selected" : ""}>${r.name}</option>`).join("")}
        </select>
      </label>
      <label>Kasutaja
        <select name="user_id" required>
          ${users.map((r) => `<option value="${r.id}" ${r.id === booking.user_id ? "selected" : ""}>${r.name} (${r.type})</option>`).join("")}
        </select>
      </label>
      <label>Tunnitüüp
        <select name="lesson_type_id" required>
          ${lessonTypes.map((r) => `<option value="${r.id}" ${r.id === booking.lesson_type_id ? "selected" : ""}>${r.name}</option>`).join("")}
        </select>
      </label>
      <label>Kuupäev <input type="date" name="date" value="${booking.date}" required></label>
      <label>Algusaeg <input type="time" name="start_time" value="${booking.start_time}" required></label>
      <label>Lõpuaeg <input type="time" name="end_time" value="${booking.end_time}" required></label>
      <label>Osalejate arv <input type="number" name="participants" min="0" value="${booking.participants}"></label>
      <label>Kirjeldus <textarea name="description">${booking.description || ""}</textarea></label>
      <button type="submit">Salvesta</button>
    </form>`
    )
  );
});

// Update booking
app.post("/bookings/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  try {
    db.query(
      `UPDATE booking SET classroom_id=?, user_id=?, lesson_type_id=?, date=?, start_time=?, end_time=?, participants=?, description=?
       WHERE id=?`
    ).run(
      body.classroom_id,
      body.user_id,
      body.lesson_type_id,
      body.date,
      body.start_time,
      body.end_time,
      Number(body.participants) || 0,
      body.description || null,
      id
    );
  } catch (e: any) {
    return c.html(layout("Viga", `<p style="color:red">Viga: ${e.message}</p><a href="/bookings/${id}/edit">Tagasi</a>`));
  }
  return c.redirect("/");
});

// Delete booking
app.post("/bookings/:id/delete", (c) => {
  const id = c.req.param("id");
  db.query("DELETE FROM booking WHERE id = ?").run(id);
  return c.redirect("/");
});

// Stats page
app.get("/stats", (c) => {
  const stats = db
    .query(
      `SELECT c.name as classroom,
              COUNT(b.id) as total_bookings,
              ROUND(SUM(
                (CAST(substr(b.end_time,1,2) AS REAL) + CAST(substr(b.end_time,4,2) AS REAL)/60)
                - (CAST(substr(b.start_time,1,2) AS REAL) + CAST(substr(b.start_time,4,2) AS REAL)/60)
              ), 1) as total_hours
       FROM classroom c
       LEFT JOIN booking b ON c.id = b.classroom_id
       GROUP BY c.id
       ORDER BY total_hours DESC`
    )
    .all() as any[];

  const lessonStats = db
    .query(
      `SELECT lt.name as lesson, COUNT(b.id) as count
       FROM lesson_type lt
       LEFT JOIN booking b ON lt.id = b.lesson_type_id
       GROUP BY lt.id
       ORDER BY count DESC`
    )
    .all() as any[];

  return c.html(
    layout(
      "Statistika",
      `<h2>Klasside kasutus</h2>
    <table>
      <tr><th>Klass</th><th>Broneeringuid</th><th>Tunde kokku</th></tr>
      ${stats.map((r) => `<tr><td>${r.classroom}</td><td>${r.total_bookings}</td><td>${r.total_hours || 0}</td></tr>`).join("")}
    </table>
    <h2>Tunnitüüpide jaotus</h2>
    <table>
      <tr><th>Tüüp</th><th>Broneeringuid</th></tr>
      ${lessonStats.map((r) => `<tr><td>${r.lesson}</td><td>${r.count}</td></tr>`).join("")}
    </table>`
    )
  );
});

export default {
  port: 3000,
  fetch: app.fetch,
};

console.log("Server käivitatud: http://localhost:3000");
