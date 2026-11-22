import api from './api';
import { mockGames } from '../data/mockGames';

// Cambia a false en cuanto el backend de Spring Boot tenga listo GET /api/juegos
const USE_MOCK = true;

export async function fetchGames({ page = 0, size = 4, status = 'Todos', search = '' }) {
  if (!USE_MOCK) {
    const params = { page, size };
    if (status && status !== 'Todos') params.status = status.toUpperCase();
    if (search.trim()) params.search = search.trim();

    const { data } = await api.get('/juegos', { params });
    // Formato estándar de Page<T> en Spring Data JPA
    return {
      content: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      number: data.number
    };
  }

  // Simulación temporal de respuesta paginada del servidor
  await new Promise((resolve) => setTimeout(resolve, 350));

  let filtered = [...mockGames];

  if (status !== 'Todos') {
    const mapStatus = {
      Jugando: 'JUGANDO',
      Completados: 'COMPLETADO',
      Abandonados: 'ABANDONADO'
    };
    const target = mapStatus[status] || status.toUpperCase();
    filtered = filtered.filter((g) => g.status === target);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q)
    );
  }

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    content,
    totalPages,
    totalElements,
    number: page
  };
}