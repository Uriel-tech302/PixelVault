package com.example.demo.security;

import com.example.demo.repository.TokenRevocadoRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Borra cada noche los tokens revocados que ya vencieron (ya no hace falta recordarlos). */
@Component
public class TokenCleanupTask {

    private final TokenRevocadoRepository tokenRevocadoRepository;

    public TokenCleanupTask(TokenRevocadoRepository tokenRevocadoRepository) {
        this.tokenRevocadoRepository = tokenRevocadoRepository;
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void limpiar() {
        tokenRevocadoRepository.deleteByExpiraEnBefore(LocalDateTime.now(ZoneOffset.UTC));
    }
}
