package com.example.demo.controller;

import com.example.demo.dto.GeneroResponse;
import com.example.demo.dto.JuegoResponse;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.PlataformaResponse;
import com.example.demo.service.CatalogoService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final CatalogoService catalogoService;

    public CatalogoController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping("/juegos")
    public PageResponse<JuegoResponse> juegos(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "generoId", required = false) Long generoId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size,
            @RequestParam(name = "sort", required = false) String sort) {
        return catalogoService.listarJuegos(q, generoId, page, size, sort);
    }

    @GetMapping("/juegos/{id}")
    public JuegoResponse juego(@PathVariable("id") Long id) {
        return catalogoService.detalleJuego(id);
    }

    @GetMapping("/generos")
    public List<GeneroResponse> generos() {
        return catalogoService.listarGeneros();
    }

    @GetMapping("/plataformas")
    public List<PlataformaResponse> plataformas() {
        return catalogoService.listarPlataformas();
    }
}
