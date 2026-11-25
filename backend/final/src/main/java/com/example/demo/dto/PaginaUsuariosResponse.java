package com.example.demo.dto;

import java.util.List;

public record PaginaUsuariosResponse(
        List<UsuarioAdminResponse> contenido,
        int pagina,
        int tamanio,
        long totalElementos,
        int totalPaginas) {
}
