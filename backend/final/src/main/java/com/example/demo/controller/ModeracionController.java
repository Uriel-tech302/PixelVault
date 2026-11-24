package com.example.demo.controller;

import com.example.demo.dto.OcultarRequest;
import com.example.demo.dto.PageResponse;
import com.example.demo.dto.ResenaModeracionResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** ADMIN y MODERADOR (la regla esta en SecurityConfig: /api/moderacion/**). */
@RestController
@RequestMapping("/api/moderacion/resenas")
public class ModeracionController {

    private final ResenaService service;

    public ModeracionController(ResenaService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<ResenaModeracionResponse> listar(@RequestParam(required = false) String oculta,
                                                         @RequestParam(required = false) String q,
                                                         @RequestParam(required = false) String page,
                                                         @RequestParam(required = false) String size) {
        return service.listarModeracion(oculta, q, page, size);
    }

    @PatchMapping("/{id}/ocultar")
    public ResenaModeracionResponse ocultar(@PathVariable Long id,
                                            @Valid @RequestBody OcultarRequest request,
                                            @AuthenticationPrincipal UsuarioAutenticado moderador) {
        return service.ocultar(id, request.motivo(), moderador.id());
    }

    @PatchMapping("/{id}/mostrar")
    public ResenaModeracionResponse mostrar(@PathVariable Long id,
                                            @AuthenticationPrincipal UsuarioAutenticado moderador) {
        return service.mostrar(id, moderador.id());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
