package com.example.demo.dto;

public record ResenaModeracionResponse(
        Long id,
        String texto,
        boolean contieneSpoilers,
        String visibilidad,
        boolean oculta,
        String motivoModeracion,
        String moderadaPor,
        String moderadaEn,
        String autor,
        Long juegoId,
        String juego,
        Integer puntuacion,
        String createdAt) {
}
