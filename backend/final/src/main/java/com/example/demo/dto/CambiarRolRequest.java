package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CambiarRolRequest(
        @NotBlank(message = "El rol es obligatorio.")
        @Pattern(regexp = "^(ADMIN|MODERADOR|USUARIO)$", message = "Debe ser ADMIN, MODERADOR o USUARIO.")
        String rol) {
}
