package com.example.demo.service;

import com.example.demo.exception.ApiException;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class SteamClient {

    private static final Logger log = LoggerFactory.getLogger(SteamClient.class);
    private static final String BASE = "https://api.steampowered.com";

    private static final Pattern STEAMID = Pattern.compile("\"steamid\"\\s*:\\s*\"(\\d+)\"");
    private static final Pattern EXITO = Pattern.compile("\"success\"\\s*:\\s*1\\b");
    private static final Pattern VISIBILIDAD = Pattern.compile("\"communityvisibilitystate\"\\s*:\\s*(\\d+)");
    private static final Pattern NOMBRE = Pattern.compile("\"personaname\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"");
    private static final Pattern CERO_JUEGOS = Pattern.compile("\"game_count\"\\s*:\\s*0\\b");
    private static final Pattern OBJETO = Pattern.compile("\\{[^{}]*}");
    private static final Pattern APPID = Pattern.compile("\"appid\"\\s*:\\s*(\\d+)");
    private static final Pattern MINUTOS = Pattern.compile("\"playtime_forever\"\\s*:\\s*(\\d+)");
    private static final Pattern ULTIMA = Pattern.compile("\"rtime_last_played\"\\s*:\\s*(\\d+)");

    public record Jugador(String steamId, String nombre, boolean perfilPublico) {
    }

    public record JuegoSteam(int appId, int minutos, long ultimaVezUnix) {
    }

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final String apiKey;

    public SteamClient(@Value("${STEAM_API_KEY:}") String apiKey) {
        this.apiKey = apiKey.trim();
    }

    public String resolverNombre(String nombre) {
        String cuerpo = get("/ISteamUser/ResolveVanityURL/v1/", "vanityurl=" + enc(nombre));
        Matcher id = STEAMID.matcher(cuerpo);
        if (!EXITO.matcher(cuerpo).find() || !id.find()) {
            return null;
        }
        return id.group(1);
    }

    public Jugador jugador(String steamId) {
        String cuerpo = get("/ISteamUser/GetPlayerSummaries/v2/", "steamids=" + enc(steamId));
        Matcher id = STEAMID.matcher(cuerpo);
        if (!id.find()) {
            return null;
        }
        Matcher vis = VISIBILIDAD.matcher(cuerpo);
        boolean publico = vis.find() && "3".equals(vis.group(1));
        Matcher nombre = NOMBRE.matcher(cuerpo);
        String persona = nombre.find() ? nombre.group(1).replace("\\\"", "\"").replace("\\\\", "\\") : steamId;
        return new Jugador(id.group(1), persona, publico);
    }

    public List<JuegoSteam> juegos(String steamId) {
        String cuerpo = get("/IPlayerService/GetOwnedGames/v1/",
                "steamid=" + enc(steamId) + "&include_played_free_games=1");
        int ini = cuerpo.indexOf("\"games\"");
        if (ini < 0) {
            return CERO_JUEGOS.matcher(cuerpo).find() ? List.of() : null;
        }
        int abre = cuerpo.indexOf('[', ini);
        int cierra = abre < 0 ? -1 : cuerpo.indexOf(']', abre);
        if (abre < 0 || cierra < 0) {
            return List.of();
        }

        List<JuegoSteam> juegos = new ArrayList<>();
        Matcher objetos = OBJETO.matcher(cuerpo.substring(abre, cierra));
        while (objetos.find()) {
            String o = objetos.group();
            Matcher app = APPID.matcher(o);
            if (!app.find()) {
                continue;
            }
            Matcher min = MINUTOS.matcher(o);
            Matcher ult = ULTIMA.matcher(o);
            juegos.add(new JuegoSteam(
                    Integer.parseInt(app.group(1)),
                    min.find() ? Integer.parseInt(min.group(1)) : 0,
                    ult.find() ? Long.parseLong(ult.group(1)) : 0L));
        }
        return juegos;
    }

    private String get(String ruta, String consulta) {
        if (apiKey.isEmpty()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "La integración con Steam no está configurada en el servidor.");
        }
        URI uri = URI.create(BASE + ruta + "?key=" + enc(apiKey) + "&" + consulta + "&format=json");
        HttpRequest peticion = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(15)).GET().build();
        try {
            HttpResponse<String> respuesta = http.send(peticion, HttpResponse.BodyHandlers.ofString());
            if (respuesta.statusCode() / 100 != 2) {
                log.warn("Steam respondió {} en {}", respuesta.statusCode(), ruta);
                throw fallo();
            }
            return respuesta.body() == null ? "" : respuesta.body();
        } catch (IOException e) {
            log.warn("No se pudo contactar a Steam: {}", e.getClass().getSimpleName());
            throw fallo();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw fallo();
        }
    }

    private static String enc(String valor) {
        return URLEncoder.encode(valor, StandardCharsets.UTF_8);
    }

    private static ApiException fallo() {
        return new ApiException(HttpStatus.BAD_GATEWAY,
                "No se pudo consultar Steam. Intenta de nuevo en unos minutos.");
    }
}
