package com.example.demo.controller;

import com.example.demo.dto.CambiarEstadoRequest;
import com.example.demo.dto.CambiarRolRequest;
import com.example.demo.dto.PaginaUsuariosResponse;
import com.example.demo.dto.UsuarioAdminResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.AdminUsuarioService;
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

/** Solo ADMIN (la regla esta en SecurityConfig: /api/admin/**). */
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioController {

    private final AdminUsuarioService service;

    public AdminUsuarioController(AdminUsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public PaginaUsuariosResponse listar(
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) String activo,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String page,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String sort) {
        return service.listar(rol, activo, q, page, size, sort);
    }

    @PatchMapping("/{id}/rol")
    public UsuarioAdminResponse cambiarRol(@PathVariable Long id,
                                           @Valid @RequestBody CambiarRolRequest request,
                                           @AuthenticationPrincipal UsuarioAutenticado actor) {
        return service.cambiarRol(id, request.rol(), actor.id());
    }

    @PatchMapping("/{id}/estado")
    public UsuarioAdminResponse cambiarEstado(@PathVariable Long id,
                                              @Valid @RequestBody CambiarEstadoRequest request,
                                              @AuthenticationPrincipal UsuarioAutenticado actor) {
        return service.cambiarEstado(id, request.activo(), actor.id());
    }

    /** "Borrar" desactiva la cuenta: conserva su biblioteca y sus resenas. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id,
                                           @AuthenticationPrincipal UsuarioAutenticado actor) {
        service.cambiarEstado(id, false, actor.id());
        return ResponseEntity.noContent().build();
    }
}
