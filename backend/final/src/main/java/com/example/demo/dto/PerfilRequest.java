package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PerfilRequest(
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(min = 3, max = 30, message = "Debe tener entre 3 y 30 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9_.-]*$", message = "Solo letras, números, punto, guion y guion bajo.")
        String username,

        @Size(max = 255, message = "La URL admite máximo 255 caracteres.")
        @Pattern(regexp = "^(https?://\\S+)?$", message = "Debe ser una URL http o https.")
        String avatarUrl,

        @Pattern(regexp = "^(\\+[1-9][0-9]{7,14})?$",
                message = "Usa formato internacional sin espacios, por ejemplo +521234567890.")
        String telefono) {
}
