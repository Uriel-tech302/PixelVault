package com.example.demo.service;

import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.JwtService;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Service
public class GoogleAuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RestClient restClient;
    private final String googleClientId;

    public GoogleAuthService(UsuarioRepository usuarioRepository,
                             RolRepository rolRepository,
                             PasswordEncoder passwordEncoder,
                             JwtService jwtService,
                             @Value("${GOOGLE_CLIENT_ID:}") String googleClientId) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.restClient = RestClient.create();
        this.googleClientId = googleClientId.trim();
    }

    @Transactional
    public LoginResponse loginConGoogle(String idToken) {
        if (googleClientId.isEmpty()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "El inicio de sesión con Google no está configurado en el servidor.");
        }

        GoogleTokenInfo payload = verificarTokenGoogle(idToken);
        if (payload == null || !googleClientId.equals(payload.aud())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "El token de Google no corresponde a esta aplicación.");
        }

        if (!"true".equalsIgnoreCase(payload.email_verified())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Tu cuenta de Google no tiene el correo verificado.");
        }

        String email = payload.email() != null ? payload.email().trim().toLowerCase(Locale.ROOT) : "";
        if (email.isEmpty()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "No se pudo obtener el correo desde Google.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> crearUsuarioDesdeGoogle(email, payload.name(), payload.picture()));

        if (!usuario.isActivo()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Tu cuenta está desactivada. Contacta al administrador.");
        }

        JwtService.TokenGenerado token = jwtService.generar(usuario, true);
        UsuarioResponse userDto = new UsuarioResponse(
                usuario.getId(), usuario.getUsername(), usuario.getEmail(), usuario.getRol().getNombre());

        return new LoginResponse(token.token(), "Bearer", token.expiraEn().toString(), userDto);
    }

    private Usuario crearUsuarioDesdeGoogle(String email, String name, String picture) {
        Rol rol = rolRepository.findByNombre("USUARIO")
                .orElseThrow(() -> new IllegalStateException("Falta el rol USUARIO en la base de datos"));

        Usuario nuevo = new Usuario();
        nuevo.setEmail(email);
        nuevo.setUsername(generarUsernameUnico(email, name));
        nuevo.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString() + "A1!"));
        if (picture != null && !picture.isBlank()) {
            nuevo.setAvatarUrl(picture.length() > 255 ? picture.substring(0, 255) : picture);
        }
        nuevo.setRol(rol);
        nuevo.setActivo(true);
        return usuarioRepository.save(nuevo);
    }

    private String generarUsernameUnico(String email, String name) {
        String base = (name != null && !name.isBlank() ? name : email.substring(0, email.indexOf('@')))
                .replaceAll("[^A-Za-z0-9_.-]", "");
        if (base.length() < 3) {
            base = "jugador";
        }
        if (base.length() > 24) {
            base = base.substring(0, 24);
        }

        String candidato = base;
        int sufijo = 1;
        while (usuarioRepository.existsByUsername(candidato)) {
            candidato = base + sufijo++;
        }
        return candidato;
    }

    private GoogleTokenInfo verificarTokenGoogle(String idToken) {
        try {
            return restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={token}", idToken)
                    .retrieve()
                    .body(GoogleTokenInfo.class);
        } catch (RestClientResponseException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Token de Google inválido o expirado.");
        } catch (RestClientException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "No se pudo verificar el token con Google.");
        }
    }

    private record GoogleTokenInfo(
            String aud,
            String email,
            String email_verified,
            String name,
            String picture) {
    }
}