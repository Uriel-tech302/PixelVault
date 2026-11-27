import api from './api';

export const profileService = {
  // Perfil
  async getPerfil() {
    const { data } = await api.get('/perfil');
    return data;
  },

  async actualizarPerfil(payload) {
    const { data } = await api.put('/perfil', payload);
    return data;
  },

  async cambiarPassword(passwordActual, passwordNueva) {
    await api.patch('/perfil/password', { passwordActual, passwordNueva });
  },
  // Steam
  async getEstadoSteam() {
    const { data } = await api.get('/perfil/steam');
    return data;
  },

  async vincularSteam(steam) {
    const { data } = await api.put('/perfil/steam', { steam });
    return data;
  },

  async desvincularSteam() {
    await api.delete('/perfil/steam');
  },

  async sincronizarSteam() {
    const { data } = await api.post('/biblioteca/sincronizar-steam');
    return data;
  }
};