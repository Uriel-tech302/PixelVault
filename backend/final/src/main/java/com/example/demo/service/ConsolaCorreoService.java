package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnExpression("'${app.mail.host:}'.isEmpty()")
public class ConsolaCorreoService implements CorreoService {

    private static final Logger log = LoggerFactory.getLogger(ConsolaCorreoService.class);

    @Override
    public void enviarRecuperacion(String destinatario, String enlace) {
        log.info("[CORREO SIMULADO] Recuperacion de contrasena para {}: {}", destinatario, enlace);
    }
}
