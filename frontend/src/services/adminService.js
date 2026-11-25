import api from './api';

export const adminService = {
  async getUsuarios({ rol, activo, q, page = 0, size = 50 } = {}) {
    const params = { page, size };
    if (rol && rol !== 'TODOS') params.rol = rol;
    if (activo !== undefined && activo !== '') params.activo = activo;
    if (q) params.q = q;

    const { data } = await api.get('/admin/usuarios', { params });
    return data;
  },

  async cambiarRol(id, rol) {
    const { data } = await api.patch(`/admin/usuarios/${id}/rol`, { rol });
    return data;
  },

  async cambiarEstado(id, activo) {
    const { data } = await api.patch(`/admin/usuarios/${id}/estado`, { activo });
    return data;
  },

  async desactivarUsuario(id) {
    await api.delete(`/admin/usuarios/${id}`);
  }
};