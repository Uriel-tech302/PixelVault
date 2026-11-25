package com.example.demo.controller;

import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.MensajeResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.security.UsuarioAutenticado;
import com.example.demo.service.AuthService;
import com.example.demo.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        authService.logout(usuario.jti(), usuario.tokenExpiraEn());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UsuarioResponse me(@AuthenticationPrincipal UsuarioAutenticado usuario) {
        return new UsuarioResponse(usuario.id(), usuario.username(), usuario.email(), usuario.rol());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MensajeResponse> olvideMiPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.solicitar(request.email());
        return ResponseEntity.ok(new MensajeResponse(
                "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MensajeResponse> restablecer(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.restablecer(request.token(), request.password());
        return ResponseEntity.ok(new MensajeResponse("Tu contraseña se actualizó. Ya puedes iniciar sesión."));
    }
}
