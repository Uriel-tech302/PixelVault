package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsolaCorreoService implements CorreoService {

    private static final Logger log = LoggerFactory.getLogger(ConsolaCorreoService.class);

    @Override
    public void enviarRecuperacion(String destinatario, String enlace) {
        log.info("[CORREO SIMULADO] Recuperación de contraseña para {}: {}", destinatario, enlace);
    }
}
