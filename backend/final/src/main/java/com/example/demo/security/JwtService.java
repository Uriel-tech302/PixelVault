package com.example.demo.security;

import com.example.demo.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public record TokenGenerado(String token, String jti, Instant expiraEn) {
    }

    private final SecretKey key;
    private final long expiracionMs;
    private final long expiracionRecordarmeMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expiracionMs,
                      @Value("${app.jwt.remember-expiration-ms}") long expiracionRecordarmeMs) {
        // La clave es Base64 y debe decodificar a 32 bytes o mas (HS256)
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expiracionMs = expiracionMs;
        this.expiracionRecordarmeMs = expiracionRecordarmeMs;
    }

    public TokenGenerado generar(Usuario usuario, boolean recordarme) {
        Instant ahora = Instant.now();
        Instant expira = ahora.plusMillis(recordarme ? expiracionRecordarmeMs : expiracionMs);
        String jti = UUID.randomUUID().toString();

        String token = Jwts.builder()
                .id(jti)
                .subject(usuario.getEmail())
                .claim("uid", usuario.getId())
                .claim("rol", usuario.getRol().getNombre())
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(expira))
                .signWith(key)
                .compact();

        return new TokenGenerado(token, jti, expira);
    }

    /** Valida firma y expiracion. Lanza JwtException si el token no es valido. */
    public Claims parsear(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
