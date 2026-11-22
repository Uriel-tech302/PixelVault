package com.example.demo.service;

import com.example.demo.dto.GeneroResponse;
import com.example.demo.dto.JuegoResponse;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.PlataformaResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.Juego;
import com.example.demo.repository.GeneroRepository;
import com.example.demo.repository.JuegoConsultaRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.PlataformaRepository;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogoService {

    private static final Map<String, String> ORDENES_JUEGO = Map.of(
            "titulo", "j.titulo",
            "anioLanzamiento", "j.anioLanzamiento",
            "createdAt", "j.createdAt");

    private final JuegoConsultaRepository juegoConsultas;
    private final JuegoRepository juegoRepository;
    private final GeneroRepository generoRepository;
    private final PlataformaRepository plataformaRepository;

    public CatalogoService(JuegoConsultaRepository juegoConsultas, JuegoRepository juegoRepository,
                           GeneroRepository generoRepository, PlataformaRepository plataformaRepository) {
        this.juegoConsultas = juegoConsultas;
        this.juegoRepository = juegoRepository;
        this.generoRepository = generoRepository;
        this.plataformaRepository = plataformaRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<JuegoResponse> listarJuegos(String q, Long generoId, int pagina, int tamanio, String sort) {
        ParametrosConsulta.validarPagina(pagina, tamanio);
        ParametrosConsulta.Orden orden = ParametrosConsulta.resolverOrden(sort, "titulo,asc", ORDENES_JUEGO);
        String patron = ParametrosConsulta.patronBusqueda(q);

        Page<Juego> resultado = juegoConsultas.buscar(patron, generoId, orden.expresion(), orden.ascendente(),
                pagina, tamanio);
        List<JuegoResponse> contenido = resultado.getContent().stream().map(JuegoResponse::de).toList();
        return PageResponse.de(contenido, pagina, tamanio, resultado.getTotalElements());
    }

    @Transactional(readOnly = true)
    public JuegoResponse detalleJuego(Long id) {
        Juego juego = juegoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Juego no encontrado."));
        return JuegoResponse.de(juego);
    }

    @Transactional(readOnly = true)
    public List<GeneroResponse> listarGeneros() {
        return generoRepository.findAllByOrderByNombreAsc().stream().map(GeneroResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<PlataformaResponse> listarPlataformas() {
        return plataformaRepository.findAllByOrderByNombreAsc().stream().map(PlataformaResponse::de).toList();
    }
}
