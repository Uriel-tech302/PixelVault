package com.example.demo.repository;

import com.example.demo.model.*;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, Long> {

    Optional<CodigoVerificacion> findFirstByUsuarioIdAndPropositoAndUsadoFalseOrderByCreatedAtDesc(
            Long usuarioId, PropositoCodigo proposito);
}
