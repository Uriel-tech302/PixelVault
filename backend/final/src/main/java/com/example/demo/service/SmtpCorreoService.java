package com.example.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnExpression("!'${app.mail.host:}'.isEmpty()")
public class SmtpCorreoService implements CorreoService {

    private static final Logger log = LoggerFactory.getLogger(SmtpCorreoService.class);

    private final JavaMailSender mailSender;
    private final String remitente;

    public SmtpCorreoService(JavaMailSender mailSender,
                             @Value("${app.mail.from:no-reply@localhost}") String remitente) {
        this.mailSender = mailSender;
        this.remitente = remitente;
    }

    @Override
    public void enviarRecuperacion(String destinatario, String enlace) {
        String texto = """
                Hola,

                Recibimos una solicitud para restablecer la contraseña de tu cuenta de PixelVault.

                Abre este enlace para elegir una contraseña nueva (vence en 30 minutos y solo se puede usar una vez):
                %s

                Si no fuiste tú, ignora este mensaje: tu contraseña no cambiará.

                PixelVault
                """.formatted(enlace);

        String html = """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
                  <h2 style="color:#161b22">PixelVault</h2>
                  <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                  <p><a href="%s" style="display:inline-block;padding:10px 18px;background:#b0fb3d;color:#0d1117;text-decoration:none;font-weight:bold">Restablecer contraseña</a></p>
                  <p style="font-size:13px;color:#555">El enlace vence en 30 minutos y solo se puede usar una vez.
                  Si no fuiste tú, ignora este mensaje: tu contraseña no cambiará.</p>
                  <p style="font-size:12px;color:#888">Si el botón no funciona, copia este enlace en tu navegador:<br>%s</p>
                </div>
                """.formatted(enlace, enlace);

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setFrom(remitente);
            helper.setTo(destinatario);
            helper.setSubject("Restablece tu contraseña de PixelVault");
            helper.setText(texto, html);
            mailSender.send(mensaje);
            log.info("Correo de recuperacion enviado a {}", destinatario);
        } catch (MailException | jakarta.mail.MessagingException e) {
            log.error("No se pudo enviar el correo de recuperacion a {}: {}", destinatario, e.getMessage());
        }
    }
}
