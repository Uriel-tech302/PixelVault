package com.example.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record JuegoRequest(
        @NotBlank(message = "El título es obligatorio.")
        @Size(max = 150, message = "El título admite máximo 150 caracteres.")
        String titulo,

        @Size(max = 5000, message = "La descripción admite máximo 5000 caracteres.")
        String descripcion,

        @Min(value = 1950, message = "El año mínimo es 1950.")
        @Max(value = 2100, message = "El año máximo es 2100.")
        Integer anioLanzamiento,

        @Size(max = 100, message = "El desarrollador admite máximo 100 caracteres.")
        String desarrollador,

        @Size(max = 255, message = "La URL admite máximo 255 caracteres.")
        @Pattern(regexp = "^https?://\\S+$", message = "Debe ser una URL http o https.")
        String portadaUrl,

        @Positive(message = "El Steam App ID debe ser positivo.")
        Integer steamAppId,

        @NotEmpty(message = "Elige al menos un género.")
        @Size(max = 10, message = "Máximo 10 géneros.")
        Set<@NotNull(message = "El id de género no puede ser nulo.") Long> generoIds) {
}
