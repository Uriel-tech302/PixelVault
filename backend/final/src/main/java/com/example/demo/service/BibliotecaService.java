package com.example.demo.service;

import com.example.demo.dto.BibliotecaActualizarRequest;
import com.example.demo.dto.BibliotecaCrearRequest;
import com.example.demo.dto.BibliotecaItemResponse;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResenaResumenResponse;
import com.example.demo.dto.ResumenBibliotecaResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.EstadoJuego;
import com.example.demo.model.Juego;
import com.example.demo.model.Plataforma;
import com.example.demo.repository.BibliotecaConsultaRepository;
import com.example.demo.repository.BibliotecaItemRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.PlataformaRepository;
import com.example.demo.repository.ResenaRepository;
import com.example.demo.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BibliotecaService {

    private static final Map<String, String> ORDENES = Map.of(
            "titulo", "j.titulo",
            "anioLanzamiento", "j.anioLanzamiento",
            "horasJugadas", "b.horasJugadas",
            "puntuacion", "b.puntuacion",
            "ultimaSesion", "b.ultimaSesion",
            "createdAt", "b.createdAt");

    private final BibliotecaItemRepository bibliotecaRepository;
    private final BibliotecaConsultaRepository consultas;
    private final JuegoRepository juegoRepository;
    private final PlataformaRepository plataformaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ResenaRepository resenaRepository;

    public BibliotecaService(BibliotecaItemRepository bibliotecaRepository,
                             BibliotecaConsultaRepository consultas,
                             JuegoRepository juegoRepository,
                             PlataformaRepository plataformaRepository,
                             UsuarioRepository usuarioRepository,
                             ResenaRepository resenaRepository) {
        this.bibliotecaRepository = bibliotecaRepository;
        this.consultas = consultas;
        this.juegoRepository = juegoRepository;
        this.plataformaRepository = plataformaRepository;
        this.usuarioRepository = usuarioRepository;
        this.resenaRepository = resenaRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<BibliotecaItemResponse> listar(Long usuarioId, EstadoJuego estado, Long plataformaId,
                                                       String q, int pagina, int tamanio, String sort) {
        ParametrosConsulta.validarPagina(pagina, tamanio);
        ParametrosConsulta.Orden orden = ParametrosConsulta.resolverOrden(sort, "ultimaSesion,desc", ORDENES);
        String patron = ParametrosConsulta.patronBusqueda(q);

        Page<BibliotecaItem> resultado = consultas.buscar(usuarioId, estado, plataformaId, patron,
                orden.expresion(), orden.ascendente(), pagina, tamanio);
        List<BibliotecaItem> items = resultado.getContent();

        // Una sola consulta para saber cuales de la pagina tienen reseña (en vez de una por tarjeta)
        Set<Long> conResena = items.isEmpty()
                ? Set.of()
                : new HashSet<>(resenaRepository.idsConResena(items.stream().map(BibliotecaItem::getId).toList()));

        List<BibliotecaItemResponse> contenido = items.stream()
                .map(b -> BibliotecaItemResponse.de(b, conResena.contains(b.getId()), null))
                .toList();
        return PageResponse.de(contenido, pagina, tamanio, resultado.getTotalElements());
    }

    @Transactional(readOnly = true)
    public BibliotecaItemResponse detalle(Long usuarioId, Long id) {
        BibliotecaItem item = buscarPropia(usuarioId, id);
        return conResena(item);
    }

    @Transactional(readOnly = true)
    public ResumenBibliotecaResponse resumen(Long usuarioId) {
        Map<String, Long> porEstado = new LinkedHashMap<>();
        for (EstadoJuego e : EstadoJuego.values()) {
            porEstado.put(e.name(), 0L);
        }

        long total = 0;
        BigDecimal horas = BigDecimal.ZERO;
        for (Object[] fila : bibliotecaRepository.resumenPorEstado(usuarioId)) {
            long cantidad = ((Number) fila[1]).longValue();
            porEstado.put(((EstadoJuego) fila[0]).name(), cantidad);
            total += cantidad;
            horas = horas.add(new BigDecimal(fila[2].toString()));
        }

        long completados = porEstado.get(EstadoJuego.COMPLETADO.name());
        int porcentaje = total == 0 ? 0 : (int) Math.round(completados * 100.0 / total);
        return new ResumenBibliotecaResponse(total, horas, porcentaje, porEstado);
    }

    @Transactional
    public BibliotecaItemResponse agregar(Long usuarioId, BibliotecaCrearRequest r) {
        Juego juego = juegoRepository.findById(r.juegoId())
                .orElseThrow(() -> noExiste("juegoId", "El juego no existe."));
        Plataforma plataforma = plataformaRepository.findById(r.plataformaId())
                .orElseThrow(() -> noExiste("plataformaId", "La plataforma no existe."));

        if (bibliotecaRepository.existsByUsuarioIdAndJuegoIdAndPlataformaId(usuarioId, juego.getId(),
                plataforma.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "Ese juego ya está en tu biblioteca para esa plataforma.");
        }

        BibliotecaItem item = new BibliotecaItem();
        item.setUsuario(usuarioRepository.getReferenceById(usuarioId));
        item.setJuego(juego);
        item.setPlataforma(plataforma);
        item.setEstado(r.estado() != null ? r.estado() : EstadoJuego.JUGANDO);
        item.setHorasJugadas(r.horasJugadas() != null ? r.horasJugadas() : BigDecimal.ZERO);
        item.setUltimaSesion(r.ultimaSesion());
        item.setPuntuacion(aByte(r.puntuacion()));

        item = bibliotecaRepository.save(item);
        return BibliotecaItemResponse.de(item, false, null);
    }

    @Transactional
    public BibliotecaItemResponse actualizar(Long usuarioId, Long id, BibliotecaActualizarRequest r) {
        BibliotecaItem item = buscarPropia(usuarioId, id);
        item.setEstado(r.estado());
        item.setHorasJugadas(r.horasJugadas());
        item.setUltimaSesion(r.ultimaSesion());
        item.setPuntuacion(aByte(r.puntuacion()));

        item = bibliotecaRepository.saveAndFlush(item);
        return conResena(item);
    }

    @Transactional
    public void quitar(Long usuarioId, Long id) {
        BibliotecaItem item = bibliotecaRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Entrada de biblioteca no encontrada."));
        // La reseña de la entrada se elimina en cascada desde la base de datos (ON DELETE CASCADE)
        bibliotecaRepository.delete(item);
    }

    private BibliotecaItem buscarPropia(Long usuarioId, Long id) {
        return bibliotecaRepository.detalle(id, usuarioId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Entrada de biblioteca no encontrada."));
    }

    private BibliotecaItemResponse conResena(BibliotecaItem item) {
        return resenaRepository.findByBibliotecaItemId(item.getId())
                .map(r -> BibliotecaItemResponse.de(item, true, ResenaResumenResponse.de(r)))
                .orElseGet(() -> BibliotecaItemResponse.de(item, false, null));
    }

    private static Byte aByte(Integer puntuacion) {
        return puntuacion == null ? null : Byte.valueOf(puntuacion.byteValue());
    }

    private static ApiException noExiste(String campo, String mensaje) {
        return new ApiException(HttpStatus.valueOf(422), "No se puede procesar la solicitud.",
                Map.of(campo, mensaje));
    }
}
