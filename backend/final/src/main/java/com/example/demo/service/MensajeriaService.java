package com.example.demo.service;

import com.example.demo.exception.ApiException;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class MensajeriaService {

    private static final Logger log = LoggerFactory.getLogger(MensajeriaService.class);

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final String accountSid;
    private final String authToken;
    private final String desdeSms;
    private final String desdeWhatsapp;

    public MensajeriaService(@Value("${TWILIO_ACCOUNT_SID:}") String accountSid,
                             @Value("${TWILIO_AUTH_TOKEN:}") String authToken,
                             @Value("${TWILIO_FROM:}") String desdeSms,
                             @Value("${TWILIO_WHATSAPP_FROM:}") String desdeWhatsapp) {
        this.accountSid = accountSid.trim();
        this.authToken = authToken.trim();
        this.desdeSms = desdeSms.trim();
        this.desdeWhatsapp = desdeWhatsapp.trim();
    }

    public void enviarCodigo(String telefono, String canal, String codigo) {
        log.info("[CODIGO VERIFICACION] Canal={} Destino={} Codigo={}", canal, telefono, codigo);

        boolean whatsapp = "WHATSAPP".equals(canal);
        String desde = whatsapp ? desdeWhatsapp : desdeSms;

        if (accountSid.isEmpty() || authToken.isEmpty() || desde.isEmpty()) {
            log.info("[MENSAJERÍA SIMULADA] {} a {}: codigo={}", canal, telefono, codigo);
            return;
        }

        String cuerpoMensaje = whatsapp
                ? "PixelVault: tu codigo de verificacion es " + codigo + ". Vence en 10 minutos."
                : "sms_appointment_reminders";

        String para = whatsapp ? "whatsapp:" + telefono : telefono;
        String de = whatsapp && !desde.startsWith("whatsapp:") ? "whatsapp:" + desde : desde;
        String formulario = "To=" + codificar(para) + "&From=" + codificar(de) + "&Body=" + codificar(cuerpoMensaje);

        HttpRequest peticion = HttpRequest.newBuilder(
                        URI.create("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"))
                .timeout(Duration.ofSeconds(10))
                .header("Authorization", "Basic " + Base64.getEncoder()
                        .encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8)))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formulario))
                .build();

        try {
            HttpResponse<String> respuesta = http.send(peticion, HttpResponse.BodyHandlers.ofString());
            if (respuesta.statusCode() / 100 != 2) {
                String cuerpo = respuesta.body() == null ? "" : respuesta.body();
                log.warn("Twilio rechazó el envío ({}): {}", respuesta.statusCode(),
                        cuerpo.substring(0, Math.min(200, cuerpo.length())));
                throw fallo();
            }
        } catch (IOException e) {
            log.warn("No se pudo contactar a Twilio: {}", e.getClass().getSimpleName());
            throw fallo();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw fallo();
        }
    }

    private static String codificar(String valor) {
        return URLEncoder.encode(valor, StandardCharsets.UTF_8);
    }

    private static ApiException fallo() {
        return new ApiException(HttpStatus.BAD_GATEWAY,
                "No se pudo enviar el código. Intenta de nuevo en unos minutos.");
    }
}