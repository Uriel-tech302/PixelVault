package com.example.demo.repository;

import com.example.demo.model.CodigoVerificacion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, Long> {

    Optional<CodigoVerificacion> findFirstByUsuarioIdAndPropositoOrderByCreatedAtDescIdDesc(
            Long usuarioId, String proposito);

    Optional<CodigoVerificacion> findFirstByUsuarioIdAndPropositoAndUsadoFalseOrderByCreatedAtDescIdDesc(
            Long usuarioId, String proposito);

    @Modifying(flushAutomatically = true)
    @Query("update CodigoVerificacion c set c.usado = true "
            + "where c.usuario.id = :usuarioId and c.proposito = :proposito and c.usado = false")
    int invalidarPendientes(@Param("usuarioId") Long usuarioId, @Param("proposito") String proposito);
}
