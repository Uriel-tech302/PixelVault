package com.example.demo.dto;

import com.example.demo.model.EstadoJuego;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.math.BigDecimal;
import java.time.LocalDate;

public record BibliotecaCrearRequest(
        @NotNull(message = "El juego es obligatorio.")
        Long juegoId,

        @NotNull(message = "La plataforma es obligatoria.")
        Long plataformaId,
        EstadoJuego estado,


        @DecimalMin(value = "0.0", message = "Las horas no pueden ser negativas.")
        @Digits(integer = 6, fraction = 1, message = "Máximo 6 enteros y 1 decimal.")
        BigDecimal horasJugadas,

        @PastOrPresent(message = "La fecha no puede ser futura.")
        LocalDate ultimaSesion,

        @Min(value = 1, message = "La puntuación mínima es 1.")
        @Max(value = 5, message = "La puntuación máxima es 5.")
        Integer puntuacion) {
}
