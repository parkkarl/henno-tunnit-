PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE classroom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building TEXT NOT NULL,
    room_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    has_projector INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE user_or_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('teacher', 'group'))
);

CREATE TABLE lesson_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE booking (
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

INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (1, 'Arvutiklass A101', 'Peahoone', 'A101', 30, 1);
INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (2, 'Arvutiklass B205', 'Peahoone', 'B205', 24, 1);
INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (3, 'Arvutiklass C110', 'Kõrvalhoone', 'C110', 20, 0);
INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (4, 'Labor D301', 'Kõrvalhoone', 'D301', 16, 1);
INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (5, 'Arvutiklass E102', 'Peahoone', 'E102', 32, 1);
INSERT INTO classroom (id, name, building, room_number, capacity, has_projector) VALUES (6, 'Väike labor F201', 'Kõrvalhoone', 'F201', 12, 0);

INSERT INTO user_or_group (id, name, email, type) VALUES (1, 'Mart Tamm', 'mart.tamm@kool.ee', 'teacher');
INSERT INTO user_or_group (id, name, email, type) VALUES (2, 'Liis Kask', 'liis.kask@kool.ee', 'teacher');
INSERT INTO user_or_group (id, name, email, type) VALUES (3, 'Andres Paju', 'andres.paju@kool.ee', 'teacher');
INSERT INTO user_or_group (id, name, email, type) VALUES (4, 'TAK25', 'tak25@kool.ee', 'group');
INSERT INTO user_or_group (id, name, email, type) VALUES (5, 'TAK24', 'tak24@kool.ee', 'group');

INSERT INTO lesson_type (id, name) VALUES (1, 'lecture');
INSERT INTO lesson_type (id, name) VALUES (2, 'lab');
INSERT INTO lesson_type (id, name) VALUES (3, 'exam');
INSERT INTO lesson_type (id, name) VALUES (4, 'seminar');

INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (1, 1, 1, 1, '2026-02-09', '08:00', '09:30', 28, 'Programmeerimise loeng');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (2, 2, 2, 2, '2026-02-09', '10:00', '11:30', 20, 'Andmebaaside labor');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (3, 3, 3, 4, '2026-02-09', '12:00', '13:30', 18, 'Võrgutehnoloogia seminar');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (4, 4, 4, 2, '2026-02-10', '08:00', '10:00', 15, 'Riistvara labor');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (5, 1, 2, 1, '2026-02-10', '10:00', '11:30', 30, 'Veebiarenduse loeng');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (6, 5, 5, 3, '2026-02-10', '12:00', '14:00', 25, 'Programmeerimise eksam');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (7, 2, 1, 4, '2026-02-11', '08:00', '09:30', 22, 'IT-projektide seminar');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (8, 6, 3, 2, '2026-02-11', '10:00', '12:00', 10, 'Küberturbe labor');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (9, 1, 4, 1, '2026-02-11', '13:00', '14:30', 26, 'Operatsioonisüsteemide loeng');
INSERT INTO booking (id, classroom_id, user_id, lesson_type_id, date, start_time, end_time, participants, description) VALUES (10, 3, 5, 2, '2026-02-12', '08:00', '10:00', 16, 'Andmebaaside labor');

COMMIT;
