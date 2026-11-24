package com.example.demo.repository;

import com.example.demo.model.*;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    Optional<Resena> findByBibliotecaItemId(Long bibliotecaItemId);

    @Query("select r.bibliotecaItem.id from Resena r where r.bibliotecaItem.id in :ids")
    List<Long> idsConResena(@Param("ids") Collection<Long> ids);

    @Query(value = "select r from Resena r join fetch r.bibliotecaItem b join fetch b.usuario u "
            + "join fetch b.plataforma p where b.juego.id = :juegoId and r.visibilidad = :vis "
            + "and r.oculta = false and u.activo = true",
            countQuery = "select count(r) from Resena r where r.bibliotecaItem.juego.id = :juegoId "
            + "and r.visibilidad = :vis and r.oculta = false and r.bibliotecaItem.usuario.activo = true")
    Page<Resena> publicasDeJuego(@Param("juegoId") Long juegoId, @Param("vis") Visibilidad vis,
                                 Pageable pageable);

    @Query(value = "select r from Resena r join fetch r.bibliotecaItem b join fetch b.usuario u "
            + "join fetch b.juego j left join fetch r.moderadaPor m where r.visibilidad = :vis "
            + "and (:oculta is null or r.oculta = :oculta) "
            + "and (:q is null or lower(r.texto) like :q escape '!' or lower(u.username) like :q escape '!' "
            + "or lower(j.titulo) like :q escape '!')",
            countQuery = "select count(r) from Resena r where r.visibilidad = :vis "
            + "and (:oculta is null or r.oculta = :oculta) "
            + "and (:q is null or lower(r.texto) like :q escape '!' "
            + "or lower(r.bibliotecaItem.usuario.username) like :q escape '!' "
            + "or lower(r.bibliotecaItem.juego.titulo) like :q escape '!')")
    Page<Resena> moderacion(@Param("vis") Visibilidad vis, @Param("oculta") Boolean oculta,
                            @Param("q") String q, Pageable pageable);
}
