package com.example.demo.dto;

import com.example.demo.model.Plataforma;

public record PlataformaResponse(Long id, String nombre) {

    public static PlataformaResponse de(Plataforma p) {
        return new PlataformaResponse(p.getId(), p.getNombre());
    }
}
