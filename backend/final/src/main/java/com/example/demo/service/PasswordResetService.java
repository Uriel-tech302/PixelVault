package com.example.demo.service;

import com.example.demo.exception.ApiException;
import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.Usuario;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

    private static final long MINUTOS_VIGENCIA = 30;

    private final SecureRandom random = new SecureRandom();
    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final CorreoService correoService;
    private final String frontendUrl;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                CorreoService correoService,
                                @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.correoService = correoService;
        this.frontendUrl = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    @Transactional
    public void solicitar(String emailCrudo) {
        String email = emailCrudo.trim().toLowerCase(Locale.ROOT);
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            tokenRepository.invalidarPendientes(usuario.getId());

            String token = generarToken();
            PasswordResetToken entidad = new PasswordResetToken();
            entidad.setUsuario(usuario);
            entidad.setTokenHash(hash(token));
            entidad.setExpiraEn(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(MINUTOS_VIGENCIA));
            tokenRepository.save(entidad);

            correoService.enviarRecuperacion(usuario.getEmail(),
                    frontendUrl + "/restablecer?token=" + token);
        });
    }

    @Transactional
    public void restablecer(String token, String nuevaPassword) {
        PasswordResetToken entidad = tokenRepository.findByTokenHash(hash(token.trim()))
                .filter(t -> !t.isUsado())
                .filter(t -> t.getExpiraEn().isAfter(LocalDateTime.now(ZoneOffset.UTC)))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST,
                        "El enlace no es válido o ya venció.",
                        Map.of("token", "El enlace no es válido o ya venció. Solicita uno nuevo.")));

        Usuario usuario = entidad.getUsuario();
        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        entidad.setUsado(true);
        tokenRepository.invalidarPendientes(usuario.getId());
    }

    private String generarToken() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
