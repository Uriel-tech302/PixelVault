import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Inventory.css';
import './GameDetail.css';

// Datos temporales sincronizados con Inventory.jsx (luego vendrán de Axios: GET /api/juegos/:id)
const mockGames = [
  {
    id: 1,
    title: 'Hollow Knight',
    year: '2017',
    genre: 'Metroidvania',
    developer: 'Team Cherry',
    status: 'Completado',
    hours: '48.2 horas',
    lastSession: '21 oct 2026',
    platform: 'Steam / PC',
    hearts: 5,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg',
    banner: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_hero.jpg',
    review:
      'Vine por el arte. Me quedé por la sensación de perderme por completo, maravillosamente, bajo Dirtmouth.\n\nCada nuevo atajo se sentía como una pequeña victoria, y la Ciudad de Lágrimas seguirá en mi mente durante mucho tiempo. El mundo dice tanto sin decir demasiado.\n\n48 horas después: un aguijón roto, cien muertes y un nuevo favorito de todos los tiempos. Hallownest, gracias.'
  },
  {
    id: 2,
    title: 'Stardew Valley',
    year: '2016',
    genre: 'Simulador de granja',
    developer: 'ConcernedApe',
    status: 'Jugando',
    hours: '126.4 horas',
    lastSession: '15 nov 2026',
    platform: 'Steam / PC',
    hearts: 5,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg',
    banner: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_hero.jpg',
    review: 'Solo un día más en la granja... y ya pasaron 4 horas.'
  },
  {
    id: 3,
    title: 'Hades',
    year: '2020',
    genre: 'Roguelike',
    developer: 'Supergiant Games',
    status: 'Jugando',
    hours: '32.8 horas',
    lastSession: '10 nov 2026',
    platform: 'Steam / PC',
    hearts: 4,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg',
    banner: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_hero.jpg',
    review: 'Arte, música y combate impecables.'
  },
  {
    id: 4,
    title: 'Celeste',
    year: '2018',
    genre: 'Plataformas',
    developer: 'Maddy Makes Games',
    status: 'Completado',
    hours: '10.6 horas',
    lastSession: '02 oct 2026',
    platform: 'Steam / PC',
    hearts: 5,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg',
    banner: 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_hero.jpg',
    review: 'Difícil pero súper justo. Gran mensaje.'
  },
  {
    id: 5,
    title: 'Dead Cells',
    year: '2018',
    genre: 'Roguelike',
    developer: 'Motion Twin',
    status: 'Abandonado',
    hours: '14.1 horas',
    lastSession: '19 sep 2026',
    platform: 'Steam / PC',
    hearts: 3,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_600x900.jpg',
    banner: 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_hero.jpg',
    review: 'Muy bueno, pero lo dejé en pausa por falta de tiempo.'
  }
];

const ratingLabels = {
  1: '1 / 5 — NO FUE PARA MÍ',
  2: '2 / 5 — PASABLE',
  3: '3 / 5 — BUEN JUEGO',
  4: '4 / 5 — GRAN EXPERIENCIA',
  5: '5 / 5 — OBRA MAESTRA'
};

