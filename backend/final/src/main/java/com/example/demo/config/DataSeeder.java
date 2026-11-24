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
import java.util.HashSet;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String EMAIL_USUARIO = "usuario@pixelvault.com";
    private static final String EMAIL_MODERADOR = "moderador@pixelvault.com";

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;
    private final PlataformaRepository plataformaRepository;
    private final BibliotecaItemRepository bibliotecaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbc;
    private final String adminPassword;
    private final String moderadorPassword;
    private final String usuarioPassword;
    private final boolean bibliotecaDemo;

    private final Set<String> nuevos = new HashSet<>();

    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      JuegoRepository juegoRepository, PlataformaRepository plataformaRepository,
                      BibliotecaItemRepository bibliotecaRepository,
                      PasswordEncoder passwordEncoder,
                      JdbcTemplate jdbc,
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
        this.jdbc = jdbc;
        this.adminPassword = adminPassword;
        this.moderadorPassword = moderadorPassword;
        this.usuarioPassword = usuarioPassword;
        this.bibliotecaDemo = bibliotecaDemo;
    }

    @Override
    public void run(ApplicationArguments args) {
        crear("ADMIN", "admin", "admin@pixelvault.com", adminPassword);
        crear("MODERADOR", "moderador", EMAIL_MODERADOR, moderadorPassword);
        crear("USUARIO", "usuario", EMAIL_USUARIO, usuarioPassword);
        sembrarBiblioteca();
        sembrarJugadoresDemo();
    }

    private void crear(String nombreRol, String username, String email, String password) {
        if (password == null || password.isBlank()) {
            log.warn("No hay contrasena definida para {}; el usuario de prueba no se crea.", email);
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
        log.info("Biblioteca de demostracion creada para {}: {} juegos", EMAIL_USUARIO, creadas);
    }

    private void sembrarJugadoresDemo() {
        if (!bibliotecaDemo || usuarioPassword == null || usuarioPassword.isBlank()) {
            return;
        }
        try {
            for (int i = 1; i <= 8; i++) {
                String nombre = String.format("jugador%02d", i);
                String email = nombre + "@pixelvault.com";
                crear("USUARIO", nombre, email, usuarioPassword);
                Usuario u = usuarioRepository.findByEmail(email).orElse(null);
                if (u != null && bibliotecaRepository.countByUsuarioId(u.getId()) == 0) {
                    nuevos.add(email);
                }
            }

            lib("jugador01", 1245620, "PC", EstadoJuego.JUGANDO, "85.0", 1, 5);
            lib("jugador01", 1086940, "PC", EstadoJuego.JUGANDO, "40.5", 3, 5);
            lib("jugador01", 292030, "PlayStation 5", EstadoJuego.COMPLETADO, "110.0", 45, 5);
            lib("jugador01", 632470, "PC", EstadoJuego.ABANDONADO, "6.0", 150, 2);
            lib("jugador01", 646570, "Steam Deck", EstadoJuego.COMPLETADO, "30.2", 20, 4);

            lib("jugador02", 367520, "Nintendo Switch", EstadoJuego.COMPLETADO, "52.0", 10, 5);
            lib("jugador02", 504230, "Nintendo Switch", EstadoJuego.COMPLETADO, "18.5", 25, 5);
            lib("jugador02", 268910, "Nintendo Switch", EstadoJuego.JUGANDO, "8.0", 2, 4);
            lib("jugador02", 413150, "Nintendo Switch", EstadoJuego.JUGANDO, "95.0", 1, 5);
            lib("jugador02", 391540, "Nintendo Switch", EstadoJuego.COMPLETADO, "9.1", 70, 4);

            lib("jugador03", 620, "PC", EstadoJuego.COMPLETADO, "11.4", 200, 5);
            lib("jugador03", 753640, "PC", EstadoJuego.COMPLETADO, "22.0", 35, 5);
            lib("jugador03", 105600, "PC", EstadoJuego.JUGANDO, "210.0", 1, 4);
            lib("jugador03", 588650, "PC", EstadoJuego.ABANDONADO, "12.3", 80, 3);
            lib("jugador03", 1145360, "PC", EstadoJuego.COMPLETADO, "55.5", 15, 5);

            lib("jugador04", 1245620, "Xbox Series X/S", EstadoJuego.COMPLETADO, "130.0", 18, 5);
            lib("jugador04", 292030, "Xbox Series X/S", EstadoJuego.ABANDONADO, "20.0", 100, 3);
            lib("jugador04", 1086940, "Xbox Series X/S", EstadoJuego.JUGANDO, "15.0", 4, 4);
            lib("jugador04", 268910, "Xbox Series X/S", EstadoJuego.COMPLETADO, "10.5", 60, 4);
            lib("jugador04", 646570, "Xbox Series X/S", EstadoJuego.JUGANDO, "7.7", 6, null);

            lib("jugador05", 413150, "Steam Deck", EstadoJuego.COMPLETADO, "140.0", 9, 5);
            lib("jugador05", 367520, "Steam Deck", EstadoJuego.JUGANDO, "30.0", 2, 5);
            lib("jugador05", 504230, "Steam Deck", EstadoJuego.COMPLETADO, "12.0", 40, 4);
            lib("jugador05", 753640, "Steam Deck", EstadoJuego.ABANDONADO, "4.0", 110, 2);
            lib("jugador05", 632470, "Steam Deck", EstadoJuego.JUGANDO, "14.0", 5, 4);

            lib("jugador06", 1145360, "PlayStation 5", EstadoJuego.COMPLETADO, "70.0", 22, 5);
            lib("jugador06", 588650, "PlayStation 5", EstadoJuego.COMPLETADO, "35.0", 33, 4);
            lib("jugador06", 391540, "PlayStation 5", EstadoJuego.COMPLETADO, "8.0", 120, 5);
            lib("jugador06", 620, "PlayStation 5", EstadoJuego.ABANDONADO, "2.5", 300, 2);
            lib("jugador06", 1245620, "PlayStation 5", EstadoJuego.JUGANDO, "60.0", 1, 5);

            lib("jugador07", 646570, "PC", EstadoJuego.COMPLETADO, "75.0", 12, 5);
            lib("jugador07", 1086940, "PC", EstadoJuego.COMPLETADO, "150.0", 28, 5);
            lib("jugador07", 105600, "PC", EstadoJuego.ABANDONADO, "18.0", 90, 3);
            lib("jugador07", 292030, "PC", EstadoJuego.JUGANDO, "45.0", 3, 5);
            lib("jugador07", 367520, "PC", EstadoJuego.COMPLETADO, "40.0", 50, 4);

            lib("jugador08", 753640, "PC", EstadoJuego.JUGANDO, "9.0", 2, 5);
            lib("jugador08", 632470, "PC", EstadoJuego.COMPLETADO, "28.0", 65, 5);
            lib("jugador08", 413150, "PC", EstadoJuego.ABANDONADO, "5.0", 140, 3);
            lib("jugador08", 504230, "PC", EstadoJuego.JUGANDO, "6.5", 7, 4);
            lib("jugador08", 268910, "PC", EstadoJuego.ABANDONADO, "4.0", 180, 2);

            sembrarResenas();
            log.info("Jugadores de demostracion listos (jugador01..jugador08).");
        } catch (RuntimeException e) {
            log.warn("No se pudieron sembrar los jugadores de demostracion: {}", e.getMessage());
        }
    }

    private void lib(String nombre, int steamAppId, String plataforma, EstadoJuego estado,
                     String horas, int diasAtras, Integer puntuacion) {
        String email = nombre + "@pixelvault.com";
        if (!nuevos.contains(email)) {
            return;
        }
        Usuario u = usuarioRepository.findByEmail(email).orElse(null);
        if (u != null) {
            agregar(u, steamAppId, plataforma, estado, horas, diasAtras, puntuacion);
        }
    }

    private void sembrarResenas() {
        resena(EMAIL_USUARIO, 367520, "Una obra maestra del género. El mundo de Hallownest se siente enorme y cada rincón guarda algo.", false, "PUBLICA");
        resena(EMAIL_USUARIO, 1145360, "Cada intento se siente distinto y la historia avanza con cada muerte. Muy adictivo.", false, "PUBLICA");
        resena(EMAIL_USUARIO, 105600, "Lo dejé a medias, se me hizo muy largo. Quizá lo retome.", false, "PRIVADA");
        resena("jugador01@pixelvault.com", 1245620, "Explorar el mundo abierto es un placer, aunque algunos jefes son brutales.", false, "PUBLICA");
        resena("jugador01@pixelvault.com", 632470, "Muy buena escritura, pero no logré engancharme con el ritmo.", false, "PUBLICA");
        resena("jugador02@pixelvault.com", 504230, "Difícil pero justo. El final de la montaña me emocionó mucho.", true, "PUBLICA");
        resena("jugador02@pixelvault.com", 413150, "Perfecto para relajarse en la portátil. Ya perdí la cuenta de las horas.", false, "PUBLICA");
        resena("jugador03@pixelvault.com", 753640, "Mejor no saber nada antes de jugarlo. Descubrir el misterio vale totalmente la pena.", true, "PUBLICA");
        resena("jugador03@pixelvault.com", 620, "Los acertijos con portales son geniales y el humor es excelente.", false, "PUBLICA");
        resena("jugador04@pixelvault.com", 292030, "Me cansó la cantidad de misiones secundarias.", false, "PRIVADA");
        resena("jugador05@pixelvault.com", 413150, "Mi juego de cabecera. Cada estación trae algo nuevo que hacer.", false, "PUBLICA");
        resena("jugador06@pixelvault.com", 391540, "Corto, pero cada decisión importa. Recomendado jugarlo dos veces.", true, "PUBLICA");
        resena("jugador07@pixelvault.com", 646570, "Construir un mazo que funcione es muy satisfactorio.", false, "PUBLICA");
        resena("jugador07@pixelvault.com", 1086940, "Las decisiones tienen peso real en la historia. Una joya.", false, "PUBLICA");
        resena("jugador08@pixelvault.com", 632470, "Un RPG distinto a todo lo demás: puro diálogo y personajes memorables.", false, "PUBLICA");

        String ofensiva = "jugador08@pixelvault.com";
        resena(ofensiva, 268910, "Contenido de prueba que fue ocultado por moderación.", false, "PUBLICA");
        ocultar(ofensiva, 268910, "Contenido inapropiado (reseña de demostración)");
    }

    private void resena(String email, int steamAppId, String texto, boolean spoilers, String visibilidad) {
        Usuario u = usuarioRepository.findByEmail(email).orElse(null);
        if (u == null) {
            return;
        }
        jdbc.update("""
                INSERT INTO resenas (biblioteca_item_id, texto, contiene_spoilers, visibilidad, oculta)
                SELECT b.id, ?, ?, ?, 0
                FROM biblioteca_items b
                JOIN juegos j ON j.id = b.juego_id
                WHERE b.usuario_id = ? AND j.steam_app_id = ?
                  AND NOT EXISTS (SELECT 1 FROM resenas r WHERE r.biblioteca_item_id = b.id)
                """, texto, spoilers, visibilidad, u.getId(), steamAppId);
    }

    private void ocultar(String email, int steamAppId, String motivo) {
        Usuario autor = usuarioRepository.findByEmail(email).orElse(null);
        Usuario moderador = usuarioRepository.findByEmail(EMAIL_MODERADOR).orElse(null);
        if (autor == null || moderador == null) {
            return;
        }
        jdbc.update("""
                UPDATE resenas r
                JOIN biblioteca_items b ON b.id = r.biblioteca_item_id
                JOIN juegos j ON j.id = b.juego_id
                SET r.oculta = 1, r.moderada_por = ?, r.moderada_en = NOW(), r.motivo_moderacion = ?
                WHERE b.usuario_id = ? AND j.steam_app_id = ? AND r.oculta = 0
                """, moderador.getId(), motivo, autor.getId(), steamAppId);
    }

    private int agregar(Usuario usuario, int steamAppId, String nombrePlataforma, EstadoJuego estado,
                        String horas, int diasAtras, Integer puntuacion) {
        Juego juego = juegoRepository.findBySteamAppId(steamAppId).orElse(null);
        Plataforma plataforma = plataformaRepository.findByNombre(nombrePlataforma).orElse(null);
        if (juego == null || plataforma == null) {
            log.warn("Biblioteca de demostracion: falta el juego {} o la plataforma {}; se omite.",
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
