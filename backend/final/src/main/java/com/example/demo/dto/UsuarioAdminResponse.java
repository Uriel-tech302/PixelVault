package com.example.demo.dto;

public record UsuarioAdminResponse(
        Long id,
        String username,
        String email,
        String rol,
        boolean activo,
        String estado,
        String createdAt) {
}
