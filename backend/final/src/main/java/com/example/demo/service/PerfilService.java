package com.example.demo.service;

import com.example.demo.dto.PerfilRequest;
import com.example.demo.dto.PerfilResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.CodigoVerificacion;
import com.example.demo.model.Usuario;
import com.example.demo.repository.CodigoVerificacionRepository;
import com.example.demo.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PerfilService {

    private static final String PROPOSITO = "VERIFICAR_TELEFONO";
    private static final long MINUTOS_VIGENCIA = 10;
    private static final long SEGUNDOS_ENTRE_CODIGOS = 60;
    private static final int MAX_INTENTOS = 5;

    private final SecureRandom random = new SecureRandom();
    private final UsuarioRepository usuarioRepository;
    private final CodigoVerificacionRepository codigoRepository;
    private final PasswordEncoder passwordEncoder;
    private final MensajeriaService mensajeria;

    public PerfilService(UsuarioRepository usuarioRepository, CodigoVerificacionRepository codigoRepository,
                         PasswordEncoder passwordEncoder, MensajeriaService mensajeria) {
        this.usuarioRepository = usuarioRepository;
        this.codigoRepository = codigoRepository;
        this.passwordEncoder = passwordEncoder;
        this.mensajeria = mensajeria;
    }

    @Transactional(readOnly = true)
    public PerfilResponse obtener(Long usuarioId) {
        return aResponse(buscar(usuarioId));
    }

    @Transactional
    public PerfilResponse actualizar(Long usuarioId, PerfilRequest r) {
        Usuario usuario = buscar(usuarioId);

        String username = r.username().trim();
        if (!username.equalsIgnoreCase(usuario.getUsername()) && usuarioRepository.existsByUsername(username)) {
            throw new ApiException(HttpStatus.CONFLICT, "El nombre de usuario ya está en uso.",
                    Map.of("username", "Este nombre de usuario ya está en uso."));
        }
        usuario.setUsername(username);
        usuario.setAvatarUrl(vacio(r.avatarUrl()) ? null : r.avatarUrl().trim());

        String telefono = vacio(r.telefono()) ? null : r.telefono().trim();
        if (!Objects.equals(telefono, usuario.getTelefono())) {
            usuario.setTelefono(telefono);
            usuario.setTelefonoVerificado(false);
            codigoRepository.invalidarPendientes(usuario.getId(), PROPOSITO);
        }

        usuarioRepository.save(usuario);
        return aResponse(usuario);
    }

    @Transactional
    public void cambiarPassword(Long usuarioId, String actual, String nueva) {
        Usuario usuario = buscar(usuarioId);
        // 400 y no 401: un 401 haria que el frontend cierre la sesion
        if (!passwordEncoder.matches(actual, usuario.getPasswordHash())) {
            throw invalido("passwordActual", "La contraseña actual no es correcta.");
        }
        if (passwordEncoder.matches(nueva, usuario.getPasswordHash())) {
            throw invalido("passwordNueva", "La contraseña nueva debe ser distinta de la actual.");
        }
        usuario.setPasswordHash(passwordEncoder.encode(nueva));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void solicitarCodigo(Long usuarioId, String canal) {
        Usuario usuario = buscar(usuarioId);
        if (usuario.getTelefono() == null) {
            throw invalido("telefono", "Primero registra un teléfono en tu perfil.");
        }
        if (usuario.isTelefonoVerificado()) {
            throw new ApiException(HttpStatus.CONFLICT, "Tu teléfono ya está verificado.");
        }

        Optional<CodigoVerificacion> ultimo = codigoRepository
                .findFirstByUsuarioIdAndPropositoOrderByCreatedAtDescIdDesc(usuarioId, PROPOSITO);
        if (ultimo.isPresent() && ultimo.get().getCreatedAt() != null
                && ultimo.get().getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(SEGUNDOS_ENTRE_CODIGOS))) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Espera un minuto antes de pedir otro código.");
        }

        codigoRepository.invalidarPendientes(usuarioId, PROPOSITO);

        String codigo = String.format("%06d", random.nextInt(1_000_000));
        CodigoVerificacion entidad = new CodigoVerificacion();
        entidad.setUsuario(usuario);
        entidad.setCanal(canal);
        entidad.setProposito(PROPOSITO);
        entidad.setCodigoHash(hash(codigo));
        entidad.setExpiraEn(LocalDateTime.now().plusMinutes(MINUTOS_VIGENCIA));
        codigoRepository.save(entidad);

        mensajeria.enviarCodigo(usuario.getTelefono(), canal, codigo);
    }

    @Transactional(noRollbackFor = ApiException.class)
    public PerfilResponse verificarTelefono(Long usuarioId, String codigo) {
        Usuario usuario = buscar(usuarioId);
        CodigoVerificacion entidad = codigoRepository
                .findFirstByUsuarioIdAndPropositoAndUsadoFalseOrderByCreatedAtDescIdDesc(usuarioId, PROPOSITO)
                .filter(c -> c.getExpiraEn().isAfter(LocalDateTime.now()))
                .orElseThrow(this::codigoInvalido);

        if (entidad.getIntentos() >= MAX_INTENTOS) {
            entidad.setUsado(true);
            throw codigoInvalido();
        }

        boolean correcto = MessageDigest.isEqual(
                hash(codigo.trim()).getBytes(StandardCharsets.UTF_8),
                entidad.getCodigoHash().getBytes(StandardCharsets.UTF_8));
        if (!correcto) {
            entidad.setIntentos((byte) (entidad.getIntentos() + 1));
            if (entidad.getIntentos() >= MAX_INTENTOS) {
                entidad.setUsado(true);
            }
            throw invalido("codigo", "Código incorrecto.");
        }

        entidad.setUsado(true);
        usuario.setTelefonoVerificado(true);
        usuarioRepository.save(usuario);
        return aResponse(usuario);
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private PerfilResponse aResponse(Usuario u) {
        return new PerfilResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRol().getNombre(),
                u.getTelefono(), u.isTelefonoVerificado(), u.getAvatarUrl(), u.getSteamId(),
                String.valueOf(u.getCreatedAt()));
    }

    private ApiException codigoInvalido() {
        return invalido("codigo", "El código no es válido o ya venció. Solicita uno nuevo.");
    }

    private ApiException invalido(String campo, String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "Datos inválidos.", Map.of(campo, mensaje));
    }

    private boolean vacio(String s) {
        return s == null || s.isBlank();
    }

    private String hash(String valor) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(valor.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
