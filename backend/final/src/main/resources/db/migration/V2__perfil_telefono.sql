-- PixelVault - V2: telefono como metodo secundario de acceso

ALTER TABLE usuarios
    ADD COLUMN telefono_verificado BOOLEAN NOT NULL DEFAULT FALSE AFTER telefono;

-- Codigos de un solo uso enviados por SMS o WhatsApp
-- (verificar telefono, acceder con codigo, recuperar contrasena)
CREATE TABLE codigos_verificacion (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    usuario_id  BIGINT      NOT NULL,
    canal       VARCHAR(10) NOT NULL,
    proposito   VARCHAR(20) NOT NULL,
    codigo_hash CHAR(64)    NOT NULL,
    expira_en   DATETIME    NOT NULL,
    intentos    TINYINT     NOT NULL DEFAULT 0,
    usado       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT ck_cv_canal CHECK (canal IN ('SMS', 'WHATSAPP')),
    CONSTRAINT ck_cv_proposito CHECK (proposito IN ('VERIFICAR_TELEFONO', 'ACCESO', 'RECUPERACION')),
    CONSTRAINT fk_cv_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_cv_usuario_proposito ON codigos_verificacion (usuario_id, proposito, usado);
