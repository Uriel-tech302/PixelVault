package com.example.demo.dto;

public record SteamSincronizacionResponse(
        int importados,
        int actualizados,
        int omitidos,
        int totalSteam,
        String sincronizadoEn) {
}
