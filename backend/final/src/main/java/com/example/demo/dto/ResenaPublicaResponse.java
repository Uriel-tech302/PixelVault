package com.example.demo.dto;

public record ResenaPublicaResponse(
        Long id,
        String autor,
        String texto,
        boolean contieneSpoilers,
        Integer puntuacion,
        String plataforma,
        String fecha) {
}
