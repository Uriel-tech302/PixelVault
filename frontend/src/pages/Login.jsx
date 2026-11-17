import { useState } from 'react';
import './Login.css';
// Asegúrate de importar la imagen correctamente. Ajusta la ruta si es necesario.
import heroImage from '../assets/hollow-knight.jpg'; 
import pixelLogo from '../assets/pixel-logo.svg';
import lockIcon from '../assets/candado.svg';
export default function Login() {
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
        // Aquí simulo la espera. Más adelante usarás Axios aquí.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulación de éxito. Aquí guardarías el JWT.
        console.log("Login exitoso");
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
                <div className="hearts">❤️❤️❤️</div>
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
                 <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'INICIANDO...' : 'Iniciar sesión ➔'}
              </button>
              
              <div className="divider">
                 <span>O CONTINÚA CON</span>
              </div>

              <button type="button" className="btn-steam">
                <span className="steam-icon">⚙️</span> Continúa con Steam
              </button>

              <div className="register-link">
                 ¿Nuevo jugador? <a href="#">Crea una cuenta ↗</a>
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