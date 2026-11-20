package com.example.demo.dto;

public record LoginResponse(String token, String tipo, String expiraEn, UsuarioResponse usuario) {
}
