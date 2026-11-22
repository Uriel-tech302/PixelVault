package com.example.demo.dto;

import java.util.List;

public record PageResponse<T>(List<T> contenido, int pagina, int tamanio, long totalElementos, int totalPaginas) {

    public static <T> PageResponse<T> de(List<T> contenido, int pagina, int tamanio, long totalElementos) {
        int totalPaginas = (int) Math.ceil(totalElementos / (double) tamanio);
        return new PageResponse<>(contenido, pagina, tamanio, totalElementos, totalPaginas);
    }
}
