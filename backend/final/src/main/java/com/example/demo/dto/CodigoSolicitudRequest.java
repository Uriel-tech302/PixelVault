package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CodigoSolicitudRequest(
        @NotBlank(message = "El canal es obligatorio.")
        @Pattern(regexp = "^(SMS|WHATSAPP)$", message = "Debe ser SMS o WHATSAPP.")
        String canal) {
}
