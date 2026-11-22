package com.example.demo.security;

import java.time.Instant;

/** Usuario autenticado por JWT (es el "principal" de la peticion). */
public record UsuarioAutenticado(Long id, String email, String username, String rol,
                                 String jti, Instant tokenExpiraEn) {
}
