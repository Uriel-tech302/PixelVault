import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Inventory.css';
import './GameDetail.css';
import HeartRating, { ratingLabels } from '../components/HeartRating';
import ConfirmModal from '../components/ConfirmModal';
import { getGameById, updateLibraryGame, deleteLibraryGame } from '../services/gameService';
import { resenaService } from '../services/resenaService';

const statusMessages = {
  Completado: 'MISIÓN COMPLETADA. RECUERDOS GUARDADOS.',
  Jugando: 'PARTIDA EN CURSO. SIGUE AVANZANDO.',
  Abandonado: 'MISIÓN EN PAUSA. SIEMPRE PUEDES VOLVER.'
};

const formatStatus = (raw) =>
  raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : 'Jugando';

const extractError = (error, fallback) => {
  const data = error.response?.data;
  if (data?.errores && typeof data.errores === 'object') {
    return Object.values(data.errores).join(' · ');
  }
  return data?.mensaje || data?.message || data?.error || fallback;
};

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('Jugando');

  // Estado de la reseña personal
  const [review, setReview] = useState('');
  const [contieneSpoilers, setContieneSpoilers] = useState(false);
  const [visibilidad, setVisibilidad] = useState('PUBLICA');
  const [hasSavedReview, setHasSavedReview] = useState(false);

  // Reseñas públicas del juego
  const [publicReviews, setPublicReviews] = useState([]);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const loadPublicReviews = async (juegoId) => {
    if (!juegoId) return;
    try {
      const pageData = await resenaService.getResenasPublicas(juegoId, { page: 0, size: 20 });
      const list = Array.isArray(pageData)
        ? pageData
        : pageData.contenido ?? pageData.content ?? pageData.items ?? [];
      setPublicReviews(list);
    } catch {
      setPublicReviews([]);
    }
  };

  useEffect(() => {
    let active = true;

    const loadGame = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const data = await getGameById(id);
        if (!active) return;
        setGame(data);
        setRating(data.rating || 0);
        setStatus(formatStatus(data.status));

        const initialText =
          typeof data.review === 'string'
            ? data.review
            : data.resena?.texto ?? data.review?.texto ?? '';
        setReview(initialText);
        setContieneSpoilers(
          Boolean(data.contieneSpoilers ?? data.resena?.contieneSpoilers ?? false)
        );
        setVisibilidad(
          data.visibilidad ?? data.resena?.visibilidad ?? 'PUBLICA'
        );
        setHasSavedReview(Boolean(initialText.trim()));

        const juegoId = data.juegoId ?? data.gameId ?? data.juego?.id;
        if (juegoId) {
          loadPublicReviews(juegoId);
        }
      } catch (error) {
        if (!active) return;
        setErrorMsg(extractError(error, 'No se pudo cargar este juego desde la bóveda.'));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadGame();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!game) return;

    setIsSaving(true);
    setSavedNotice(false);
    setErrorMsg('');

    try {
      const updated = await updateLibraryGame(game.id, {
        status,
        hours: game.hours ?? 0,
        lastSession: game.lastSession || null,
        rating: rating > 0 ? rating : null
      });
      setGame(updated);

      if (review.trim()) {
        await resenaService.guardarResena(game.id, {
          texto: review.trim(),
          contieneSpoilers,
          visibilidad
        });
        setHasSavedReview(true);
        const juegoId = updated.juegoId ?? updated.gameId ?? game.juegoId ?? game.gameId;
        if (juegoId) loadPublicReviews(juegoId);
      }

      setSavedNotice(true);
    } catch (error) {
      setErrorMsg(extractError(error, 'Error al guardar los cambios.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!game) return;
    setIsDeletingReview(true);
    setErrorMsg('');
    setSavedNotice(false);
    try {
      await resenaService.eliminarResenaPropia(game.id);
      setReview('');
      setContieneSpoilers(false);
      setHasSavedReview(false);
      const juegoId = game.juegoId ?? game.gameId ?? game.juego?.id;
      if (juegoId) loadPublicReviews(juegoId);
    } catch (error) {
      setErrorMsg(extractError(error, 'No se pudo eliminar tu reseña.'));
    } finally {
      setIsDeletingReview(false);
    }
  };

  const handleDelete = async () => {
    if (!game) return;
    setIsDeleting(true);
    try {
      await deleteLibraryGame(game.id);
      setShowDeleteModal(false);
      navigate('/inventario');
    } catch (error) {
      setErrorMsg(extractError(error, 'No se pudo eliminar el juego.'));
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="inventory-wrapper">
        <Navbar />
        <main className="detail-main">
          <div className="inventory-loading-box">CARGANDO PUNTO DE GUARDADO...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="inventory-wrapper">
        <Navbar />
        <main className="detail-main">
          <div className="inventory-error-box">
            {errorMsg || 'Juego no encontrado en tu biblioteca.'}
          </div>
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const fileSlug = game.title.toLowerCase().replace(/\s+/g, '_') + '.txt';
  const entryNumber = String(game.id).padStart(3, '0');

  return (
    <div className="inventory-wrapper">
      <Navbar />

      <main className="detail-main">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">ARCHIVO PERSONAL / BÓVEDA</span>
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
            style={{ backgroundImage: `url(${game.banner || game.cover})` }}
          >
            <div className="detail-hero-overlay">
              <div className="detail-hero-left">
                <span className="editing-tag">EDITANDO / BIBLIOTECA PERSONAL</span>
                <h1 className="detail-game-title">{game.title}</h1>
                <p className="detail-game-meta">
                  {game.year} / {game.genre} / {game.developer}
                </p>
              </div>
              <div className="platform-badge">{game.platform}</div>
            </div>
          </div>

          <div className="detail-body">
            <aside className="detail-sidebar">
              <img src={game.cover} alt={game.title} className="detail-cover-img" />

              <h3 className="mission-log-title">REGISTRO DE LA MISIÓN</h3>

              <div className="mission-stat">
                <span className="mission-label">TIEMPO JUGADO</span>
                <span className="mission-value">{game.hours} h</span>
              </div>

              <div className="mission-stat">
                <span className="mission-label">ÚLTIMA SESIÓN</span>
                <span className="mission-value">{game.lastSession || 'Sin registro'}</span>
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
                  <span className="rating-caption">
                    {ratingLabels[rating] || 'Sin puntuación'}
                  </span>
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
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <select
                      className="status-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      value={visibilidad}
                      onChange={(e) => setVisibilidad(e.target.value)}
                    >
                      <option value="PUBLICA">🌐 Pública</option>
                      <option value="PRIVADA">🔒 Privada</option>
                    </select>
                    {hasSavedReview && (
                      <button
                        type="button"
                        className="btn-cancel"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={handleDeleteReview}
                        disabled={isDeletingReview}
                      >
                        {isDeletingReview ? 'Borrando...' : 'Borrar reseña'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="terminal-editor-box">
                  <div className="terminal-prompt">
                    C:\PIXELVAULT\RESEÑAS&gt; editar {fileSlug}
                  </div>
                  <textarea
                    className="terminal-textarea"
                    rows="9"
                    maxLength={2000}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Escribe tus recuerdos, logros o notas sobre esta partida..."
                  />
                  <div className="terminal-cursor-line">
                    &gt; <span className="blinking-block">█</span>
                  </div>
                </div>

                <div className="review-meta-row">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={contieneSpoilers}
                      onChange={(e) => setContieneSpoilers(e.target.checked)}
                    />
                    <span>CONTIENE SPOILERS</span>
                  </label>
                  <span>{review.length} / 2000 CAR</span>
                </div>
              </div>

              {errorMsg && (
                <div className="inventory-error-box">{errorMsg}</div>
              )}

              {savedNotice && (
                <div className="save-success-banner">
                  ✓ Datos de guardado y reseña actualizados correctamente en tu bóveda.
                </div>
              )}
            </section>
          </div>

          <div className="detail-card-footer">
            <div className="footer-save-info">
              <span className="save-icon">💾</span>
              <div>
                <p className="save-info-title">Listo para guardar en tu bóveda.</p>
                <p className="save-info-sub">Tus cambios se guardan directo en MySQL.</p>
              </div>
            </div>

            <div className="footer-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar
              </button>

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

        {/* Reseñas públicas de la comunidad */}
        <section className="save-point-card" style={{ marginTop: '2rem' }}>
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">💬</span> Reseñas de la comunidad
            </div>
            <div className="box-header-right">
              TOTAL [ <span className="highlight-green">{publicReviews.length}</span> ]
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {publicReviews.length === 0 ? (
              <p className="story-note-desc">
                Aún no hay reseñas públicas para este juego. ¡Sé el primero en compartir la tuya!
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {publicReviews.map((r) => {
                  const isHiddenSpoiler = r.contieneSpoilers && !revealedSpoilers[r.id];
                  return (
                    <article key={r.id} className="story-note-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <strong className="story-note-title">
                          {r.autor ?? r.username ?? 'Jugador'}
                        </strong>
                        <span className="story-note-desc">
                          {r.calificacion ? `♥ ${r.calificacion}/5 · ` : ''}
                          {r.contieneSpoilers ? '⚠ SPOILERS' : 'SIN SPOILERS'}
                        </span>
                      </div>

                      {isHiddenSpoiler ? (
                        <div>
                          <p className="story-note-desc" style={{ marginBottom: '0.5rem' }}>
                            Esta reseña está marcada con spoilers.
                          </p>
                          <button
                            type="button"
                            className="btn-cancel"
                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                            onClick={() =>
                              setRevealedSpoilers((prev) => ({ ...prev, [r.id]: true }))
                            }
                          >
                            Mostrar reseña
                          </button>
                        </div>
                      ) : (
                        <p className="story-note-desc" style={{ whiteSpace: 'pre-wrap' }}>
                          {r.texto}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="login-tagline">
          LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="ELIMINAR DE LA BÓVEDA"
        message={`¿Seguro que quieres eliminar "${game.title}" de tu inventario? Se perderá tu puntuación y reseña personal.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <Footer />
    </div>
  );
}