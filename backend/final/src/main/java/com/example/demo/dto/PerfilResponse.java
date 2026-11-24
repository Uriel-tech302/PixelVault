package com.example.demo.dto;

public record PerfilResponse(
        Long id,
        String username,
        String email,
        String rol,
        String telefono,
        boolean telefonoVerificado,
        String avatarUrl,
        String steamId,
        String createdAt) {
}
