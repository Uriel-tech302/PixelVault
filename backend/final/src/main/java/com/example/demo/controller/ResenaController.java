package com.example.demo.controller;

import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResenaPublicaResponse;
import com.example.demo.dto.ResenaRequest;
import com.example.demo.dto.ResenaResumenResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ResenaController {

    private final ResenaService service;

    public ResenaController(ResenaService service) {
        this.service = service;
    }

    /** Crea (201) o edita (200) la resena de una entrada propia de la biblioteca. */
    @PutMapping("/api/biblioteca/{itemId}/resena")
    public ResponseEntity<ResenaResumenResponse> guardar(@PathVariable Long itemId,
                                                         @Valid @RequestBody ResenaRequest request,
                                                         @AuthenticationPrincipal UsuarioAutenticado usuario) {
        ResenaService.Guardada guardada = service.guardar(usuario.id(), itemId, request);
        return ResponseEntity.status(guardada.creada() ? HttpStatus.CREATED : HttpStatus.OK)
                .body(guardada.resena());
    }

    @DeleteMapping("/api/biblioteca/{itemId}/resena")
    public ResponseEntity<Void> quitar(@PathVariable Long itemId,
                                       @AuthenticationPrincipal UsuarioAutenticado usuario) {
        service.quitar(usuario.id(), itemId);
        return ResponseEntity.noContent().build();
    }

    /** Resenas publicas de un juego (cualquier usuario autenticado). */
    @GetMapping("/api/juegos/{juegoId}/resenas")
    public PageResponse<ResenaPublicaResponse> publicas(@PathVariable Long juegoId,
                                                        @RequestParam(required = false) String page,
                                                        @RequestParam(required = false) String size) {
        return service.publicasDeJuego(juegoId, page, size);
    }
}
