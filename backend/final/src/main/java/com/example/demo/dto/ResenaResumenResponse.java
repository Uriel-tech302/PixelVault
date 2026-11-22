package com.example.demo.dto;

import com.example.demo.model.Resena;
import com.example.demo.model.Visibilidad;

public record ResenaResumenResponse(Long id, String texto, boolean contieneSpoilers,
                                    Visibilidad visibilidad, boolean oculta) {

    public static ResenaResumenResponse de(Resena r) {
        return new ResenaResumenResponse(r.getId(), r.getTexto(), r.isContieneSpoilers(),
                r.getVisibilidad(), r.isOculta());
    }
}
