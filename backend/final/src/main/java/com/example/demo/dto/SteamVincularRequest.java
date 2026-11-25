package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SteamVincularRequest(
        @NotBlank(message = "Escribe tu ID, enlace o nombre de perfil de Steam.")
        @Size(max = 200, message = "El valor es demasiado largo.")
        String steam) {
}
