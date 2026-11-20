package com.example.demo.repository;

import com.example.demo.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Carga el rol junto con el usuario (la relacion es LAZY)
    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findByEmail(String email);

    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
