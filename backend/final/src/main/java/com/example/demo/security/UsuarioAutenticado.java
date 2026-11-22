package com.example.demo.security;

import java.time.Instant;

public record UsuarioAutenticado(Long id, String email, String username, String rol,
                                 String jti, Instant tokenExpiraEn) {
}
