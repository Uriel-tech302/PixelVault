import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Inventory.css';
import './GameDetail.css';
import './AddGame.css';
import HeartRating, { ratingLabels } from '../components/HeartRating';
import {
  getCatalogoJuegos,
  getPlataformas,
  addGameToLibrary
} from '../services/gameService';

export default function AddGame() {
  const navigate = useNavigate();

  const [juegos, setJuegos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  const [formData, setFormData] = useState({
    juegoId: '',
    plataformaId: '',
    status: 'Jugando',
    hours: '0',
    lastSession: '',
    rating: 0
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCatalogs = async () => {
      setIsLoadingCatalogs(true);
      setCatalogError('');
      try {
        const [juegosData, plataformasData] = await Promise.all([
          getCatalogoJuegos(),
          getPlataformas()
        ]);
        if (!active) return;
        setJuegos(juegosData);
        setPlataformas(plataformasData);
      } catch (error) {
        if (!active) return;
        setCatalogError('No se pudieron cargar los catálogos de juegos y plataformas.');
      } finally {
        if (active) setIsLoadingCatalogs(false);
      }
    };

    loadCatalogs();
    return () => {
      active = false;
    };
  }, []);

  const selectedGame = juegos.find((j) => String(j.id) === String(formData.juegoId));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.juegoId) {
      newErrors.juegoId = 'Selecciona un juego del catálogo.';
    }

    if (!formData.plataformaId) {
      newErrors.plataformaId = 'Selecciona una plataforma.';
    }

    if (!formData.status) {
      newErrors.status = 'Selecciona el estado de tu partida.';
    }

    if (formData.hours !== '' && Number(formData.hours) < 0) {
      newErrors.hours = 'Las horas no pueden ser negativas.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await addGameToLibrary({
        juegoId: formData.juegoId,
        plataformaId: formData.plataformaId,
        status: formData.status,
        hours: formData.hours === '' ? 0 : Number(formData.hours),
        lastSession: formData.lastSession || null,
        rating: formData.rating > 0 ? formData.rating : null
      });
      navigate('/inventario');
    } catch (error) {
      const backendMsg =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'No se pudo agregar el juego (puede que ya esté en tu bóveda).';
      setSubmitError(backendMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="inventory-wrapper">
      <Navbar showAddButton={false} />

      <main className="detail-main">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">ARCHIVO PERSONAL / CATÁLOGO</span>
        </div>

        <form className="save-point-card" onSubmit={handleSubmit} noValidate>
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">💾</span> Nueva partida en tu bóveda
            </div>
            <div className="box-header-right">
              REGISTRO EN BÓVEDA [ <span className="highlight-green">+</span> ]
            </div>
          </div>

          <div className="add-game-header">
            <div>
              <h1 className="detail-game-title">Agregar juego</h1>
              <p className="detail-game-meta">
                Elige un título del catálogo para guardarlo en tu inventario.
              </p>
            </div>
            <span className="required-legend">* CAMPOS OBLIGATORIOS</span>
          </div>

          {catalogError && (
            <div className="inventory-error-box" style={{ margin: '1.5rem 2rem 0' }}>
              {catalogError}
            </div>
          )}

          <div className="detail-body">
            <aside className="detail-sidebar">
              <span className="editor-label">PORTADA DEL CATÁLOGO</span>

              <div className="cover-upload-box" style={{ cursor: 'default' }}>
                {selectedGame?.portadaUrl ? (
                  <img
                    src={selectedGame.portadaUrl}
                    alt={selectedGame.titulo}
                    className="cover-preview-img"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">🎮</span>
                    <p className="upload-title">Vista previa</p>
                    <p className="upload-desc">
                      Selecciona un juego del catálogo para ver su portada.
                    </p>
                  </div>
                )}
              </div>

              <div className="story-note-box">
                <p className="story-note-title">TU JUEGO, TU HISTORIA.</p>
                <p className="story-note-desc">
                  Las puntuaciones y horas jugadas se guardan en tu bóveda personal en MySQL.
                </p>
              </div>

              <div className="manual-archive-tag">
                ■ CATÁLOGO OFICIAL PIXELVAULT
              </div>
            </aside>

            <section className="detail-editor">
              <div className="form-section-header">
                <span className="section-title-green">01 / DATOS DEL JUEGO</span>
                <span className="section-subtitle-muted">EL INICIO DE LA AVENTURA</span>
              </div>

              <div className="add-field">
                <label className="editor-label">
                  JUEGO DEL CATÁLOGO <span className="highlight-green">*</span>
                </label>
                <select
                  name="juegoId"
                  className={`status-select ${errors.juegoId ? 'input-error' : ''}`}
                  value={formData.juegoId}
                  onChange={handleChange}
                  disabled={isLoadingCatalogs}
                >
                  <option value="">
                    {isLoadingCatalogs ? 'Cargando catálogo...' : 'Selecciona un juego'}
                  </option>
                  {juegos.map((juego) => (
                    <option key={juego.id} value={juego.id}>
                      {juego.titulo} {juego.anioLanzamiento ? `(${juego.anioLanzamiento})` : ''}
                    </option>
                  ))}
                </select>
                {errors.juegoId && <span className="error-text">{errors.juegoId}</span>}
              </div>

              <div className="add-row-2-1">
                <div className="add-field">
                  <label className="editor-label">
                    PLATAFORMA <span className="highlight-green">*</span>
                  </label>
                  <select
                    name="plataformaId"
                    className={`status-select ${errors.plataformaId ? 'input-error' : ''}`}
                    value={formData.plataformaId}
                    onChange={handleChange}
                    disabled={isLoadingCatalogs}
                  >
                    <option value="">
                      {isLoadingCatalogs ? 'Cargando plataformas...' : 'Selecciona una plataforma'}
                    </option>
                    {plataformas.map((plat) => (
                      <option key={plat.id} value={plat.id}>
                        {plat.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.plataformaId && <span className="error-text">{errors.plataformaId}</span>}
                </div>

                <div className="add-field">
                  <label className="editor-label">AÑO</label>
                  <input
                    type="text"
                    className="add-input"
                    value={selectedGame?.anioLanzamiento || ''}
                    placeholder="—"
                    readOnly
                  />
                </div>
              </div>

              <div className="add-row-1-1">
                <div className="add-field">
                  <label className="editor-label">GÉNEROS</label>
                  <input
                    type="text"
                    className="add-input"
                    value={selectedGame?.generos?.join(', ') || ''}
                    placeholder="—"
                    readOnly
                  />
                </div>

                <div className="add-field">
                  <label className="editor-label">DESARROLLADOR</label>
                  <input
                    type="text"
                    className="add-input"
                    value={selectedGame?.desarrollador || ''}
                    placeholder="—"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-section-header section-spacer">
                <span className="section-title-green">02 / TU PARTIDA</span>
                <span className="section-subtitle-muted">CADA MISIÓN CUENTA</span>
              </div>

              <div className="add-row-1-1">
                <div className="add-field">
                  <label className="editor-label">
                    ESTADO DE JUEGO <span className="highlight-green">*</span>
                  </label>
                  <select
                    name="status"
                    className={`status-select ${errors.status ? 'input-error' : ''}`}
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Jugando">Jugando</option>
                    <option value="Completado">Completado</option>
                    <option value="Abandonado">Abandonado</option>
                  </select>
                  {errors.status && <span className="error-text">{errors.status}</span>}
                </div>

                <div className="add-field">
                  <label className="editor-label">HORAS JUGADAS</label>
                  <input
                    type="number"
                    name="hours"
                    min="0"
                    step="0.5"
                    className={`add-input ${errors.hours ? 'input-error' : ''}`}
                    placeholder="0"
                    value={formData.hours}
                    onChange={handleChange}
                  />
                  {errors.hours && <span className="error-text">{errors.hours}</span>}
                </div>
              </div>

              <div className="add-field">
                <label className="editor-label">ÚLTIMA SESIÓN / OPCIONAL</label>
                <input
                  type="date"
                  name="lastSession"
                  max={today}
                  className="add-input"
                  value={formData.lastSession}
                  onChange={handleChange}
                />
              </div>

              <div className="add-rating-row">
                <div>
                  <label className="editor-label">TU PUNTUACIÓN / OPCIONAL</label>
                  <HeartRating
                    rating={formData.rating}
                    onChange={(val) => setFormData((prev) => ({ ...prev, rating: val }))}
                    allowClear={true}
                  />
                </div>

                <div className="rating-right-info">
                  <span className="rating-caption">
                    {ratingLabels[formData.rating] || 'Sin puntuación'}
                  </span>
                  <span className="rating-helper">Elige de 1 a 5 corazones.</span>
                </div>
              </div>

              {submitError && (
                <div className="inventory-error-box" style={{ marginTop: '1.2rem' }}>
                  {submitError}
                </div>
              )}
            </section>
          </div>

          <div className="detail-card-footer">
            <div className="footer-save-info">
              <span className="save-icon">💾</span>
              <div>
                <p className="save-info-title">Tu próxima aventura, a salvo en tu bóveda.</p>
                <p className="save-info-sub">Se guardará directamente en tu cuenta.</p>
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
              <button
                type="submit"
                className="btn-save-data"
                disabled={isSaving || isLoadingCatalogs}
              >
                {isSaving ? 'GUARDANDO...' : '⊕ Agregar juego'}
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