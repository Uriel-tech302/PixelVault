package com.example.demo.controller;

import com.example.demo.dto.CodigoSolicitudRequest;
import com.example.demo.dto.CodigoVerificarRequest;
import com.example.demo.dto.MensajeResponse;
import com.example.demo.dto.PasswordCambioRequest;
import com.example.demo.dto.PerfilRequest;
import com.example.demo.dto.PerfilResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService service;

    public PerfilController(PerfilService service) {
        this.service = service;
    }

    @GetMapping
    public PerfilResponse obtener(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.obtener(usuario.id());
    }

    @PutMapping
    public PerfilResponse actualizar(@Valid @RequestBody PerfilRequest request,
                                     @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.actualizar(usuario.id(), request);
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> cambiarPassword(@Valid @RequestBody PasswordCambioRequest request,
                                                @AuthenticationPrincipal UsuarioAutenticado usuario) {
        service.cambiarPassword(usuario.id(), request.passwordActual(), request.passwordNueva());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/telefono/codigo")
    public MensajeResponse solicitarCodigo(@Valid @RequestBody CodigoSolicitudRequest request,
                                           @AuthenticationPrincipal UsuarioAutenticado usuario) {
        service.solicitarCodigo(usuario.id(), request.canal());
        return new MensajeResponse("Te enviamos un código de 6 dígitos. Vence en 10 minutos.");
    }

    @PostMapping("/telefono/verificar")
    public PerfilResponse verificarTelefono(@Valid @RequestBody CodigoVerificarRequest request,
                                            @AuthenticationPrincipal UsuarioAutenticado usuario) {
        return service.verificarTelefono(usuario.id(), request.codigo());
    }
}
