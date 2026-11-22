package com.example.demo.repository;

import com.example.demo.model.Juego;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

@Repository
public class JuegoConsultaRepository {

    @PersistenceContext
    private EntityManager em;

    public Page<Juego> buscar(String patronTitulo, Long generoId, String ordenJpql, boolean ascendente,
                              int pagina, int tamanio) {
        String from = generoId != null ? " from Juego j join j.generos g" : " from Juego j";

        List<String> condiciones = new ArrayList<>();
        if (generoId != null) {
            condiciones.add("g.id = :generoId");
        }
        if (patronTitulo != null) {
            condiciones.add("lower(j.titulo) like :patron escape '!'");
        }
        String where = condiciones.isEmpty() ? "" : " where " + String.join(" and ", condiciones);

        String orden = " order by " + ordenJpql + (ascendente ? " asc" : " desc") + ", j.id asc";

        TypedQuery<Juego> consulta = em.createQuery("select j" + from + where + orden, Juego.class);
        TypedQuery<Long> conteo = em.createQuery("select count(j)" + from + where, Long.class);

        asignar(consulta, generoId, patronTitulo);
        asignar(conteo, generoId, patronTitulo);

        consulta.setFirstResult(pagina * tamanio);
        consulta.setMaxResults(tamanio);

        return new PageImpl<>(consulta.getResultList(), PageRequest.of(pagina, tamanio), conteo.getSingleResult());
    }

    private void asignar(TypedQuery<?> q, Long generoId, String patron) {
        if (generoId != null) {
            q.setParameter("generoId", generoId);
        }
        if (patron != null) {
            q.setParameter("patron", patron);
        }
    }
}
