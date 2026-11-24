package com.example.demo.repository;

import com.example.demo.model.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BibliotecaItemRepository extends JpaRepository<BibliotecaItem, Long> {

    Page<BibliotecaItem> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<BibliotecaItem> findByUsuarioIdAndEstado(Long usuarioId, EstadoJuego estado, Pageable pageable);

    Optional<BibliotecaItem> findByIdAndUsuarioId(Long id, Long usuarioId);

    boolean existsByUsuarioIdAndJuegoIdAndPlataformaId(Long usuarioId, Long juegoId, Long plataformaId);

    boolean existsByJuegoId(Long juegoId);

    long countByUsuarioId(Long usuarioId);

    @Query("select b from BibliotecaItem b join fetch b.juego join fetch b.plataforma "
            + "where b.id = :id and b.usuario.id = :usuarioId")
    Optional<BibliotecaItem> detalle(@Param("id") Long id, @Param("usuarioId") Long usuarioId);

    @Query("select b.estado, count(b), sum(b.horasJugadas) from BibliotecaItem b "
            + "where b.usuario.id = :usuarioId group by b.estado")
    List<Object[]> resumenPorEstado(@Param("usuarioId") Long usuarioId);

    @Query("select b from BibliotecaItem b join fetch b.juego "
            + "where b.usuario.id = :usuarioId and b.plataforma.id = :plataformaId")
    List<BibliotecaItem> porUsuarioYPlataforma(@Param("usuarioId") Long usuarioId,
                                               @Param("plataformaId") Long plataformaId);
}
