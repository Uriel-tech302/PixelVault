package com.example.demo.dto;

import com.example.demo.model.Genero;

public record GeneroResponse(Long id, String nombre) {

    public static GeneroResponse de(Genero g) {
        return new GeneroResponse(g.getId(), g.getNombre());
    }
}
