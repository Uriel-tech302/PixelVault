package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.Rol;
import com.example.demo.model.TokenRevocado;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.TokenRevocadoRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.JwtService;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenRevocadoRepository tokenRevocadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                       TokenRevocadoRepository tokenRevocadoRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.tokenRevocadoRepository = tokenRevocadoRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public UsuarioResponse registrar(RegisterRequest request) {
        String email = normalizar(request.email());
        String username = request.username().trim();

        if (usuarioRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "El correo ya está registrado.",
                    Map.of("email", "Este correo ya está registrado."));
        }
        if (usuarioRepository.existsByUsername(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "El nombre de usuario ya está en uso.",
                    Map.of("username", "Este nombre de usuario ya está en uso."));
        }

        Rol rol = rolRepository.findByNombre("USUARIO")
                .orElseThrow(() -> new IllegalStateException("Falta el rol USUARIO en la base de datos"));

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        return aResponse(usuario);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = normalizar(request.email());

        // Lanza AuthenticationException (401) si el correo o la contrasena no coinciden
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        JwtService.TokenGenerado token = jwtService.generar(usuario, Boolean.TRUE.equals(request.recordarme()));
        return new LoginResponse(token.token(), "Bearer", token.expiraEn().toString(), aResponse(usuario));
    }

    @Transactional
    public void logout(String jti, Instant tokenExpiraEn) {
        if (!tokenRevocadoRepository.existsByJti(jti)) {
            TokenRevocado revocado = new TokenRevocado();
            revocado.setJti(jti);
            revocado.setExpiraEn(LocalDateTime.ofInstant(tokenExpiraEn, ZoneOffset.UTC));
            tokenRevocadoRepository.save(revocado);
        }
    }

    private String normalizar(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private UsuarioResponse aResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRol().getNombre());
    }
}
