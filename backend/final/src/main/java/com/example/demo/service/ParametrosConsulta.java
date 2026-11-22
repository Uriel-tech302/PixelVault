package com.example.demo.service;

import com.example.demo.exception.ApiException;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TreeSet;
import org.springframework.http.HttpStatus;

final class ParametrosConsulta {

    static final int TAMANIO_MAXIMO = 100;
    private static final int PAGINA_MAXIMA = 10_000;
    private static final int LARGO_MAXIMO_BUSQUEDA = 100;

    private ParametrosConsulta() {
    }

    record Orden(String expresion, boolean ascendente) {
    }

    static void validarPagina(int pagina, int tamanio) {
        Map<String, String> errores = new LinkedHashMap<>();
        if (pagina < 0 || pagina > PAGINA_MAXIMA) {
            errores.put("page", "Debe estar entre 0 y " + PAGINA_MAXIMA + ".");
        }
        if (tamanio < 1 || tamanio > TAMANIO_MAXIMO) {
            errores.put("size", "Debe estar entre 1 y " + TAMANIO_MAXIMO + ".");
        }
        if (!errores.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Parámetros de consulta inválidos.", errores);
        }
    }

    static Orden resolverOrden(String sort, String sortPorDefecto, Map<String, String> permitidos) {
        String valor = (sort == null || sort.isBlank()) ? sortPorDefecto : sort;
        String[] partes = valor.split(",");
        String campo = partes[0].trim();
        String sentido = partes.length > 1 ? partes[1].trim().toLowerCase(Locale.ROOT) : "asc";

        String expresion = permitidos.get(campo);
        if (expresion == null) {
            throw errorSort("Campo no permitido. Usa: " + String.join(", ", new TreeSet<>(permitidos.keySet())) + ".");
        }
        if (!sentido.equals("asc") && !sentido.equals("desc")) {
            throw errorSort("El sentido debe ser asc o desc.");
        }
        return new Orden(expresion, sentido.equals("asc"));
    }
    static String patronBusqueda(String q) {
        if (q == null || q.isBlank()) {
            return null;
        }
        String limpio = q.trim();
        if (limpio.length() > LARGO_MAXIMO_BUSQUEDA) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Parámetros de consulta inválidos.",
                    Map.of("q", "Máximo " + LARGO_MAXIMO_BUSQUEDA + " caracteres."));
        }
        String escapado = limpio.toLowerCase(Locale.ROOT)
                .replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_");
        return "%" + escapado + "%";
    }

    private static ApiException errorSort(String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "Parámetros de consulta inválidos.",
                Map.of("sort", mensaje));
    }
}
