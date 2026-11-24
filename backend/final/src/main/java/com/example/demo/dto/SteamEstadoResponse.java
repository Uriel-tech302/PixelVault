package com.example.demo.dto;

public record SteamEstadoResponse(
        boolean vinculado,
        String steamId,
        String nombrePerfil,
        String ultimaSincronizacion) {
}
