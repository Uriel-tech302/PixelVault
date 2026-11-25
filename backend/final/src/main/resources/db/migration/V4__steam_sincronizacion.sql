-- PixelVault - V4: fecha de la ultima sincronizacion con Steam
ALTER TABLE usuarios
    ADD COLUMN steam_ultima_sincronizacion DATETIME NULL;
