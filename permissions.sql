-- Arvutiklasside broneerimise andmebaasi õiguste haldus
-- MariaDB/MySQL süntaks (demo)

-- 1. Kasutajate loomine
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_parool_123';
CREATE USER 'viewer'@'localhost' IDENTIFIED BY 'viewer_parool_456';

-- 2. Administraatori õigused (täielik ligipääs)
GRANT ALL PRIVILEGES ON classroom_booking.* TO 'admin'@'localhost';

-- 3. Vaataja õigused (ainult lugemine)
GRANT SELECT ON classroom_booking.classroom TO 'viewer'@'localhost';
GRANT SELECT ON classroom_booking.user_or_group TO 'viewer'@'localhost';
GRANT SELECT ON classroom_booking.lesson_type TO 'viewer'@'localhost';
GRANT SELECT ON classroom_booking.booking TO 'viewer'@'localhost';

-- 4. Õiguste rakendamine
FLUSH PRIVILEGES;

-- 5. Õiguste kontrollimine
SHOW GRANTS FOR 'admin'@'localhost';
SHOW GRANTS FOR 'viewer'@'localhost';

-- 6. Õiguse äravõtmine (REVOKE näide)
-- Eemaldame viewer kasutajalt booking tabeli lugemisõiguse
REVOKE SELECT ON classroom_booking.booking FROM 'viewer'@'localhost';

-- 7. Kontrollime muudetud õigusi
SHOW GRANTS FOR 'viewer'@'localhost';

-- 8. Kasutajate kustutamine (vajadusel)
-- DROP USER 'admin'@'localhost';
-- DROP USER 'viewer'@'localhost';
