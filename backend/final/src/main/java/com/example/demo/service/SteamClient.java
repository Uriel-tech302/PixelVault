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
    // Un objeto { ... } de la lista de juegos; tolera llaves dentro de textos entre comillas.
    private static final Pattern OBJETO = Pattern.compile("\\{(?:[^{}\"]|\"(?:[^\"\\\\]|\\\\.)*\")*}");
    private static final Pattern JUEGO_NOMBRE = Pattern.compile("\"name\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"");
    private static final Pattern APPID = Pattern.compile("\"appid\"\\s*:\\s*(\\d+)");
    private static final Pattern MINUTOS = Pattern.compile("\"playtime_forever\"\\s*:\\s*(\\d+)");
    private static final Pattern ULTIMA = Pattern.compile("\"rtime_last_played\"\\s*:\\s*(\\d+)");

    public record Jugador(String steamId, String nombre, boolean perfilPublico) {
    }

    public record JuegoSteam(int appId, String nombre, int minutos, long ultimaVezUnix) {
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
                "steamid=" + enc(steamId) + "&include_played_free_games=1&include_appinfo=1");
        return parsearJuegos(cuerpo);
    }

    static List<JuegoSteam> parsearJuegos(String cuerpo) {
        int ini = cuerpo.indexOf("\"games\"");
        if (ini < 0) {
            return CERO_JUEGOS.matcher(cuerpo).find() ? List.of() : null;
        }
        int abre = cuerpo.indexOf('[', ini);
        int cierra = abre < 0 ? -1 : cuerpo.lastIndexOf(']');
        if (abre < 0 || cierra < abre) {
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
            int appId = Integer.parseInt(app.group(1));
            Matcher nom = JUEGO_NOMBRE.matcher(o);
            String nombre = nom.find() ? desescapar(nom.group(1)).trim() : "";
            if (nombre.isEmpty()) {
                nombre = "Steam App " + appId;
            }
            Matcher min = MINUTOS.matcher(o);
            Matcher ult = ULTIMA.matcher(o);
            juegos.add(new JuegoSteam(
                    appId,
                    nombre,
                    min.find() ? Integer.parseInt(min.group(1)) : 0,
                    ult.find() ? Long.parseLong(ult.group(1)) : 0L));
        }
        return juegos;
    }

    private static String desescapar(String t) {
        if (t.indexOf('\\') < 0) {
            return t;
        }
        StringBuilder sb = new StringBuilder(t.length());
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c != '\\' || i + 1 >= t.length()) {
                sb.append(c);
                continue;
            }
            char n = t.charAt(++i);
            switch (n) {
                case 'n' -> sb.append(' ');
                case 't' -> sb.append(' ');
                case 'r' -> { }
                case 'u' -> {
                    if (i + 4 < t.length()) {
                        try {
                            sb.append((char) Integer.parseInt(t.substring(i + 1, i + 5), 16));
                            i += 4;
                        } catch (NumberFormatException e) {
                            sb.append('u');
                        }
                    } else {
                        sb.append('u');
                    }
                }
                default -> sb.append(n);
            }
        }
        return sb.toString();
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
