import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import heroImage from '../assets/hollow-knight.jpg';
import lockIcon from '../assets/candado.svg';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regla de seguridad de tu rúbrica: mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData({ ...formData, [name]: fieldValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio.';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Debe tener al menos 3 caracteres.';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial (@$!%*?&).';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!formData.terms) {
      newErrors.terms = 'Debes aceptar los términos y la política de privacidad.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        console.log('Datos de registro:', formData);
        // Aquí conectarás Axios (POST /api/auth/register)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Registro exitoso');
      } catch (err) {
        setErrors({ submit: 'No se pudo crear la cuenta. Intenta con otro correo.' });
      } finally {
        setIsLoading(false);
      }
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
            C:\PIXELVAULT\AUTH&gt; <span className="console-command">registro</span>
          </span>
          <span className="console-info">ARCHIVO PERSONAL DE JUEGOS</span>
        </div>
      </div>

      {/* Contenedor Principal (La Bóveda) */}
      <main className="login-container">
        <div className="box-header">
          <div className="box-header-left">
            <img src={lockIcon} alt="Candado" className="lock-icon-img" /> Nueva partida
          </div>
          <div className="box-header-right">
            CREAR CUENTA [ <span className="highlight-green">01</span> ]
          </div>
        </div>

        <div className="box-content">
          {/* Columna Izquierda: Imagen Hero */}
          <section className="login-hero">
            <div className="hero-tag">
              <span className="tag-highlight">P1</span> UN NUEVO JUGADOR SE UNE
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
              <h2>Cada misión.</h2>
              <h2>Cada crédito</h2>
              <h2>final.</h2>
              <p className="hero-subtitle">Tu historia empieza en una bóveda.</p>
              <div className="hero-footer-text">EN LA BÓVEDA / HOLLOW KNIGHT</div>
            </div>
          </section>

          {/* Columna Derecha: Formulario de Registro */}
          <section className="login-form-section register-form-section">
            <div className="form-header">
              <h1>Crea una cuenta</h1>
              <p>Guarda tus juegos, tus logros y cada aventura en un solo lugar.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* 01 / NOMBRE DE USUARIO */}
              <div className="input-group compact-group">
                <label>01 / NOMBRE DE USUARIO</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Elige tu nombre de jugador"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'input-error' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              {/* 02 / CORREO ELECTRÓNICO */}
              <div className="input-group compact-group">
                <label>02 / CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jugador@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* 03 / CONTRASEÑA */}
              <div className="input-group compact-group">
                <label>03 / CONTRASEÑA</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Crea una contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar contraseña"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      {!showPassword && <line x1="2" y1="2" x2="22" y2="22" />}
                    </svg>
                  </button>
                </div>
                <span className="input-hint">
                  Mín. 8 caracteres, con mayúscula, número y carácter especial.
                </span>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* 04 / CONFIRMAR CONTRASEÑA */}
              <div className="input-group compact-group">
                <label>04 / CONFIRMAR CONTRASEÑA</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Mostrar confirmación de contraseña"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      {!showConfirmPassword && <line x1="2" y1="2" x2="22" y2="22" />}
                    </svg>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Términos y condiciones */}
              <div className="terms-group">
                <label className="checkbox-container terms-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                  <span>
                    Acepto los <a href="#terminos" className="pink-inline-link">Términos de uso</a> y la{' '}
                    <a href="#privacidad" className="pink-inline-link">Política de privacidad</a>.
                  </span>
                </label>
                {errors.terms && <span className="error-text">{errors.terms}</span>}
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                <span>{isLoading ? 'CREANDO CUENTA...' : 'Crear cuenta'}</span>
                <span className="btn-arrow">➔</span>
              </button>

              <div className="divider">
                <span>O CONTINÚA CON</span>
              </div>

              <button type="button" className="btn-steam">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                </svg>
                <span>Continúa con Steam</span>
              </button>

              <div className="register-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión ↗</Link>
              </div>
            </form>
          </section>
        </div>

        {/* Barra inferior dentro de la caja */}
        <div className="box-footer">
          <div className="box-footer-left">
            <span className="highlight-green">■</span> CONEXIÓN SEGURA
          </div>
          <div className="box-footer-right">TU PRIMER PUNTO DE GUARDADO EMPIEZA AQUÍ.</div>
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