package com.example.demo.controller;

import com.example.demo.dto.SteamEstadoResponse;
import com.example.demo.dto.SteamSincronizacionResponse;
import com.example.demo.dto.SteamVincularRequest;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.SteamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SteamController {

    private final SteamService service;

    public SteamController(SteamService service) {
        this.service = service;
    }

    @GetMapping("/api/perfil/steam")
    public SteamEstadoResponse estado(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.estado(usuario.id());
    }

    @PutMapping("/api/perfil/steam")
    public SteamEstadoResponse vincular(@Valid @RequestBody SteamVincularRequest request,
                                        @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.vincular(usuario.id(), request.steam());
    }

    @DeleteMapping("/api/perfil/steam")
    public ResponseEntity<Void> desvincular(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        service.desvincular(usuario.id());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/biblioteca/sincronizar-steam")
    public SteamSincronizacionResponse sincronizar(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.sincronizar(usuario.id());
    }
}
