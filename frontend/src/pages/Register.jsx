import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hollow-knight.jpg';
import lockIcon from '../assets/candado.svg';
import { GoogleLogin } from '@react-oauth/google';
import { registerApi, googleLoginApi } from '../services/authService';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

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
      newErrors.password = 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial.';
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
        await registerApi({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        navigate('/login');
      } catch (error) {
        const backendMsg =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          'No se pudo completar el registro. Verifica tus datos.';
        setErrors({ submit: backendMsg });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrors({});
    try {
      const { token, user } = await googleLoginApi(credentialResponse.credential);
      login(user, token);
      navigate(user.role === 'ADMIN' ? '/admin' : '/inventario');
    } catch (error) {
      const backendMsg =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'No se pudo continuar con Google.';
      setErrors({ submit: backendMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
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

      <div className="console-header-wrapper">
        <div className="login-header-bottom">
          <span className="console-path">
            C:\PIXELVAULT\AUTH&gt; <span className="console-command">registro</span>
          </span>
          <span className="console-info">ARCHIVO PERSONAL DE JUEGOS</span>
        </div>
      </div>

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

          <section className="login-form-section register-form-section">
            <div className="form-header">
              <h1>Crea una cuenta</h1>
              <p>Guarda tus juegos, tus logros y cada aventura en un solo lugar.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
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

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrors({ submit: 'No se pudo conectar con Google.' })}
                  theme="filled_black"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

              <div className="register-link">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión ↗</Link>
              </div>
            </form>
          </section>
        </div>

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