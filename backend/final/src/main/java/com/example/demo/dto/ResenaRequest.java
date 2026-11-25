package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResenaRequest(
        @NotBlank(message = "La reseña no puede estar vacía.")
        @Size(max = 2000, message = "La reseña admite máximo 2000 caracteres.")
        String texto,

        Boolean contieneSpoilers,

        @Pattern(regexp = "^(PRIVADA|PUBLICA)$", message = "Debe ser PRIVADA o PUBLICA.")
        String visibilidad) {
}
