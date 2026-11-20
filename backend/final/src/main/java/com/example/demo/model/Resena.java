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
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "biblioteca_item_id", nullable = false, unique = true)
    private BibliotecaItem bibliotecaItem;

    @Column(nullable = false, length = 2000)
    private String texto;

    @Column(name = "contiene_spoilers", nullable = false)
    private boolean contieneSpoilers;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 10)
    private Visibilidad visibilidad = Visibilidad.PRIVADA;

    @Column(nullable = false)
    private boolean oculta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderada_por")
    private Usuario moderadaPor;

    @Column(name = "moderada_en")
    private LocalDateTime moderadaEn;

    @Column(name = "motivo_moderacion", length = 255)
    private String motivoModeracion;

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

    public BibliotecaItem getBibliotecaItem() {
        return bibliotecaItem;
    }

    public void setBibliotecaItem(BibliotecaItem bibliotecaItem) {
        this.bibliotecaItem = bibliotecaItem;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public boolean isContieneSpoilers() {
        return contieneSpoilers;
    }

    public void setContieneSpoilers(boolean contieneSpoilers) {
        this.contieneSpoilers = contieneSpoilers;
    }

    public Visibilidad getVisibilidad() {
        return visibilidad;
    }

    public void setVisibilidad(Visibilidad visibilidad) {
        this.visibilidad = visibilidad;
    }

    public boolean isOculta() {
        return oculta;
    }

    public void setOculta(boolean oculta) {
        this.oculta = oculta;
    }

    public Usuario getModeradaPor() {
        return moderadaPor;
    }

    public void setModeradaPor(Usuario moderadaPor) {
        this.moderadaPor = moderadaPor;
    }

    public LocalDateTime getModeradaEn() {
        return moderadaEn;
    }

    public void setModeradaEn(LocalDateTime moderadaEn) {
        this.moderadaEn = moderadaEn;
    }

    public String getMotivoModeracion() {
        return motivoModeracion;
    }

    public void setMotivoModeracion(String motivoModeracion) {
        this.motivoModeracion = motivoModeracion;
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
