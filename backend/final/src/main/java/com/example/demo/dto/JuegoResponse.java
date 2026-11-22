package com.example.demo.dto;

import com.example.demo.model.Genero;
import com.example.demo.model.Juego;
import java.util.List;

public record JuegoResponse(Long id, String titulo, String descripcion, Short anioLanzamiento,
                            String desarrollador, List<String> generos, String portadaUrl,
                            String bannerUrl, Integer steamAppId) {

    private static final String CDN_STEAM = "https://cdn.cloudflare.steamstatic.com/steam/apps/";

    public static JuegoResponse de(Juego j) {
        return new JuegoResponse(j.getId(), j.getTitulo(), j.getDescripcion(), j.getAnioLanzamiento(),
                j.getDesarrollador(), nombresGeneros(j), j.getPortadaUrl(), bannerUrl(j.getSteamAppId()),
                j.getSteamAppId());
    }

    public static List<String> nombresGeneros(Juego j) {
        return j.getGeneros().stream().map(Genero::getNombre).sorted().toList();
    }

    public static String bannerUrl(Integer steamAppId) {
        return steamAppId == null ? null : CDN_STEAM + steamAppId + "/library_hero.jpg";
    }
}
