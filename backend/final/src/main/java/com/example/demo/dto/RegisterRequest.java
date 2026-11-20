package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(min = 3, max = 30, message = "Debe tener entre 3 y 30 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9_.-]*$", message = "Solo letras, números, punto, guion y guion bajo.")
        String username,

        @NotBlank(message = "El correo electrónico es obligatorio.")
        @Email(message = "Ingresa un correo electrónico válido.")
        @Size(max = 150, message = "El correo admite máximo 150 caracteres.")
        String email,

        @NotBlank(message = "La contraseña es obligatoria.")
        @Size(min = 8, max = 72, message = "Debe tener entre 8 y 72 caracteres.")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).*$",
                message = "Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial.")
        String password) {
}
