package com.example.demo.service;

import com.example.demo.dto.JuegoRequest;
import com.example.demo.dto.JuegoResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.Genero;
import com.example.demo.model.Juego;
import com.example.demo.repository.BibliotecaItemRepository;
import com.example.demo.repository.GeneroRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.UsuarioRepository;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JuegoAdminService {

    private static final String PORTADA_STEAM = "https://cdn.cloudflare.steamstatic.com/steam/apps/%d/library_600x900.jpg";

    private final JuegoRepository juegoRepository;
    private final GeneroRepository generoRepository;
    private final BibliotecaItemRepository bibliotecaRepository;
    private final UsuarioRepository usuarioRepository;

    public JuegoAdminService(JuegoRepository juegoRepository, GeneroRepository generoRepository,
                             BibliotecaItemRepository bibliotecaRepository, UsuarioRepository usuarioRepository) {
        this.juegoRepository = juegoRepository;
        this.generoRepository = generoRepository;
        this.bibliotecaRepository = bibliotecaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public JuegoResponse crear(Long adminId, JuegoRequest r) {
        validarSteamAppIdLibre(r.steamAppId(), null);
        Set<Genero> generos = resolverGeneros(r.generoIds());

        Juego juego = new Juego();
        aplicar(juego, r, generos);
        juego.setCreadoPor(usuarioRepository.getReferenceById(adminId));

        return JuegoResponse.de(juegoRepository.saveAndFlush(juego));
    }

    @Transactional
    public JuegoResponse actualizar(Long id, JuegoRequest r) {
        Juego juego = buscar(id);
        validarSteamAppIdLibre(r.steamAppId(), id);
        Set<Genero> generos = resolverGeneros(r.generoIds());

        aplicar(juego, r, generos);
        return JuegoResponse.de(juegoRepository.saveAndFlush(juego));
    }

    @Transactional
    public void eliminar(Long id) {
        Juego juego = buscar(id);
        if (bibliotecaRepository.existsByJuegoId(id)) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "No se puede eliminar: el juego está en la biblioteca de al menos un usuario.");
        }
        juegoRepository.delete(juego);
        juegoRepository.flush();
    }

    private Juego buscar(Long id) {
        return juegoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Juego no encontrado."));
    }

    private void validarSteamAppIdLibre(Integer steamAppId, Long idActual) {
        if (steamAppId == null) {
            return;
        }
        juegoRepository.findBySteamAppId(steamAppId)
                .filter(otro -> !otro.getId().equals(idActual))
                .ifPresent(otro -> {
                    throw new ApiException(HttpStatus.CONFLICT, "Ya existe un juego con ese Steam App ID.",
                            Map.of("steamAppId", "Ya está registrado en \"" + otro.getTitulo() + "\"."));
                });
    }

    private Set<Genero> resolverGeneros(Set<Long> ids) {
        Set<Long> pedidos = new LinkedHashSet<>(ids);
        List<Genero> encontrados = generoRepository.findAllById(pedidos);
        if (encontrados.size() != pedidos.size()) {
            throw new ApiException(HttpStatus.valueOf(422), "No se puede procesar la solicitud.",
                    Map.of("generoIds", "Algún género no existe."));
        }
        return new HashSet<>(encontrados);
    }

    private void aplicar(Juego juego, JuegoRequest r, Set<Genero> generos) {
        juego.setTitulo(r.titulo().trim());
        juego.setDescripcion(vacioANulo(r.descripcion()));
        juego.setAnioLanzamiento(r.anioLanzamiento() == null ? null : r.anioLanzamiento().shortValue());
        juego.setDesarrollador(vacioANulo(r.desarrollador()));
        juego.setSteamAppId(r.steamAppId());

        String portada = vacioANulo(r.portadaUrl());
        if (portada == null && r.steamAppId() != null) {
            portada = PORTADA_STEAM.formatted(r.steamAppId());
        }
        juego.setPortadaUrl(portada);

        juego.getGeneros().clear();
        juego.getGeneros().addAll(generos);
    }

    private static String vacioANulo(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return texto.trim();
    }
}
