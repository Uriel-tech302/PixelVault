package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(
        @NotNull(message = "El campo activo es obligatorio (true o false).")
        Boolean activo) {
}
