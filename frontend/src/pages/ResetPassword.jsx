import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../services/authService';
import './Login.css';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    token: tokenFromUrl,
    nuevaPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors((prev) => ({ ...prev, [name]: null, submit: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.token.trim()) {
      newErrors.token = 'El token de recuperación es obligatorio.';
    }

    if (!formData.nuevaPassword) {
      newErrors.nuevaPassword = 'Ingresa tu nueva contraseña.';
    } else if (!PASSWORD_REGEX.test(formData.nuevaPassword)) {
      newErrors.nuevaPassword =
        'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.';
    }

    if (formData.nuevaPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPasswordApi({
        token: formData.token.trim(),
        nuevaPassword: formData.nuevaPassword
      });
      setSuccessMsg('¡Contraseña actualizada! Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const backendMsg =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'El enlace es inválido o ya expiró. Solicita uno nuevo.';
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
            <span className="status-dot">●</span>
            <span className="status-text">SISTEMA DE RECUPERACIÓN</span>
            <span className="status-separator">//</span>
            <span className="status-highlight">ACCESO SEGURO</span>
          </div>
        </div>
      </header>

      <div className="console-header-wrapper">
        <div className="login-header-bottom">
          <span className="console-path">
            C:\PIXELVAULT\AUTH&gt; <span className="console-command">reset-password.exe</span>
          </span>
          <span className="console-info">PROTOCOLO JWT / BCRYPT</span>
        </div>
      </div>

      <main className="login-container">
        <div className="box-header">
          <div className="box-header-left">
            <span className="highlight-green">🔑</span> Restablecer contraseña
          </div>
          <div className="box-header-right">PASO 02 / 02</div>
        </div>

        <div className="box-content" style={{ gridTemplateColumns: '1fr', minHeight: 'auto' }}>
          <section className="login-form-section" style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
            <div className="form-header">
              <h1>Nueva llave de acceso</h1>
              <p>Crea una contraseña segura para volver a entrar a tu bóveda.</p>
            </div>

            {successMsg && <div className="recovery-success-msg">✓ {successMsg}</div>}
            {errors.submit && <div className="error-text" style={{ marginBottom: '1rem' }}>⚠ {errors.submit}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {!tokenFromUrl && (
                <div className="input-group compact-group">
                  <label htmlFor="token">TOKEN DE RECUPERACIÓN</label>
                  <input
                    id="token"
                    type="text"
                    name="token"
                    placeholder="Pega el código recibido en tu correo"
                    value={formData.token}
                    onChange={handleChange}
                    className={errors.token ? 'input-error' : ''}
                  />
                  {errors.token && <span className="error-text">{errors.token}</span>}
                </div>
              )}

              <div className="input-group compact-group">
                <label htmlFor="nuevaPassword">NUEVA CONTRASEÑA</label>
                <input
                  id="nuevaPassword"
                  type="password"
                  name="nuevaPassword"
                  placeholder="••••••••"
                  value={formData.nuevaPassword}
                  onChange={handleChange}
                  className={errors.nuevaPassword ? 'input-error' : ''}
                />
                <span className="input-hint">
                  Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.
                </span>
                {errors.nuevaPassword && (
                  <span className="error-text">{errors.nuevaPassword}</span>
                )}
              </div>

              <div className="input-group compact-group">
                <label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                <span>{isLoading ? 'ACTUALIZANDO...' : 'GUARDAR NUEVA CONTRASEÑA'}</span>
                <span>→</span>
              </button>
            </form>

            <div className="back-to-login">
              <Link to="/login">← Volver al inicio de sesión</Link>
            </div>
          </section>
        </div>

        <div className="box-footer">
          <span>ENLACE DE UN SOLO USO</span>
          <span className="highlight-green">PIXELVAULT v1.0</span>
        </div>
      </main>

      <div className="login-tagline">
        LOS BUENOS JUEGOS MERECEN UNA PARTIDA GUARDADA.
      </div>
    </div>
  );
}