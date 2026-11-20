package com.example.demo.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final Map<String, String> errores;

    public ApiException(HttpStatus status, String mensaje) {
        this(status, mensaje, Map.of());
    }

    public ApiException(HttpStatus status, String mensaje, Map<String, String> errores) {
        super(mensaje);
        this.status = status;
        this.errores = errores;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, String> getErrores() {
        return errores;
    }
}
