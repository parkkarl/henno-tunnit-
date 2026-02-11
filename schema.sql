-- Arvutiklasside broneerimise andmebaas
-- Genereeritud DBML mudelist

CREATE TABLE IF NOT EXISTS classroom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building TEXT NOT NULL,
    room_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    has_projector INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_or_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('teacher', 'group'))
);

CREATE TABLE IF NOT EXISTS lesson_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    lesson_type_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    participants INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (user_id) REFERENCES user_or_group(id),
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    CHECK (end_time > start_time),
    CHECK (participants >= 0)
);

-- Algandmed: tunnitüübid
INSERT OR IGNORE INTO lesson_type (name) VALUES ('lecture');
INSERT OR IGNORE INTO lesson_type (name) VALUES ('lab');
INSERT OR IGNORE INTO lesson_type (name) VALUES ('exam');
INSERT OR IGNORE INTO lesson_type (name) VALUES ('seminar');
