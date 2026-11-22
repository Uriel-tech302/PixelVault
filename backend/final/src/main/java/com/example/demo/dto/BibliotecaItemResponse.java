package com.example.demo.dto;

import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.EstadoJuego;
import com.example.demo.model.Juego;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.util.List;

public record BibliotecaItemResponse(
        Long id,
        Long juegoId,
        String titulo,
        Short anioLanzamiento,
        String desarrollador,
        List<String> generos,
        String portadaUrl,
        String bannerUrl,
        PlataformaResponse plataforma,
        EstadoJuego estado,
        BigDecimal horasJugadas,
        String ultimaSesion,
        Integer puntuacion,
        boolean tieneResena,
        @JsonInclude(JsonInclude.Include.NON_NULL) ResenaResumenResponse resena) {

    public static BibliotecaItemResponse de(BibliotecaItem b, boolean tieneResena, ResenaResumenResponse resena) {
        Juego j = b.getJuego();
        return new BibliotecaItemResponse(
                b.getId(),
                j.getId(),
                j.getTitulo(),
                j.getAnioLanzamiento(),
                j.getDesarrollador(),
                JuegoResponse.nombresGeneros(j),
                j.getPortadaUrl(),
                JuegoResponse.bannerUrl(j.getSteamAppId()),
                PlataformaResponse.de(b.getPlataforma()),
                b.getEstado(),
                b.getHorasJugadas(),
                b.getUltimaSesion() == null ? null : b.getUltimaSesion().toString(),
                b.getPuntuacion() == null ? null : b.getPuntuacion().intValue(),
                tieneResena,
                resena);
    }
}
