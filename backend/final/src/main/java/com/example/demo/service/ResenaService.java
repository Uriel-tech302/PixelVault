package com.example.demo.service;

import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResenaModeracionResponse;
import com.example.demo.dto.ResenaPublicaResponse;
import com.example.demo.dto.ResenaRequest;
import com.example.demo.dto.ResenaResumenResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.Resena;
import com.example.demo.model.Visibilidad;
import com.example.demo.repository.BibliotecaItemRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.ResenaRepository;
import com.example.demo.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResenaService {

    public record Guardada(ResenaResumenResponse resena, boolean creada) {
    }

    private static final Sort ORDEN_RECIENTES = Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("id"));

    private final ResenaRepository resenaRepository;
    private final BibliotecaItemRepository bibliotecaRepository;
    private final JuegoRepository juegoRepository;
    private final UsuarioRepository usuarioRepository;

    public ResenaService(ResenaRepository resenaRepository, BibliotecaItemRepository bibliotecaRepository,
                         JuegoRepository juegoRepository, UsuarioRepository usuarioRepository) {
        this.resenaRepository = resenaRepository;
        this.bibliotecaRepository = bibliotecaRepository;
        this.juegoRepository = juegoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Guardada guardar(Long usuarioId, Long itemId, ResenaRequest r) {
        BibliotecaItem item = bibliotecaRepository.findByIdAndUsuarioId(itemId, usuarioId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Entrada de biblioteca no encontrada."));

        Optional<Resena> existente = resenaRepository.findByBibliotecaItemId(itemId);
        Resena resena = existente.orElseGet(Resena::new);
        if (existente.isEmpty()) {
            resena.setBibliotecaItem(item);
        }
        resena.setTexto(r.texto().trim());
        resena.setContieneSpoilers(Boolean.TRUE.equals(r.contieneSpoilers()));
        resena.setVisibilidad(r.visibilidad() == null ? Visibilidad.PRIVADA : Visibilidad.valueOf(r.visibilidad()));

        resena = resenaRepository.save(resena);
        return new Guardada(ResenaResumenResponse.de(resena), existente.isEmpty());
    }

    @Transactional
    public void quitar(Long usuarioId, Long itemId) {
        bibliotecaRepository.findByIdAndUsuarioId(itemId, usuarioId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Entrada de biblioteca no encontrada."));
        Resena resena = resenaRepository.findByBibliotecaItemId(itemId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Esa entrada no tiene reseña."));
        resenaRepository.delete(resena);
    }

    @Transactional(readOnly = true)
    public PageResponse<ResenaPublicaResponse> publicasDeJuego(Long juegoId, String page, String size) {
        if (!juegoRepository.existsById(juegoId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Juego no encontrado.");
        }
        int pagina = entero(page, 0, "page");
        int tamanio = entero(size, 12, "size");
        ParametrosConsulta.validarPagina(pagina, tamanio);

        Page<Resena> resultado = resenaRepository.publicasDeJuego(
                juegoId, Visibilidad.PUBLICA, PageRequest.of(pagina, tamanio, ORDEN_RECIENTES));

        List<ResenaPublicaResponse> contenido = resultado.getContent().stream().map(r -> {
            BibliotecaItem b = r.getBibliotecaItem();
            return new ResenaPublicaResponse(r.getId(), b.getUsuario().getUsername(), r.getTexto(),
                    r.isContieneSpoilers(), b.getPuntuacion() == null ? null : b.getPuntuacion().intValue(),
                    b.getPlataforma().getNombre(), String.valueOf(r.getCreatedAt()));
        }).toList();
        return PageResponse.de(contenido, pagina, tamanio, resultado.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PageResponse<ResenaModeracionResponse> listarModeracion(String oculta, String q,
                                                                   String page, String size) {
        Boolean ocultaFiltro = null;
        if (!vacio(oculta)) {
            if ("true".equalsIgnoreCase(oculta.trim())) {
                ocultaFiltro = Boolean.TRUE;
            } else if ("false".equalsIgnoreCase(oculta.trim())) {
                ocultaFiltro = Boolean.FALSE;
            } else {
                throw invalido("oculta", "Usa true o false.");
            }
        }
        int pagina = entero(page, 0, "page");
        int tamanio = entero(size, 12, "size");
        ParametrosConsulta.validarPagina(pagina, tamanio);

        String patron = null;
        if (!vacio(q)) {
            String t = q.trim().toLowerCase(Locale.ROOT);
            if (t.length() > 100) {
                t = t.substring(0, 100);
            }
            patron = "%" + t.replace("!", "!!").replace("%", "!%").replace("_", "!_") + "%";
        }

        Page<Resena> resultado = resenaRepository.moderacion(
                Visibilidad.PUBLICA, ocultaFiltro, patron, PageRequest.of(pagina, tamanio, ORDEN_RECIENTES));
        return PageResponse.de(resultado.getContent().stream().map(this::aModeracion).toList(),
                pagina, tamanio, resultado.getTotalElements());
    }

    @Transactional
    public ResenaModeracionResponse ocultar(Long id, String motivo, Long moderadorId) {
        Resena resena = buscar(id);
        resena.setOculta(true);
        resena.setMotivoModeracion(motivo.trim());
        resena.setModeradaPor(usuarioRepository.getReferenceById(moderadorId));
        resena.setModeradaEn(LocalDateTime.now());
        return aModeracion(resenaRepository.save(resena));
    }

    @Transactional
    public ResenaModeracionResponse mostrar(Long id, Long moderadorId) {
        Resena resena = buscar(id);
        resena.setOculta(false);
        resena.setMotivoModeracion(null);
        resena.setModeradaPor(usuarioRepository.getReferenceById(moderadorId));
        resena.setModeradaEn(LocalDateTime.now());
        return aModeracion(resenaRepository.save(resena));
    }

    @Transactional
    public void eliminar(Long id) {
        resenaRepository.delete(buscar(id));
    }

    private Resena buscar(Long id) {
        return resenaRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Reseña no encontrada."));
    }

    private ResenaModeracionResponse aModeracion(Resena r) {
        BibliotecaItem b = r.getBibliotecaItem();
        return new ResenaModeracionResponse(
                r.getId(), r.getTexto(), r.isContieneSpoilers(), r.getVisibilidad().name(), r.isOculta(),
                r.getMotivoModeracion(),
                r.getModeradaPor() == null ? null : r.getModeradaPor().getUsername(),
                r.getModeradaEn() == null ? null : r.getModeradaEn().toString(),
                b.getUsuario().getUsername(), b.getJuego().getId(), b.getJuego().getTitulo(),
                b.getPuntuacion() == null ? null : b.getPuntuacion().intValue(),
                String.valueOf(r.getCreatedAt()));
    }

    private boolean vacio(String s) {
        return s == null || s.isBlank();
    }

    private int entero(String valor, int porDefecto, String nombre) {
        if (vacio(valor)) {
            return porDefecto;
        }
        try {
            return Integer.parseInt(valor.trim());
        } catch (NumberFormatException e) {
            throw invalido(nombre, "Debe ser un número entero.");
        }
    }

    private ApiException invalido(String campo, String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "Parámetro no válido.", Map.of(campo, mensaje));
    }
}
