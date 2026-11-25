package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordCambioRequest(
        @NotBlank(message = "La contraseña actual es obligatoria.")
        String passwordActual,

        @NotBlank(message = "La contraseña nueva es obligatoria.")
        @Size(min = 8, max = 72, message = "Debe tener entre 8 y 72 caracteres.")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).*$",
                message = "Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial.")
        String passwordNueva) {
}
