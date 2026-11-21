

-- Roles y usuarios

CREATE TABLE roles (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(30)  NOT NULL,
    descripcion VARCHAR(150) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuarios (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(30)  NOT NULL,
    email         VARCHAR(150) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    telefono      VARCHAR(20)  NULL,
    avatar_url    VARCHAR(255) NULL,
    steam_id      VARCHAR(20)  NULL,
    rol_id        BIGINT       NOT NULL,
    activo        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_email    UNIQUE (email),
    CONSTRAINT uq_usuarios_username UNIQUE (username),
    CONSTRAINT uq_usuarios_steam_id UNIQUE (steam_id),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Catalogo 

CREATE TABLE generos (
    id     BIGINT      NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_generos_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE plataformas (
    id     BIGINT      NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_plataformas_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE juegos (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    titulo           VARCHAR(150) NOT NULL,
    descripcion      TEXT         NULL,
    anio_lanzamiento SMALLINT     NULL,
    desarrollador    VARCHAR(100) NULL,
    portada_url      VARCHAR(255) NULL,
    steam_app_id     INT          NULL,
    creado_por       BIGINT       NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_juegos_steam_app_id UNIQUE (steam_app_id),
    CONSTRAINT fk_juegos_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_juegos_titulo ON juegos (titulo);

-- Relacion N:M juegos <-> generos
CREATE TABLE juego_genero (
    juego_id  BIGINT NOT NULL,
    genero_id BIGINT NOT NULL,
    PRIMARY KEY (juego_id, genero_id),
    CONSTRAINT fk_jg_juego  FOREIGN KEY (juego_id)  REFERENCES juegos (id)  ON DELETE CASCADE,
    CONSTRAINT fk_jg_genero FOREIGN KEY (genero_id) REFERENCES generos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Biblioteca personal

CREATE TABLE biblioteca_items (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    usuario_id    BIGINT       NOT NULL,
    juego_id      BIGINT       NOT NULL,
    plataforma_id BIGINT       NOT NULL,
    estado        VARCHAR(20)  NOT NULL DEFAULT 'JUGANDO',
    horas_jugadas DECIMAL(7,1) NOT NULL DEFAULT 0,
    ultima_sesion DATE         NULL,
    puntuacion    TINYINT      NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_biblioteca_usuario_juego_plataforma UNIQUE (usuario_id, juego_id, plataforma_id),
    CONSTRAINT ck_biblioteca_estado CHECK (estado IN ('JUGANDO', 'COMPLETADO', 'ABANDONADO')),
    CONSTRAINT ck_biblioteca_puntuacion CHECK (puntuacion IS NULL OR puntuacion BETWEEN 1 AND 5),
    CONSTRAINT ck_biblioteca_horas CHECK (horas_jugadas >= 0),
    CONSTRAINT fk_biblioteca_usuario    FOREIGN KEY (usuario_id)    REFERENCES usuarios (id)    ON DELETE CASCADE,
    CONSTRAINT fk_biblioteca_juego      FOREIGN KEY (juego_id)      REFERENCES juegos (id),
    CONSTRAINT fk_biblioteca_plataforma FOREIGN KEY (plataforma_id) REFERENCES plataformas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_biblioteca_usuario_estado ON biblioteca_items (usuario_id, estado);

CREATE TABLE resenas (
    id                 BIGINT        NOT NULL AUTO_INCREMENT,
    biblioteca_item_id BIGINT        NOT NULL,
    texto              VARCHAR(2000) NOT NULL,
    contiene_spoilers  BOOLEAN       NOT NULL DEFAULT FALSE,
    visibilidad        VARCHAR(10)   NOT NULL DEFAULT 'PRIVADA',
    oculta             BOOLEAN       NOT NULL DEFAULT FALSE,
    moderada_por       BIGINT        NULL,
    moderada_en        DATETIME      NULL,
    motivo_moderacion  VARCHAR(255)  NULL,
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_resenas_item UNIQUE (biblioteca_item_id),
    CONSTRAINT ck_resenas_visibilidad CHECK (visibilidad IN ('PRIVADA', 'PUBLICA')),
    CONSTRAINT fk_resenas_item FOREIGN KEY (biblioteca_item_id) REFERENCES biblioteca_items (id) ON DELETE CASCADE,
    CONSTRAINT fk_resenas_moderador FOREIGN KEY (moderada_por) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_resenas_publicas ON resenas (visibilidad, oculta);


-- Seguridad: recuperacion de contrasena y logout con invalidacion

CREATE TABLE password_reset_tokens (
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT   NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expira_en  DATETIME NOT NULL,
    usado      BOOLEAN  NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_prt_token_hash UNIQUE (token_hash),
    CONSTRAINT fk_prt_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tokens_revocados (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    jti          VARCHAR(40) NOT NULL,
    expira_en    DATETIME    NOT NULL,
    revocado_en  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_tokens_revocados_jti UNIQUE (jti)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tokens_revocados_expira ON tokens_revocados (expira_en);
