package com.example.demo.controller;

import com.example.demo.dto.JuegoRequest;
import com.example.demo.dto.JuegoResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.JuegoAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/juegos")
public class JuegoAdminController {

    private final JuegoAdminService juegoAdminService;

    public JuegoAdminController(JuegoAdminService juegoAdminService) {
        this.juegoAdminService = juegoAdminService;
    }

    @PostMapping
    public ResponseEntity<JuegoResponse> crear(@AuthenticationPrincipal UsuarioAutenticado admin,
                                               @Valid @RequestBody JuegoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(juegoAdminService.crear(admin.id(), request));
    }

    @PutMapping("/{id}")
    public JuegoResponse actualizar(@PathVariable("id") Long id, @Valid @RequestBody JuegoRequest request) {
        return juegoAdminService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        juegoAdminService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
