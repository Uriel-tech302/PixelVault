import api from './api';

// Convierte el texto de las pestañas ('Completados') al enum del backend ('COMPLETADO')
const toBackendStatus = (status) => {
  if (!status || status === 'Todos') return undefined;
  const mapStatus = {
    Jugando: 'JUGANDO',
    Completados: 'COMPLETADO',
    Completado: 'COMPLETADO',
    Abandonados: 'ABANDONADO',
    Abandonado: 'ABANDONADO'
  };
  return mapStatus[status] || status.toUpperCase();
};

// Adapta BibliotecaItemResponse al formato que ya usan GameCard y GameDetail
// Adapta BibliotecaItemResponse al formato que ya usan GameCard y GameDetail
export function mapBibliotecaItem(item) {
  const coverUrl = item.portadaUrl || 'https://placehold.co/300x450/161b22/b0fb3d?text=PixelVault';
  const score = item.puntuacion || 0;

  return {
    id: item.id,
    juegoId: item.juegoId,
    title: item.titulo,
    year: item.anioLanzamiento,
    developer: item.desarrollador,
    genres: item.generos || [],
    genre: item.generos?.[0] || 'Indie',
    cover: coverUrl,
    image: coverUrl,
    banner: item.bannerUrl || coverUrl,
    platform: item.plataforma?.nombre || 'PC',
    plataformaId: item.plataforma?.id,
    status: item.estado || 'JUGANDO', // Mantiene JUGANDO / COMPLETADO / ABANDONADO
    hours: Number(item.horasJugadas || 0),
    lastSession: item.ultimaSesion || '',
    rating: score,
    hearts: score,
    hasReview: item.tieneResena,
    review: item.resena?.contenido || item.resena?.texto || ''
  };
}

// 1. LISTAR BIBLIOTECA PAGINADA Y FILTRADA (compatible con tu Inventory.jsx)
export async function fetchGames({ page = 0, size = 12, status = 'Todos', search = '' } = {}) {
  const params = { page, size };
  const estado = toBackendStatus(status);

  if (estado) params.estado = estado;
  if (search && search.trim() !== '') params.q = search.trim();

  const { data } = await api.get('/biblioteca', { params });

  return {
    content: (data.contenido || []).map(mapBibliotecaItem),
    totalPages: Math.max(1, data.totalPaginas ?? 1),
    totalElements: data.totalElementos ?? 0,
    number: data.pagina ?? page
  };
}

// 2. RESUMEN DE ESTADÍSTICAS DEL INVENTARIO
export async function getResumenBiblioteca() {
  const { data } = await api.get('/biblioteca/resumen');
  return data;
}

// 3. DETALLE DE UN JUEGO EN BIBLIOTECA
export async function getGameById(id) {
  const { data } = await api.get(`/biblioteca/${id}`);
  return mapBibliotecaItem(data);
}

// 4. AGREGAR JUEGO A LA BIBLIOTECA
export async function addGameToLibrary({
  juegoId,
  plataformaId,
  status = 'JUGANDO',
  hours = 0,
  lastSession = null,
  rating = null
}) {
  const payload = {
    juegoId: Number(juegoId),
    plataformaId: Number(plataformaId),
    estado: toBackendStatus(status),
    horasJugadas: Number(hours),
    ultimaSesion: lastSession || null,
    puntuacion: rating ? Number(rating) : null
  };
  const { data } = await api.post('/biblioteca', payload);
  return mapBibliotecaItem(data);
}

// 5. ACTUALIZAR JUEGO EN LA BIBLIOTECA
export async function updateLibraryGame(id, { status, hours = 0, lastSession = null, rating = null }) {
  const payload = {
    estado: toBackendStatus(status),
    horasJugadas: Number(hours),
    ultimaSesion: lastSession || null,
    puntuacion: rating ? Number(rating) : null
  };
  const { data } = await api.put(`/biblioteca/${id}`, payload);
  return mapBibliotecaItem(data);
}

// 6. ELIMINAR JUEGO DE LA BIBLIOTECA
export async function deleteLibraryGame(id) {
  await api.delete(`/biblioteca/${id}`);
}

// 7. CATÁLOGO (PARA EL FORMULARIO DE AGREGAR JUEGO)
export async function getCatalogoJuegos(q = '') {
  const { data } = await api.get('/juegos', { params: { q: q || undefined, size: 50 } });
  return data.contenido || [];
}

export async function getPlataformas() {
  const { data } = await api.get('/plataformas');
  return data || [];
}