import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Inventory.css';
import './GameDetail.css';
import './AddGame.css';

const ratingLabels = {
  0: 'SIN VALORAR',
  1: '1 / 5 — NO FUE PARA MÍ',
  2: '2 / 5 — PASABLE',
  3: '3 / 5 — BUEN JUEGO',
  4: '4 / 5 — GRAN EXPERIENCIA',
  5: '5 / 5 — OBRA MAESTRA'
};

export default function AddGame() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    year: '',
    genre: '',
    developer: '',
    status: 'Pendiente',
    hours: '',
    rating: 0,
    review: ''
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverError, setCoverError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverError('');

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setCoverError('Solo se permiten imágenes JPG o PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCoverError('La imagen no puede superar los 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título del juego es obligatorio.';
    }

    if (!formData.platform) {
      newErrors.platform = 'Selecciona una plataforma.';
    }

    if (!formData.status) {
      newErrors.status = 'Selecciona el estado de tu partida.';
    }

    if (formData.year) {
      const yearNum = Number(formData.year);
      if (isNaN(yearNum) || yearNum < 1970 || yearNum > 2030) {
        newErrors.year = 'Ingresa un año válido (ej. 2024).';
      }
    }

    if (formData.hours && Number(formData.hours) < 0) {
      newErrors.hours = 'Las horas no pueden ser negativas.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSaving(true);
      try {
        console.log('Nuevo juego a guardar:', { ...formData, hasCover: !!coverPreview });
        // Aquí conectarás Axios: POST /api/inventario
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/inventario');
      } finally {
        setIsSaving(false);
      }
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
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">JUGADOR_01 / ARCHIVO PERSONAL</span>
        </div>

        <form className="save-point-card" onSubmit={handleSubmit} noValidate>
          {/* Header superior de la caja */}
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">💾</span> Nueva partida en tu bóveda
            </div>
            <div className="box-header-right">
              REGISTRO MANUAL [ <span className="highlight-green">+</span> ]
            </div>
          </div>

          {/* Encabezado del título */}
          <div className="add-game-header">
            <div>
              <h1 className="detail-game-title">Agregar juego</h1>
              <p className="detail-game-meta">
                Una nueva aventura merece su lugar en el inventario.
              </p>
            </div>
            <span className="required-legend">* CAMPOS OBLIGATORIOS</span>
          </div>

          {/* Cuerpo en 2 columnas */}
          <div className="detail-body">
            {/* Columna Izquierda: Portada */}
            <aside className="detail-sidebar">
              <span className="editor-label">PORTADA / OPCIONAL</span>

              <label className="cover-upload-box">
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  hidden
                />
                {coverPreview ? (
                  <img src={coverPreview} alt="Vista previa" className="cover-preview-img" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">⬆</span>
                    <p className="upload-title">Subir portada</p>
                    <p className="upload-desc">Arrastra una imagen o elige un archivo</p>
                    <span className="upload-specs">JPG, PNG · MÁX. 5 MB</span>
                  </div>
                )}
              </label>

              {coverError && <span className="error-text">{coverError}</span>}

              <p className="cover-helper-text">
                Formato recomendado: 2:3.<br />
                Puedes agregarla más tarde.
              </p>

              <div className="story-note-box">
                <p className="story-note-title">TU JUEGO, TU HISTORIA.</p>
                <p className="story-note-desc">
                  Las puntuaciones y reseñas se quedan en tu bóveda personal.
                </p>
              </div>

              <div className="manual-archive-tag">
                ■ ARCHIVO PERSONAL / MANUAL
              </div>
            </aside>

            {/* Columna Derecha: Formulario */}
            <section className="detail-editor">
              {/* SECCIÓN 01 */}
              <div className="form-section-header">
                <span className="section-title-green">01 / DATOS DEL JUEGO</span>
                <span className="section-subtitle-muted">EL INICIO DE LA AVENTURA</span>
              </div>

              <div className="add-field">
                <label className="editor-label">
                  TÍTULO DEL JUEGO <span className="highlight-green">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={`add-input ${errors.title ? 'input-error' : ''}`}
                  placeholder="Escribe el nombre del juego"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="add-row-2-1">
                <div className="add-field">
                  <label className="editor-label">
                    PLATAFORMA <span className="highlight-green">*</span>
                  </label>
                  <select
                    name="platform"
                    className={`status-select ${errors.platform ? 'input-error' : ''}`}
                    value={formData.platform}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una plataforma</option>
                    <option value="Steam / PC">Steam / PC</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Móvil">Móvil</option>
                    <option value="Otra">Otra</option>
                  </select>
                  {errors.platform && <span className="error-text">{errors.platform}</span>}
                </div>

                <div className="add-field">
                  <label className="editor-label">AÑO</label>
                  <input
                    type="text"
                    name="year"
                    maxLength="4"
                    className={`add-input ${errors.year ? 'input-error' : ''}`}
                    placeholder="Ej. 2024"
                    value={formData.year}
                    onChange={handleChange}
                  />
                  {errors.year && <span className="error-text">{errors.year}</span>}
                </div>
              </div>

              <div className="add-row-1-1">
                <div className="add-field">
                  <label className="editor-label">GÉNERO</label>
                  <select
                    name="genre"
                    className="status-select"
                    value={formData.genre}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un género</option>
                    <option value="Metroidvania">Metroidvania</option>
                    <option value="RPG">RPG</option>
                    <option value="Roguelike">Roguelike</option>
                    <option value="Plataformas">Plataformas</option>
                    <option value="Acción">Acción</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Simulador">Simulador</option>
                    <option value="Indie">Indie</option>
                  </select>
                </div>

                <div className="add-field">
                  <label className="editor-label">DESARROLLADOR</label>
                  <input
                    type="text"
                    name="developer"
                    className="add-input"
                    placeholder="Nombre del estudio"
                    value={formData.developer}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* SECCIÓN 02 */}
              <div className="form-section-header section-spacer">
                <span className="section-title-green">02 / TU PARTIDA</span>
                <span className="section-subtitle-muted">CADA MISIÓN CUENTA</span>
              </div>

              <div className="add-row-2-1">
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
                    <option value="Pendiente">Pendiente</option>
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
                    placeholder="0 h"
                    value={formData.hours}
                    onChange={handleChange}
                  />
                  {errors.hours && <span className="error-text">{errors.hours}</span>}
                </div>
              </div>

              <div className="add-rating-row">
                <div>
                  <label className="editor-label">TU PUNTUACIÓN / OPCIONAL</label>
                  <div className="interactive-hearts">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className="heart-btn"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            rating: formData.rating === num ? 0 : num
                          })
                        }
                        aria-label={`Calificar con ${num} corazones`}
                      >
                        <svg
                          width="24"
                          height="22"
                          viewBox="0 0 9 8"
                          fill={num <= formData.rating ? '#ff79c6' : '#30363d'}
                        >
                          <path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1V0z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rating-right-info">
                  <span className="rating-caption">{ratingLabels[formData.rating]}</span>
                  <span className="rating-helper">Elige de 1 a 5 corazones.</span>
                </div>
              </div>

              {/* SECCIÓN 03 */}
              <div className="form-section-header section-spacer">
                <span className="section-title-green">03 / RESEÑA PERSONAL</span>
                <span className="section-subtitle-muted">OPCIONAL</span>
              </div>

              <div className="terminal-editor-box">
                <div className="terminal-prompt">
                  C:\PIXELVAULT\RESEÑAS&gt; nueva_entrada.txt
                </div>
                <textarea
                  name="review"
                  className="terminal-textarea"
                  rows="5"
                  maxLength={2000}
                  value={formData.review}
                  onChange={handleChange}
                  placeholder={'¿Qué te hizo sentir este juego?\nGuarda tus primeras impresiones o vuelve después para contarlo.'}
                />
                <div className="terminal-cursor-line">
                  &gt; <span className="blinking-block">█</span>
                </div>
              </div>

              <div className="review-meta-row">
                <span>SOLO PARA TI / PUEDES EDITARLA DESPUÉS</span>
                <span>{formData.review.length} / 2,000 CAR</span>
              </div>
            </section>
          </div>

          {/* Footer de la tarjeta */}
          <div className="detail-card-footer">
            <div className="footer-save-info">
              <span className="save-icon">💾</span>
              <div>
                <p className="save-info-title">Tu próxima aventura, a salvo en tu bóveda.</p>
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
                {isSaving ? 'GUARDANDO...' : '⊕ Agregar juego'}
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