import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Inventory.css';
import './GameDetail.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="inventory-wrapper">
      <Navbar />

      <main className="detail-main">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">PERFIL DE CUENTA</span>
        </div>

        <section className="save-point-card">
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">▣</span> Tarjeta de jugador
            </div>
            <div className="box-header-right">
              ROL [ <span className="highlight-green">{user?.role || 'USER'}</span> ]
            </div>
          </div>

          <div className="detail-body">
            <aside className="detail-sidebar" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 1.2rem auto',
                  border: '2px solid var(--accent-pink)',
                  backgroundColor: '#0b0e14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '2rem',
                  color: 'var(--accent-pink)'
                }}
              >
                {user?.avatar || 'P1'}
              </div>
              <p className="story-note-title">{user?.name}</p>
              <p className="story-note-desc">{user?.email}</p>
            </aside>

            <div className="detail-editor">
              <div className="mission-stat">
                <span className="mission-label">NOMBRE DE USUARIO</span>
                <span className="mission-value">{user?.name || 'Jugador_01'}</span>
              </div>

              <div className="mission-stat">
                <span className="mission-label">CORREO ELECTRÓNICO</span>
                <span className="mission-value">{user?.email}</span>
              </div>

              <div className="mission-stat">
                <span className="mission-label">NIVEL DE ACCESO</span>
                <span className="mission-value highlight-green">{user?.role || 'USER'}</span>
              </div>

              <div className="story-note-box">
                <p className="story-note-title">CONEXIÓN CON STEAM</p>
                <p className="story-note-desc">
                  Vinculación lista para sincronizar tu biblioteca en cuanto el backend esté activo.
                </p>
              </div>
            </div>
          </div>

          <div className="detail-card-footer">
            <div className="footer-save-info">
              <span className="save-icon">🔒</span>
              <div>
                <p className="save-info-title">Sesión activa protegida con JWT.</p>
                <p className="save-info-sub">Puedes cerrar sesión en cualquier momento.</p>
              </div>
            </div>

            <div className="footer-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/inventario')}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn-save-data"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}