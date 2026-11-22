package com.example.demo.controller;

import com.example.demo.dto.BibliotecaActualizarRequest;
import com.example.demo.dto.BibliotecaCrearRequest;
import com.example.demo.dto.BibliotecaItemResponse;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResumenBibliotecaResponse;
import com.example.demo.model.EstadoJuego;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.BibliotecaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/biblioteca")
public class BibliotecaController {

    private final BibliotecaService bibliotecaService;

    public BibliotecaController(BibliotecaService bibliotecaService) {
        this.bibliotecaService = bibliotecaService;
    }

    @GetMapping
    public PageResponse<BibliotecaItemResponse> listar(
            @AuthenticationPrincipal UsuarioAutenticado usuario,
            @RequestParam(name = "estado", required = false) EstadoJuego estado,
            @RequestParam(name = "plataformaId", required = false) Long plataformaId,
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size,
            @RequestParam(name = "sort", required = false) String sort) {
        return bibliotecaService.listar(usuario.id(), estado, plataformaId, q, page, size, sort);
    }

    @GetMapping("/resumen")
    public ResumenBibliotecaResponse resumen(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return bibliotecaService.resumen(usuario.id());
    }

    @GetMapping("/{id}")
    public BibliotecaItemResponse detalle(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                          @PathVariable("id") Long id) {
        return bibliotecaService.detalle(usuario.id(), id);
    }

    @PostMapping
    public ResponseEntity<BibliotecaItemResponse> agregar(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                                          @Valid @RequestBody BibliotecaCrearRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bibliotecaService.agregar(usuario.id(), request));
    }

    @PutMapping("/{id}")
    public BibliotecaItemResponse actualizar(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                             @PathVariable("id") Long id,
                                             @Valid @RequestBody BibliotecaActualizarRequest request) {
        return bibliotecaService.actualizar(usuario.id(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> quitar(@AuthenticationPrincipal UsuarioAutenticado usuario,
                                       @PathVariable("id") Long id) {
        bibliotecaService.quitar(usuario.id(), id);
        return ResponseEntity.noContent().build();
    }
}
