package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OcultarRequest(
        @NotBlank(message = "El motivo es obligatorio.")
        @Size(max = 255, message = "El motivo admite máximo 255 caracteres.")
        String motivo) {
}
