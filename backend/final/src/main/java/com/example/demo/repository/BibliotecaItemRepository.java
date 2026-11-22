package com.example.demo.repository;

import com.example.demo.model.*;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BibliotecaItemRepository extends JpaRepository<BibliotecaItem, Long> {

    Page<BibliotecaItem> findByUsuarioId(Long usuarioId, Pageable pageable);

    Page<BibliotecaItem> findByUsuarioIdAndEstado(Long usuarioId, EstadoJuego estado, Pageable pageable);

    Optional<BibliotecaItem> findByIdAndUsuarioId(Long id, Long usuarioId);

    boolean existsByUsuarioIdAndJuegoIdAndPlataformaId(Long usuarioId, Long juegoId, Long plataformaId);
}
