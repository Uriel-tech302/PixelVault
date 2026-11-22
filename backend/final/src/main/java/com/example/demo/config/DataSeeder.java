package com.example.demo.config;

import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea al arrancar los usuarios de prueba (admin, moderador y usuario) si no existen.
 * Las contrasenas vienen de variables de entorno; si una esta vacia, ese usuario no se crea.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;
    private final String moderadorPassword;
    private final String usuarioPassword;

    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.seed.admin-password:}") String adminPassword,
                      @Value("${app.seed.moderador-password:}") String moderadorPassword,
                      @Value("${app.seed.usuario-password:}") String usuarioPassword) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
        this.moderadorPassword = moderadorPassword;
        this.usuarioPassword = usuarioPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        crear("ADMIN", "admin", "admin@pixelvault.com", adminPassword);
        crear("MODERADOR", "moderador", "moderador@pixelvault.com", moderadorPassword);
        crear("USUARIO", "usuario", "usuario@pixelvault.com", usuarioPassword);
    }

    private void crear(String nombreRol, String username, String email, String password) {
        if (password == null || password.isBlank()) {
            log.warn("No hay contraseña definida para {}; el usuario de prueba no se crea.", email);
            return;
        }
        if (usuarioRepository.existsByEmail(email) || usuarioRepository.existsByUsername(username)) {
            return;
        }
        Rol rol = rolRepository.findByNombre(nombreRol)
                .orElseThrow(() -> new IllegalStateException("Falta el rol " + nombreRol + " en la base de datos"));

        Usuario u = new Usuario();
        u.setUsername(username);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setRol(rol);
        usuarioRepository.save(u);
        log.info("Usuario de prueba creado: {} ({})", email, nombreRol);
    }
}
