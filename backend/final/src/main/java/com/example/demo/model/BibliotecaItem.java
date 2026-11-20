package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "biblioteca_items")
public class BibliotecaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "juego_id", nullable = false)
    private Juego juego;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plataforma_id", nullable = false)
    private Plataforma plataforma;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private EstadoJuego estado = EstadoJuego.JUGANDO;

    @Column(name = "horas_jugadas", nullable = false, precision = 7, scale = 1)
    private BigDecimal horasJugadas = BigDecimal.ZERO;

    @Column(name = "ultima_sesion")
    private LocalDate ultimaSesion;

    @Column
    private Byte puntuacion;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Juego getJuego() {
        return juego;
    }

    public void setJuego(Juego juego) {
        this.juego = juego;
    }

    public Plataforma getPlataforma() {
        return plataforma;
    }

    public void setPlataforma(Plataforma plataforma) {
        this.plataforma = plataforma;
    }

    public EstadoJuego getEstado() {
        return estado;
    }

    public void setEstado(EstadoJuego estado) {
        this.estado = estado;
    }

    public BigDecimal getHorasJugadas() {
        return horasJugadas;
    }

    public void setHorasJugadas(BigDecimal horasJugadas) {
        this.horasJugadas = horasJugadas;
    }

    public LocalDate getUltimaSesion() {
        return ultimaSesion;
    }

    public void setUltimaSesion(LocalDate ultimaSesion) {
        this.ultimaSesion = ultimaSesion;
    }

    public Byte getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(Byte puntuacion) {
        this.puntuacion = puntuacion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
