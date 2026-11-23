import { useState } from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';
// Asegúrate de importar la imagen correctamente. Ajusta la ruta si es necesario.
import heroImage from '../assets/hollow-knight.jpg';
import pixelLogo from '../assets/pixel-logo.svg';
import lockIcon from '../assets/candado.svg';
import { Link, useNavigate } from 'react-router-dom';
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
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
        console.log("Datos a enviar:", formData);
        // Simulación del backend
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Login exitoso");
  const emailLower = formData.email.toLowerCase();
        let role = 'USER';
        let name = 'Jugador_01';
        let avatar = 'P1';

        if (emailLower.includes('admin')) {
          role = 'ADMIN';
          name = 'Administrador';
          avatar = 'AD';
        } else if (emailLower.includes('mod')) {
          role = 'MODERATOR';
          name = 'Moderador_01';
          avatar = 'MD';
        }

        login({ name, email: formData.email, role, avatar }, 'token-jwt-simulado');
        navigate(role === 'ADMIN' ? '/admin' : '/inventario');
      } catch (error) {
        setErrors({ submit: 'Error al iniciar sesión. Verifica tus datos.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-wrapper">

      {/* Header externo superior (Logo y estado) */}
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

      {/* --- NUEVO CONTENEDOR PARA LA CONSOLA --- */}
      {/* Esto asegura que se alinee con la caja principal de abajo */}
      <div className="console-header-wrapper">
        <div className="login-header-bottom">
          <span className="console-path">C:\PIXELVAULT\AUTH&gt; <span className="console-command">inicio</span></span>
          <span className="console-info">ARCHIVO PERSONAL DE JUEGOS</span>
        </div>
      </div>

      {/* Contenedor Principal (La Bóveda) */}
      <main className="login-container">

        {/* Barra superior de la caja */}
        <div className="box-header">
          <div className="box-header-left">
            <img src={lockIcon} alt="Candado" className="lock-icon-img" /> Punto de acceso
          </div>
          <div className="box-header-right">
            INICIO DE SESIÓN [ <span className="highlight-green">01</span> ]
          </div>
        </div>

        <div className="box-content">
          {/* Columna Izquierda: Imagen */}
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
              <div className="hero-footer-text">
                EN LA BÓVEDA / HOLLOW KNIGHT
              </div>
            </div>
          </section>

          {/* Columna Derecha: Formulario */}
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
                <Link to="/recuperar" className="forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'INICIANDO...' : 'Iniciar sesión ➔'}
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
                ¿Nuevo jugador? <Link to="/registro">Crea una cuenta ↗</Link>
              </div>
            </form>
          </section>
        </div>

        {/* Barra inferior dentro de la caja */}
        <div className="box-footer">
          <div className="box-footer-left">
            <span className="highlight-green">■</span> CONEXIÓN SEGURA
          </div>
          <div className="box-footer-right">
            TU ARCHIVO DE GUARDADO ESTÁ ESPERANDO.
          </div>
        </div>
      </main>

      {/* Frase centrada debajo de la bóveda */}
      <div className="login-tagline">
        LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
      </div>

      {/* Footer inferior de lado a lado */}
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