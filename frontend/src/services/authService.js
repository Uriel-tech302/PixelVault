import api from './api';

// Adapta el DTO UsuarioResponse del backend al formato del frontend
export function mapUsuario(u) {
  const cleanRole = (u.rol || 'USER').replace(/^ROLE_/i, '').toUpperCase();
  const displayName = u.username || 'Jugador';
  return {
    id: u.id,
    name: displayName,
    email: u.email,
    role: cleanRole,
    avatar: displayName.slice(0, 2).toUpperCase()
  };
}

export async function loginApi({ email, password, recordarme = false }) {
  const { data } = await api.post('/auth/login', { email, password, recordarme });
  return {
    token: data.token,
    user: mapUsuario(data.usuario)
  };
}

export async function registerApi({ username, email, password }) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return mapUsuario(data);
}

export async function logoutApi() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Si el token ya expiró o falló la red, igual limpiamos sesión local
  }
}
export async function forgotPasswordApi(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPasswordApi({ token, nuevaPassword }) {
  const { data } = await api.post('/auth/reset-password', { token, nuevaPassword });
  return data;
}