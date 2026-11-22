import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockGames } from '../data/mockGames';
import './Inventory.css';
import './GameDetail.css';
import HeartRating, { ratingLabels } from '../components/HeartRating';

const statusMessages = {
  Completado: 'MISIÓN COMPLETADA. RECUERDOS GUARDADOS.',
  Jugando: 'PARTIDA EN CURSO. SIGUE AVANZANDO.',
  Abandonado: 'MISIÓN EN PAUSA. SIEMPRE PUEDES VOLVER.'
};

const formatStatus = (raw) =>
  raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : 'Jugando';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = mockGames.find((g) => g.id === Number(id)) || mockGames[0];

  const [rating, setRating] = useState(game.hearts);
  const [status, setStatus] = useState(formatStatus(game.status));
  const [review, setReview] = useState(game.review);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const fileSlug = game.title.toLowerCase().replace(/\s+/g, '_') + '.txt';
  const entryNumber = String(game.id).padStart(3, '0');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedNotice(false);

    try {
      console.log('Guardando en bóveda:', { id: game.id, rating, status, review });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedNotice(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="inventory-wrapper">
      <Navbar />

      <main className="detail-main">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">JUGADOR_01 / ARCHIVO PERSONAL</span>
        </div>

        <form className="save-point-card" onSubmit={handleSave}>
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">💾</span> El punto de guardado
            </div>
            <div className="box-header-right">
              EDITAR ENTRADA [ <span className="highlight-green">{entryNumber}</span> ]
            </div>
          </div>

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

          <div className="detail-body">
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

            <section className="detail-editor">
              <div className="editor-top-row">
                <div className="editor-field">
                  <label className="editor-label">01 / TU PUNTUACIÓN</label>
                  <HeartRating rating={rating} onChange={setRating} size={26} />

                  <span className="rating-caption">{ratingLabels[rating]}</span>
                </div>

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

      <Footer />
    </div>
  );
}