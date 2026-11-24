package com.example.demo.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Crea el cliente SMTP solo si se define MAIL_HOST. Sin MAIL_HOST no existe este bean
 * y el correo se sigue imprimiendo en el log (ConsolaCorreoService).
 */
@Configuration
@ConditionalOnExpression("!'${app.mail.host:}'.isEmpty()")
public class MailConfig {

    @Bean
    public JavaMailSenderImpl mailSender(@Value("${app.mail.host}") String host,
                                         @Value("${app.mail.port:25}") int port,
                                         @Value("${app.mail.user:}") String user,
                                         @Value("${app.mail.pass:}") String pass,
                                         @Value("${app.mail.starttls:false}") boolean starttls) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        // Tiempos limite para que un SMTP caido no deje colgada la peticion
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        if (!user.isBlank()) {
            sender.setUsername(user);
            sender.setPassword(pass);
            props.put("mail.smtp.auth", "true");
        }
        if (starttls) {
            props.put("mail.smtp.starttls.enable", "true");
        }
        return sender;
    }
}
