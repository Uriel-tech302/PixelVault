package com.example.demo.service;

import com.example.demo.dto.SteamEstadoResponse;
import com.example.demo.dto.SteamSincronizacionResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.EstadoJuego;
import com.example.demo.model.Plataforma;
import com.example.demo.model.Usuario;
import com.example.demo.repository.BibliotecaItemRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.PlataformaRepository;
import com.example.demo.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SteamService {

    private static final Pattern ID64 = Pattern.compile("^\\d{17}$");
    private static final Pattern URL_PERFIL = Pattern.compile(
            "(?i)^(?:https?://)?(?:www\\.)?steamcommunity\\.com/profiles/(\\d{17})(?:[/?#].*)?$");
    private static final Pattern URL_NOMBRE = Pattern.compile(
            "(?i)^(?:https?://)?(?:www\\.)?steamcommunity\\.com/id/([A-Za-z0-9_-]{2,32})(?:[/?#].*)?$");
    private static final Pattern NOMBRE = Pattern.compile("^[A-Za-z0-9_-]{2,32}$");

    private static final long SEGUNDOS_ENTRE_SINCRONIZACIONES = 60;

    private final SteamClient steam;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;
    private final PlataformaRepository plataformaRepository;
    private final BibliotecaItemRepository bibliotecaRepository;
    private final JdbcTemplate jdbc;

    public SteamService(SteamClient steam, UsuarioRepository usuarioRepository, JuegoRepository juegoRepository,
                        PlataformaRepository plataformaRepository, BibliotecaItemRepository bibliotecaRepository,
                        JdbcTemplate jdbc) {
        this.steam = steam;
        this.usuarioRepository = usuarioRepository;
        this.juegoRepository = juegoRepository;
        this.plataformaRepository = plataformaRepository;
        this.bibliotecaRepository = bibliotecaRepository;
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public SteamEstadoResponse estado(Long usuarioId) {
        return aEstado(buscar(usuarioId), null);
    }

    @Transactional
    public SteamEstadoResponse vincular(Long usuarioId, String entrada) {
        Usuario usuario = buscar(usuarioId);
        String steamId = resolver(entrada.trim());

        SteamClient.Jugador jugador = steam.jugador(steamId);
        if (jugador == null) {
            throw invalido("steam", "No encontramos ese perfil de Steam.");
        }
        if (!jugador.perfilPublico()) {
            throw invalido("steam", "Tu perfil de Steam debe ser público (incluidos los detalles de juegos).");
        }

        Integer otros = jdbc.queryForObject(
                "SELECT COUNT(*) FROM usuarios WHERE steam_id = ? AND id <> ?", Integer.class, steamId, usuarioId);
        if (otros != null && otros > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "Esa cuenta de Steam ya está vinculada a otro usuario.",
                    Map.of("steam", "Esa cuenta de Steam ya está vinculada a otro usuario."));
        }

        if (!steamId.equals(usuario.getSteamId())) {
            usuario.setSteamId(steamId);
            usuario.setSteamUltimaSincronizacion(null);
        }
        usuarioRepository.save(usuario);
        return aEstado(usuario, jugador.nombre());
    }

    @Transactional
    public void desvincular(Long usuarioId) {
        Usuario usuario = buscar(usuarioId);
        usuario.setSteamId(null);
        usuario.setSteamUltimaSincronizacion(null);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public SteamSincronizacionResponse sincronizar(Long usuarioId) {
        Usuario usuario = buscar(usuarioId);
        if (usuario.getSteamId() == null) {
            throw invalido("steam", "Primero vincula tu cuenta de Steam.");
        }
        LocalDateTime ultima = usuario.getSteamUltimaSincronizacion();
        if (ultima != null && ultima.isAfter(LocalDateTime.now().minusSeconds(SEGUNDOS_ENTRE_SINCRONIZACIONES))) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Espera un minuto antes de sincronizar otra vez.");
        }

        List<SteamClient.JuegoSteam> propios = steam.juegos(usuario.getSteamId());
        if (propios == null) {
            throw invalido("steam", "No pudimos leer tu lista de juegos. En Steam, pon \"Detalles del juego\" "
                    + "en público (Editar perfil > Configuración de privacidad).");
        }

        Plataforma pc = plataformaRepository.findByNombre("PC")
                .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Falta la plataforma PC en el catálogo."));

        Map<Integer, Long> catalogo = catalogo();
        Map<Long, BibliotecaItem> existentes = new HashMap<>();
        for (BibliotecaItem b : bibliotecaRepository.porUsuarioYPlataforma(usuarioId, pc.getId())) {
            existentes.put(b.getJuego().getId(), b);
        }

        int importados = 0;
        int actualizados = 0;
        int omitidos = 0;
        List<BibliotecaItem> nuevos = new ArrayList<>();

        for (SteamClient.JuegoSteam s : propios) {
            Long juegoId = catalogo.get(s.appId());
            if (juegoId == null) {
                omitidos++;
                continue;
            }
            BigDecimal horas = BigDecimal.valueOf(s.minutos()).divide(BigDecimal.valueOf(60), 1, RoundingMode.HALF_UP);
            LocalDate ultimaSesion = s.ultimaVezUnix() > 0
                    ? Instant.ofEpochSecond(s.ultimaVezUnix()).atZone(ZoneId.systemDefault()).toLocalDate()
                    : null;

            BibliotecaItem item = existentes.get(juegoId);
            if (item == null) {
                BibliotecaItem nuevo = new BibliotecaItem();
                nuevo.setUsuario(usuario);
                nuevo.setJuego(juegoRepository.getReferenceById(juegoId));
                nuevo.setPlataforma(pc);
                nuevo.setEstado(EstadoJuego.JUGANDO);
                nuevo.setHorasJugadas(horas);
                nuevo.setUltimaSesion(ultimaSesion);
                nuevos.add(nuevo);
                importados++;
            } else {
                boolean cambio = false;
                if (item.getHorasJugadas() == null || item.getHorasJugadas().compareTo(horas) != 0) {
                    item.setHorasJugadas(horas);
                    cambio = true;
                }
                if (ultimaSesion != null && !ultimaSesion.equals(item.getUltimaSesion())) {
                    item.setUltimaSesion(ultimaSesion);
                    cambio = true;
                }
                if (cambio) {
                    actualizados++;
                }
            }
        }
        bibliotecaRepository.saveAll(nuevos);

        LocalDateTime ahora = LocalDateTime.now();
        usuario.setSteamUltimaSincronizacion(ahora);
        usuarioRepository.save(usuario);

        return new SteamSincronizacionResponse(importados, actualizados, omitidos, propios.size(),
                ahora.toString());
    }

    private String resolver(String entrada) {
        if (ID64.matcher(entrada).matches()) {
            return entrada;
        }
        Matcher perfil = URL_PERFIL.matcher(entrada);
        if (perfil.matches()) {
            return perfil.group(1);
        }
        Matcher nombreUrl = URL_NOMBRE.matcher(entrada);
        String nombre = null;
        if (nombreUrl.matches()) {
            nombre = nombreUrl.group(1);
        } else if (NOMBRE.matcher(entrada).matches()) {
            nombre = entrada;
        }
        if (nombre == null) {
            throw invalido("steam", "Escribe tu SteamID64, el enlace de tu perfil o su nombre personalizado.");
        }
        String id = steam.resolverNombre(nombre);
        if (id == null) {
            throw invalido("steam", "No encontramos ese perfil de Steam.");
        }
        return id;
    }

    private Map<Integer, Long> catalogo() {
        Map<Integer, Long> mapa = new HashMap<>();
        jdbc.query("SELECT id, steam_app_id FROM juegos WHERE steam_app_id IS NOT NULL",
                (RowCallbackHandler) rs -> mapa.put(rs.getInt("steam_app_id"), rs.getLong("id")));
        return mapa;
    }

    private SteamEstadoResponse aEstado(Usuario u, String nombrePerfil) {
        LocalDateTime ultima = u.getSteamUltimaSincronizacion();
        return new SteamEstadoResponse(u.getSteamId() != null, u.getSteamId(), nombrePerfil,
                ultima == null ? null : ultima.toString());
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private ApiException invalido(String campo, String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "Datos inválidos.", Map.of(campo, mensaje));
    }
}
