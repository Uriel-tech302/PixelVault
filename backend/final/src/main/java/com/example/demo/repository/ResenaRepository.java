package com.example.demo.repository;

import com.example.demo.model.*;
import java.time.LocalDateTime;
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
}
