import { useState } from 'react';
import { Link } from 'react-router-dom'; // Si aún no usas react-router-dom, cambia <Link to="/login"> por <a href="/login">
import './Login.css';
import heroImage from '../assets/hollow-knight.jpg';
import lockIcon from '../assets/candado.svg';
import { forgotPasswordApi } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (isSent) setIsSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPasswordApi(email.trim());
      setIsSent(true);
    } catch (err) {
      const backendMsg =
      err.response?.data?.mensaje ||
      err.response?.data?.message ||
      'No se pudo enviar el enlace. Inténtalo de nuevo.';
      setError(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Header externo superior */}
      <header className="login-header-container">
        <div className="login-header-top">
          <div className="logo">
            <span className="logo-icon">▣</span> PixelVault
          </div>
          <div className="status-bar">
            <span className="status-dot">■</span>
            <span className="status-text">JUGADOR DESCONECTADO</span>
            <span className="status-separator">//</span>
            <span className="status-highlight">ESPERANDO INICIO DE SESIÓN</span>
          </div>
        </div>
      </header>

      {/* Consola */}
      <div className="console-header-wrapper">
        <div className="login-header-bottom">
          <span className="console-path">
            C:\PIXELVAULT\AUTH&gt; <span className="console-command">recuperar</span>
          </span>
          <span className="console-info">ARCHIVO PERSONAL DE JUEGOS</span>
        </div>
      </div>

      {/* Contenedor Principal (La Bóveda) */}
      <main className="login-container">
        <div className="box-header">
          <div className="box-header-left">
            <img src={lockIcon} alt="Candado" className="lock-icon-img" /> Recuperar acceso
          </div>
          <div className="box-header-right">
            RECUPERACIÓN [ <span className="highlight-green">01</span> ]
          </div>
        </div>

        <div className="box-content">
          {/* Columna Izquierda: Imagen Hero */}
          <section className="login-hero">
            <div className="hero-tag">
              <span className="tag-highlight">P1</span> NO ES UN GAME OVER
            </div>

            <img src={heroImage} alt="Hollow Knight Hero" className="hero-img" />

            <div className="hero-overlay">
              <div className="hearts">
                {[1, 2, 3].map((n) => (
                  <svg key={n} width="18" height="16" viewBox="0 0 9 8" fill="#ff79c6">
                    <path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1V0z" />
                  </svg>
                ))}
              </div>
              <h2>Tu partida</h2>
              <h2>no termina</h2>
              <h2>aquí.</h2>
              <p className="hero-subtitle">Vuelve a entrar. Tu bóveda te espera.</p>
              <div className="hero-footer-text">EN LA BÓVEDA / HOLLOW KNIGHT</div>
            </div>
          </section>

          {/* Columna Derecha: Formulario de Recuperación */}
          <section className="login-form-section">
            <div className="form-header">
              <h1>¿Olvidaste tu contraseña?</h1>
              <p>
                No pasa nada. Introduce el correo de tu cuenta y te enviaremos un enlace
                para crear una nueva contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label>01 / CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jugador@ejemplo.com"
                  value={email}
                  onChange={handleChange}
                  className={error ? 'input-error' : ''}
                />
                {error && <span className="error-text">{error}</span>}
              </div>

              {isSent && (
                <div className="recovery-success-msg">
                  ✓ Enlace enviado a <strong>{email}</strong>. Revisa tu bandeja.
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                <span>{isLoading ? 'ENVIANDO...' : 'Enviar enlace de recuperación'}</span>
                <span className="btn-arrow">➔</span>
              </button>

              <div className="back-to-login">
                <Link to="/login">← Volver al inicio de sesión</Link>
              </div>

              {/* Caja de aviso de Spam */}
              <div className="spam-notice-box">
                <div className="spam-notice-bar"></div>
                <div className="spam-notice-content">
                  <p className="spam-notice-title">¿No encuentras el correo?</p>
                  <p className="spam-notice-desc">
                    Revisa la carpeta de spam. El enlace llegará en unos minutos.
                  </p>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Barra inferior dentro de la caja */}
        <div className="box-footer">
          <div className="box-footer-left">
            <span className="highlight-green">■</span> CONEXIÓN SEGURA
          </div>
          <div className="box-footer-right">TU PROGRESO SIGUE A SALVO.</div>
        </div>
      </main>

      <div className="login-tagline">
        LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
      </div>

      <footer className="login-footer">
        <div className="footer-left">
          <span className="footer-status">■ SISTEMA EN LÍNEA</span>
          <span>// LISTO CUANDO TÚ LO ESTÉS</span>
        </div>
        <div className="footer-right">
          PIXELVAULT v1.0 &nbsp;·&nbsp; NO SE PERDIÓ EL PROGRESO.
        </div>
      </footer>
    </div>
  );
}