package com.example.demo.service;

import com.example.demo.dto.PaginaUsuariosResponse;
import com.example.demo.dto.UsuarioAdminResponse;
import com.example.demo.exception.ApiException;
import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUsuarioService {

    private static final Set<String> ROLES = Set.of("ADMIN", "MODERADOR", "USUARIO");
    private static final Map<String, String> ORDEN = Map.of(
            "username", "username",
            "email", "email",
            "createdAt", "createdAt",
            "rol", "rol.nombre");

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public AdminUsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @Transactional(readOnly = true)
    public PaginaUsuariosResponse listar(String rol, String activo, String q,
                                         String page, String size, String sort) {
        String rolFiltro = vacio(rol) ? null : rol.trim().toUpperCase(Locale.ROOT);
        if (rolFiltro != null && !ROLES.contains(rolFiltro)) {
            throw invalido("rol", "Rol no válido. Usa ADMIN, MODERADOR o USUARIO.");
        }

        Boolean activoFiltro = null;
        if (!vacio(activo)) {
            if ("true".equalsIgnoreCase(activo.trim())) {
                activoFiltro = Boolean.TRUE;
            } else if ("false".equalsIgnoreCase(activo.trim())) {
                activoFiltro = Boolean.FALSE;
            } else {
                throw invalido("activo", "Usa true o false.");
            }
        }

        int pagina = entero(page, 0, "page");
        if (pagina < 0) {
            throw invalido("page", "Debe ser 0 o mayor.");
        }
        int tamanio = entero(size, 12, "size");
        if (tamanio < 1 || tamanio > 100) {
            throw invalido("size", "Debe estar entre 1 y 100.");
        }

        String campo = "username";
        String direccion = "asc";
        if (!vacio(sort)) {
            String[] partes = sort.split(",");
            campo = partes[0].trim();
            if (partes.length > 1) {
                direccion = partes[1].trim().toLowerCase(Locale.ROOT);
            }
        }
        if (!ORDEN.containsKey(campo)) {
            throw invalido("sort", "Orden no permitido. Usa: username, email, createdAt o rol.");
        }
        if (!direccion.equals("asc") && !direccion.equals("desc")) {
            throw invalido("sort", "La dirección debe ser asc o desc.");
        }
        Sort orden = Sort.by(Sort.Direction.fromString(direccion), ORDEN.get(campo)).and(Sort.by("id"));

        String patron = null;
        if (!vacio(q)) {
            String t = q.trim().toLowerCase(Locale.ROOT);
            if (t.length() > 100) {
                t = t.substring(0, 100);
            }
            patron = "%" + t.replace("!", "!!").replace("%", "!%").replace("_", "!_") + "%";
        }

        Page<Usuario> resultado = usuarioRepository.buscarAdmin(
                rolFiltro, activoFiltro, patron, PageRequest.of(pagina, tamanio, orden));

        return new PaginaUsuariosResponse(
                resultado.getContent().stream().map(this::aResponse).toList(),
                resultado.getNumber(), resultado.getSize(),
                resultado.getTotalElements(), resultado.getTotalPages());
    }

    @Transactional
    public UsuarioAdminResponse cambiarRol(Long id, String nombreRol, Long actorId) {
        Usuario usuario = buscar(id);
        if (usuario.getId().equals(actorId)) {
            throw new ApiException(HttpStatus.CONFLICT, "No puedes cambiar tu propio rol.");
        }
        Rol rol = rolRepository.findByNombre(nombreRol)
                .orElseThrow(() -> new IllegalStateException("Falta el rol " + nombreRol + " en la base de datos"));
        usuario.setRol(rol);
        usuarioRepository.save(usuario);
        return aResponse(usuario);
    }

    @Transactional
    public UsuarioAdminResponse cambiarEstado(Long id, boolean activo, Long actorId) {
        Usuario usuario = buscar(id);
        if (usuario.getId().equals(actorId)) {
            throw new ApiException(HttpStatus.CONFLICT, "No puedes desactivar tu propia cuenta.");
        }
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
        return aResponse(usuario);
    }

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private UsuarioAdminResponse aResponse(Usuario u) {
        return new UsuarioAdminResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRol().getNombre(),
                u.isActivo(), u.isActivo() ? "ACTIVO" : "INACTIVO", String.valueOf(u.getCreatedAt()));
    }

    private boolean vacio(String s) {
        return s == null || s.isBlank();
    }

    private int entero(String valor, int porDefecto, String nombre) {
        if (vacio(valor)) {
            return porDefecto;
        }
        try {
            return Integer.parseInt(valor.trim());
        } catch (NumberFormatException e) {
            throw invalido(nombre, "Debe ser un número entero.");
        }
    }

    private ApiException invalido(String campo, String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "Parámetro no válido.", Map.of(campo, mensaje));
    }
}