const statusMessages = {
  Completado: 'MISIÓN COMPLETADA. RECUERDOS GUARDADOS.',
  Jugando: 'PARTIDA EN CURSO. SIGUE AVANZANDO.',
  Abandonado: 'MISIÓN EN PAUSA. SIEMPRE PUEDES VOLVER.'
};

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = mockGames.find((g) => g.id === Number(id)) || mockGames[0];

  const [rating, setRating] = useState(game.hearts);
  const [status, setStatus] = useState(game.status);
  const [review, setReview] = useState(game.review);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fileSlug = game.title.toLowerCase().replace(/\s+/g, '_') + '.txt';
  const entryNumber = String(game.id).padStart(3, '0');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedNotice(false);

    try {
      console.log('Guardando en bóveda:', { id: game.id, rating, status, review });
      // Aquí conectarás Axios: PUT /api/inventario/${game.id}
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedNotice(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="inventory-wrapper">
      {/* NAVBAR SUPERIOR */}
      <nav className="inventory-navbar">
        <Link to="/inventario" className="navbar-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="logo-icon">▣</span> PixelVault
        </Link>

        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Buscar en tu colección... /" />
        </div>

        <div className="navbar-user-controls">
          <button className="btn-add-game" type="button">
            <span className="btn-add-icon">⭘</span> + Agregar juego
          </button>

          <div className="user-profile-menu">
            <button
              className="profile-btn"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              P1
            </button>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/login" className="logout-link">Cerrar sesión ▼</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="detail-main">
        {/* Barra superior de navegación */}
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">JUGADOR_01 / ARCHIVO PERSONAL</span>
        </div>

        {/* TARJETA PRINCIPAL (PUNTO DE GUARDADO) */}
        <form className="save-point-card" onSubmit={handleSave}>
          {/* Header de la tarjeta */}
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">💾</span> El punto de guardado
            </div>
            <div className="box-header-right">
              EDITAR ENTRADA [ <span className="highlight-green">{entryNumber}</span> ]
            </div>
          </div>

          {/* Banner superior del juego */}
          <div
            className="detail-hero-banner"
            style={{ backgroundImage: `url(${game.banner})` }}
          >
            <div className="detail-hero-overlay">
              <div className="detail-hero-left">
                <span className="editing-tag">EDITANDO / BIBLIOTECA DE STEAM</span>
                <h1 className="detail-game-title">{game.title}</h1>
                <p className="detail-game-meta">
                  {game.year} / {game.genre} / {game.developer}
                </p>
              </div>
              <div className="platform-badge">STEAM · PC</div>
            </div>
          </div>

          {/* Cuerpo en 2 columnas */}
          <div className="detail-body">
            {/* Columna Izquierda: Datos de Steam */}
            <aside className="detail-sidebar">
              <img src={game.image} alt={game.title} className="detail-cover-img" />

              <h3 className="mission-log-title">REGISTRO DE LA MISIÓN</h3>

              <div className="mission-stat">
                <span className="mission-label">TIEMPO JUGADO</span>
                <span className="mission-value">{game.hours}</span>
              </div>

              <div className="mission-stat">
                <span className="mission-label">ÚLTIMA SESIÓN</span>
                <span className="mission-value">{game.lastSession}</span>
              </div>

              <div className="mission-stat">
                <span className="mission-label">PLATAFORMA</span>
                <span className="mission-value">{game.platform}</span>
              </div>

              <div className="story-note-box">
                <p className="story-note-title">TU JUEGO, TU HISTORIA.</p>
                <p className="story-note-desc">
                  Las puntuaciones y reseñas se quedan en tu bóveda personal.
                </p>
              </div>
            </aside>

            {/* Columna Derecha: Formulario editable */}
            <section className="detail-editor">
              <div className="editor-top-row">
                {/* 01 / PUNTUACIÓN */}
                <div className="editor-field">
                  <label className="editor-label">01 / TU PUNTUACIÓN</label>
                  <div className="interactive-hearts">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className="heart-btn"
                        onClick={() => setRating(num)}
                        aria-label={`Calificar con ${num} corazones`}
                      >
                        <svg
                          width="26"
                          height="24"
                          viewBox="0 0 9 8"
                          fill={num <= rating ? '#ff79c6' : '#30363d'}
                        >
                          <path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1V0z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="rating-caption">{ratingLabels[rating]}</span>
                </div>

                {/* 02 / ESTADO DE JUEGO */}
                <div className="editor-field">
                  <label className="editor-label">02 / ESTADO DE JUEGO</label>
                  <select
                    className="status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Completado">✓ Completado</option>
                    <option value="Jugando">⚔ Jugando</option>
                    <option value="Abandonado">♥ Abandonado</option>
                  </select>
                  <span className="status-caption">{statusMessages[status]}</span>
                </div>
              </div>

              {/* 03 / RESEÑA PERSONAL */}
              <div className="review-section">
                <div className="review-header">
                  <label className="editor-label">03 / RESEÑA PERSONAL</label>
                  <span className="draft-indicator">● BORRADOR CARGADO</span>
                </div>

                <div className="terminal-editor-box">
                  <div className="terminal-prompt">
                    C:\PIXELVAULT\RESEÑAS&gt; editar {fileSlug}
                  </div>
                  <textarea
                    className="terminal-textarea"
                    rows="9"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Escribe tus recuerdos, logros o notas sobre esta partida..."
                  />
                  <div className="terminal-cursor-line">
                    &gt; <span className="blinking-block">█</span>
                  </div>
                </div>

                <div className="review-meta-row">
                  <span>TEXTO PLANO / SIN SPOILERS MARCADOS</span>
                  <span>{review.length} CAR</span>
                </div>
              </div>

              {savedNotice && (
                <div className="save-success-banner">
                  ✓ Datos de guardado actualizados correctamente en tu bóveda.
                </div>
              )}
            </section>
          </div>

          {/* Footer de la tarjeta con botones */}
          <div className="detail-card-footer">
            <div className="footer-save-info">
              <span className="save-icon">💾</span>
              <div>
                <p className="save-info-title">Listo para guardar en tu bóveda.</p>
                <p className="save-info-sub">Tu biblioteca de Steam no se verá afectada.</p>
              </div>
            </div>

            <div className="footer-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/inventario')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-save-data" disabled={isSaving}>
                {isSaving ? 'GUARDANDO...' : '💾 Guardar datos'}
              </button>
            </div>
          </div>
        </form>

        <div className="login-tagline">
          LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
        </div>
      </main>

      <footer className="login-footer inventory-main-footer">
        <div className="footer-left">
          <span className="highlight-green">■</span> CONEXIÓN STEAM ESTABLECIDA // ÚLTIMA SINCRONIZACIÓN: HACE 2 MIN
        </div>
        <div className="footer-right">
          PIXELVAULT v1.0 &nbsp;·&nbsp; NO SE PERDIÓ NINGÚN PROGRESO.
        </div>
      </footer>
    </div>
  );
}