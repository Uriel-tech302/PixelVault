package com.example.demo.repository;

import com.example.demo.model.*;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JuegoRepository extends JpaRepository<Juego, Long> {

    Optional<Juego> findBySteamAppId(Integer steamAppId);

    Page<Juego> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);
}
