import { useState } from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hollow-knight.jpg';
import lockIcon from '../assets/candado.svg';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginApi, googleLoginApi } from '../services/authService';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const { token, user } = await loginApi({
          email: formData.email,
          password: formData.password,
          recordarme: Boolean(formData.rememberMe)
        });

        login(user, token);
        navigate(user.role === 'ADMIN' ? '/admin' : '/inventario');
      } catch (error) {
        const backendMsg =
          error.response?.data?.mensaje ||
          error.response?.data?.message ||
          'Correo o contraseña incorrectos.';
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
        'No se pudo iniciar sesión con Google.';
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
            C:\PIXELVAULT\AUTH&gt; <span className="console-command">inicio</span>
          </span>
          <span className="console-info">ARCHIVO PERSONAL DE JUEGOS</span>
        </div>
      </div>

      <main className="login-container">
        <div className="box-header">
          <div className="box-header-left">
            <img src={lockIcon} alt="Candado" className="lock-icon-img" /> Punto de acceso
          </div>
          <div className="box-header-right">
            INICIO DE SESIÓN [ <span className="highlight-green">01</span> ]
          </div>
        </div>

        <div className="box-content">
          <section className="login-hero">
            <div className="hero-tag">
              <span className="tag-highlight">P1</span> ¿LISTO PARA SEGUIR?
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
              <p className="hero-subtitle">Todo en una bóveda.</p>
              <div className="hero-footer-text">EN LA BÓVEDA / HOLLOW KNIGHT</div>
            </div>
          </section>

          <section className="login-form-section">
            <div className="form-header">
              <h1>Bienvenido de vuelta.</h1>
              <p>Inicia sesión para continuar desde donde lo dejaste.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label>01 / CORREO ELECTRÓNICO</label>
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

              <div className="input-group">
                <label>02 / CONTRASEÑA</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Recuérdame
                </label>
                <Link to="/recuperar" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'INICIANDO...' : 'Iniciar sesión ➔'}
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
                ¿Nuevo jugador? <Link to="/registro">Crea una cuenta ↗</Link>
              </div>
            </form>
          </section>
        </div>

        <div className="box-footer">
          <div className="box-footer-left">
            <span className="highlight-green">■</span> CONEXIÓN SEGURA
          </div>
          <div className="box-footer-right">TU ARCHIVO DE GUARDADO ESTÁ ESPERANDO.</div>
        </div>
      </main>

      <div className="login-tagline">
        LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
      </div>

      <footer className="login-footer">
        <div className="footer-left">
          <span className="footer-status">■ SISTEMA EN LÍNEA</span>
          <span className="footer-sub"> // LISTO CUANDO TÚ LO ESTÉS</span>
        </div>
        <div className="footer-right">
          PIXELVAULT v1.0 &nbsp;·&nbsp; NO SE PERDIÓ EL PROGRESO.
        </div>
      </footer>
    </div>
  );
}