package com.example.demo.security;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/** Escribe errores JSON con el mismo formato que GlobalExceptionHandler (para los filtros de seguridad). */
final class JsonErrores {

    private JsonErrores() {
    }

    static void escribir(HttpServletResponse response, int status, String mensaje) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        String json = "{\"status\":" + status + ",\"mensaje\":\"" + mensaje.replace("\\", "\\\\").replace("\"", "\\\"") + "\"}";
        response.getWriter().write(json);
    }
}
