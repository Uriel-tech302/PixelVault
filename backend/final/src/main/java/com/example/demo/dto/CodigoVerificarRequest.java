package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CodigoVerificarRequest(
        @NotBlank(message = "El código es obligatorio.")
        @Pattern(regexp = "^[0-9]{6}$", message = "El código tiene 6 dígitos.")
        String codigo) {
}
