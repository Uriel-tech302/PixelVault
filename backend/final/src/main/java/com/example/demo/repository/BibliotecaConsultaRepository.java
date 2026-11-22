package com.example.demo.repository;

import com.example.demo.model.BibliotecaItem;
import com.example.demo.model.EstadoJuego;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

@Repository
public class BibliotecaConsultaRepository {

    @PersistenceContext
    private EntityManager em;

    public Page<BibliotecaItem> buscar(Long usuarioId, EstadoJuego estado, Long plataformaId,
                                       String patronTitulo, String ordenJpql, boolean ascendente,
                                       int pagina, int tamanio) {
        StringBuilder where = new StringBuilder(" where b.usuario.id = :usuarioId");
        if (estado != null) {
            where.append(" and b.estado = :estado");
        }
        if (plataformaId != null) {
            where.append(" and pl.id = :plataformaId");
        }
        if (patronTitulo != null) {
            where.append(" and lower(j.titulo) like :patron escape '!'");
        }

        String orden = " order by " + ordenJpql + (ascendente ? " asc" : " desc") + ", b.id desc";

        TypedQuery<BibliotecaItem> consulta = em.createQuery(
                "select b from BibliotecaItem b join fetch b.juego j join fetch b.plataforma pl"
                        + where + orden,
                BibliotecaItem.class);
        TypedQuery<Long> conteo = em.createQuery(
                "select count(b) from BibliotecaItem b join b.juego j join b.plataforma pl" + where,
                Long.class);

        asignar(consulta, usuarioId, estado, plataformaId, patronTitulo);
        asignar(conteo, usuarioId, estado, plataformaId, patronTitulo);

        consulta.setFirstResult(pagina * tamanio);
        consulta.setMaxResults(tamanio);

        return new PageImpl<>(consulta.getResultList(), PageRequest.of(pagina, tamanio), conteo.getSingleResult());
    }

    private void asignar(TypedQuery<?> q, Long usuarioId, EstadoJuego estado, Long plataformaId, String patron) {
        q.setParameter("usuarioId", usuarioId);
        if (estado != null) {
            q.setParameter("estado", estado);
        }
        if (plataformaId != null) {
            q.setParameter("plataformaId", plataformaId);
        }
        if (patron != null) {
            q.setParameter("patron", patron);
        }
    }
}
