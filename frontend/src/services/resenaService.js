import api from './api';

export const resenaService = {
  // Reseñas del usuario y públicas
  async guardarResena(itemId, payload) {
    const { data } = await api.put(`/biblioteca/${itemId}/resena`, payload);
    return data;
  },

  async eliminarResenaPropia(itemId) {
    await api.delete(`/biblioteca/${itemId}/resena`);
  },

  async getResenasPublicas(juegoId, { page = 0, size = 20 } = {}) {
    const { data } = await api.get(`/juegos/${juegoId}/resenas`, {
      params: { page, size }
    });
    return data;
  },

  // Moderación (ADMIN y MODERADOR)
  async listarModeracion({ oculta, q, page = 0, size = 50 } = {}) {
    const params = { page, size };
    if (oculta !== undefined && oculta !== '') params.oculta = oculta;
    if (q) params.q = q;
    const { data } = await api.get('/moderacion/resenas', { params });
    return data;
  },

  async ocultarResena(id, motivo) {
    const { data } = await api.patch(`/moderacion/resenas/${id}/ocultar`, { motivo });
    return data;
  },

  async mostrarResena(id) {
    const { data } = await api.patch(`/moderacion/resenas/${id}/mostrar`);
    return data;
  },

  async eliminarResenaModeracion(id) {
    await api.delete(`/moderacion/resenas/${id}`);
  }
};