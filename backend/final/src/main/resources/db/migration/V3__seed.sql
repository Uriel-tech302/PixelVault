-- PixelVault - V3: datos iniciales (roles, plataformas, generos y catalogo de ejemplo)
-- Los usuarios de prueba (admin, moderador, usuario) se crean desde Java con BCrypt.

INSERT INTO roles (nombre, descripcion) VALUES
    ('ADMIN',     'Administra el catalogo, los usuarios y las resenas'),
    ('MODERADOR', 'Modera las resenas'),
    ('USUARIO',   'Usuario con biblioteca y resenas propias');

INSERT INTO plataformas (nombre) VALUES
    ('PC'), ('PlayStation 5'), ('Xbox Series X/S'), ('Nintendo Switch'), ('Steam Deck');

INSERT INTO generos (nombre) VALUES
    ('Metroidvania'), ('Roguelike'), ('Plataformas'), ('Simulador de granja'),
    ('RPG'), ('Accion'), ('Aventura'), ('Puzle'), ('Cartas'), ('Indie');

-- Portadas desde la CDN de Steam (mismo patron que usa el frontend)
INSERT INTO juegos (titulo, anio_lanzamiento, desarrollador, steam_app_id, portada_url) VALUES
    ('Hollow Knight',          2017, 'Team Cherry',          367520,  'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg'),
    ('Stardew Valley',         2016, 'ConcernedApe',         413150,  'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg'),
    ('Hades',                  2020, 'Supergiant Games',     1145360, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg'),
    ('Celeste',                2018, 'Maddy Makes Games',    504230,  'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg'),
    ('Dead Cells',             2018, 'Motion Twin',          588650,  'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_600x900.jpg'),
    ('Terraria',               2011, 'Re-Logic',             105600,  'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/library_600x900.jpg'),
    ('Undertale',              2015, 'Toby Fox',             391540,  'https://cdn.cloudflare.steamstatic.com/steam/apps/391540/library_600x900.jpg'),
    ('Cuphead',                2017, 'Studio MDHR',          268910,  'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/library_600x900.jpg'),
    ('Portal 2',               2011, 'Valve',                620,     'https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg'),
    ('Elden Ring',             2022, 'FromSoftware',         1245620, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg'),
    ('Baldur''s Gate 3',       2023, 'Larian Studios',       1086940, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg'),
    ('The Witcher 3: Wild Hunt', 2015, 'CD PROJEKT RED',     292030,  'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg'),
    ('Disco Elysium',          2019, 'ZA/UM',                632470,  'https://cdn.cloudflare.steamstatic.com/steam/apps/632470/library_600x900.jpg'),
    ('Slay the Spire',         2019, 'Mega Crit',            646570,  'https://cdn.cloudflare.steamstatic.com/steam/apps/646570/library_600x900.jpg'),
    ('Outer Wilds',            2019, 'Mobius Digital',       753640,  'https://cdn.cloudflare.steamstatic.com/steam/apps/753640/library_600x900.jpg');

-- Generos por juego (se enlazan por steam_app_id y nombre de genero)
INSERT INTO juego_genero (juego_id, genero_id)
SELECT j.id, g.id
FROM juegos j
JOIN generos g
WHERE (j.steam_app_id, g.nombre) IN (
    (367520,  'Metroidvania'), (367520,  'Indie'),
    (413150,  'Simulador de granja'), (413150, 'Indie'),
    (1145360, 'Roguelike'), (1145360, 'Accion'),
    (504230,  'Plataformas'), (504230, 'Indie'),
    (588650,  'Roguelike'), (588650,  'Metroidvania'),
    (105600,  'Aventura'), (105600, 'Indie'),
    (391540,  'RPG'), (391540, 'Indie'),
    (268910,  'Plataformas'), (268910, 'Accion'),
    (620,     'Puzle'), (620, 'Aventura'),
    (1245620, 'RPG'), (1245620, 'Accion'),
    (1086940, 'RPG'),
    (292030,  'RPG'), (292030, 'Aventura'),
    (632470,  'RPG'), (632470, 'Indie'),
    (646570,  'Roguelike'), (646570, 'Cartas'),
    (753640,  'Aventura'), (753640, 'Puzle')
);
