package com.example.demo.repository;

import com.example.demo.model.Usuario;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findByEmail(String email);

    @EntityGraph(attributePaths = "rol")
    Optional<Usuario> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
    @EntityGraph(attributePaths = "rol")
    @Query("select u from Usuario u where (:rol is null or u.rol.nombre = :rol) "
            + "and (:activo is null or u.activo = :activo) "
            + "and (:q is null or lower(u.username) like :q escape '!' or lower(u.email) like :q escape '!')")
    Page<Usuario> buscarAdmin(@Param("rol") String rol, @Param("activo") Boolean activo,
                              @Param("q") String q, Pageable pageable);
}
