package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.Map;

public record ResumenBibliotecaResponse(long totalJuegos, BigDecimal horasTotales,
                                        int porcentajeCompletado, Map<String, Long> porEstado) {
}
