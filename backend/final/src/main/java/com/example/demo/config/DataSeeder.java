package com.example.demo.config;

import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.EstadoJuego;
import com.example.demo.model.Juego;
import com.example.demo.model.Plataforma;
import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.BibliotecaItemRepository;
import com.example.demo.repository.JuegoRepository;
import com.example.demo.repository.PlataformaRepository;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String EMAIL_USUARIO = "usuario@pixelvault.com";

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;
    private final PlataformaRepository plataformaRepository;
    private final BibliotecaItemRepository bibliotecaRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;
    private final String moderadorPassword;
    private final String usuarioPassword;
    private final boolean bibliotecaDemo;

    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      JuegoRepository juegoRepository, PlataformaRepository plataformaRepository,
                      BibliotecaItemRepository bibliotecaRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${app.seed.admin-password:}") String adminPassword,
                      @Value("${app.seed.moderador-password:}") String moderadorPassword,
                      @Value("${app.seed.usuario-password:}") String usuarioPassword,
                      @Value("${app.seed.biblioteca-demo:true}") boolean bibliotecaDemo) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.juegoRepository = juegoRepository;
        this.plataformaRepository = plataformaRepository;
        this.bibliotecaRepository = bibliotecaRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
        this.moderadorPassword = moderadorPassword;
        this.usuarioPassword = usuarioPassword;
        this.bibliotecaDemo = bibliotecaDemo;
    }

    @Override
    public void run(ApplicationArguments args) {
        crear("ADMIN", "admin", "admin@pixelvault.com", adminPassword);
        crear("MODERADOR", "moderador", "moderador@pixelvault.com", moderadorPassword);
        crear("USUARIO", "usuario", EMAIL_USUARIO, usuarioPassword);
        sembrarBiblioteca();
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

    private void sembrarBiblioteca() {
        if (!bibliotecaDemo) {
            return;
        }
        Usuario usuario = usuarioRepository.findByEmail(EMAIL_USUARIO).orElse(null);
        if (usuario == null || bibliotecaRepository.countByUsuarioId(usuario.getId()) > 0) {
            return;
        }

        int creadas = 0;
        creadas += agregar(usuario, 367520, "PC", EstadoJuego.COMPLETADO, "48.2", 4, 5);      // Hollow Knight
        creadas += agregar(usuario, 413150, "PC", EstadoJuego.JUGANDO, "120.5", 1, 5);        // Stardew Valley
        creadas += agregar(usuario, 1145360, "PC", EstadoJuego.COMPLETADO, "62.0", 12, 5);    // Hades
        creadas += agregar(usuario, 504230, "Steam Deck", EstadoJuego.COMPLETADO, "14.3", 30, 4); // Celeste
        creadas += agregar(usuario, 588650, "Steam Deck", EstadoJuego.JUGANDO, "21.7", 2, 4); // Dead Cells
        creadas += agregar(usuario, 105600, "PC", EstadoJuego.ABANDONADO, "9.5", 60, 3);      // Terraria
        creadas += agregar(usuario, 391540, "PC", EstadoJuego.COMPLETADO, "7.8", 90, 5);      // Undertale
        creadas += agregar(usuario, 268910, "PlayStation 5", EstadoJuego.ABANDONADO, "3.2", 120, null); // Cuphead
        log.info("Biblioteca de demostración creada para {}: {} juegos", EMAIL_USUARIO, creadas);
    }

    private int agregar(Usuario usuario, int steamAppId, String nombrePlataforma, EstadoJuego estado,
                        String horas, int diasAtras, Integer puntuacion) {
        Juego juego = juegoRepository.findBySteamAppId(steamAppId).orElse(null);
        Plataforma plataforma = plataformaRepository.findByNombre(nombrePlataforma).orElse(null);
        if (juego == null || plataforma == null) {
            log.warn("Biblioteca de demostración: falta el juego {} o la plataforma {}; se omite.",
                    steamAppId, nombrePlataforma);
            return 0;
        }

        BibliotecaItem item = new BibliotecaItem();
        item.setUsuario(usuario);
        item.setJuego(juego);
        item.setPlataforma(plataforma);
        item.setEstado(estado);
        item.setHorasJugadas(new BigDecimal(horas));
        item.setUltimaSesion(LocalDate.now().minusDays(diasAtras));
        item.setPuntuacion(puntuacion == null ? null : Byte.valueOf(puntuacion.byteValue()));
        bibliotecaRepository.save(item);
        return 1;
    }
}
