package com.example.demo.security;

import com.example.demo.repository.TokenRevocadoRepository;
import com.example.demo.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Lee "Authorization: Bearer <token>", valida el JWT y, si es correcto, deja al usuario autenticado.
 * Si el token falta o es invalido no hace nada: Spring Security responde 401 despues.
 * (No es un @Component a proposito: se crea en SecurityConfig para que no se registre dos veces.)
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final TokenRevocadoRepository tokenRevocadoRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarioRepository,
                                   TokenRevocadoRepository tokenRevocadoRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.tokenRevocadoRepository = tokenRevocadoRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = header.substring(7).trim();
            try {
                Claims claims = jwtService.parsear(token);
                String jti = claims.getId();

                if (jti != null && !tokenRevocadoRepository.existsByJti(jti)) {
                    usuarioRepository.findByEmail(claims.getSubject())
                            .filter(u -> u.isActivo())
                            .ifPresent(u -> {
                                UsuarioAutenticado principal = new UsuarioAutenticado(
                                        u.getId(), u.getEmail(), u.getUsername(), u.getRol().getNombre(),
                                        jti, claims.getExpiration().toInstant());
                                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                        principal, null,
                                        List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().getNombre())));
                                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                SecurityContextHolder.getContext().setAuthentication(auth);
                            });
                }
            } catch (JwtException | IllegalArgumentException e) {
                // Token invalido o vencido: se ignora y la peticion sigue sin autenticar (401)
            }
        }

        chain.doFilter(request, response);
    }
}
