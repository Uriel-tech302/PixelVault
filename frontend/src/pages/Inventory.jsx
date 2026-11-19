import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Inventory.css';
import pixelLogo from '../assets/pixel-logo.svg';

export default function Inventory() {
  // Datos simulados (Mock) que después vendrán de tu API/Steam
  const mockGames = [
    { id: 1, title: 'Hollow Knight', year: '2017', genre: 'Metroidvania', status: 'COMPLETADO', hours: '48.2 h', hearts: 3, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg' },
    { id: 2, title: 'Stardew Valley', year: '2016', genre: 'Simulador de granja', status: 'JUGANDO', hours: '126.4 h', hearts: 3, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg' },
    { id: 3, title: 'Hades', year: '2020', genre: 'Roguelike', status: 'JUGANDO', hours: '32.8 h', hearts: 3, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg' },
    { id: 4, title: 'Celeste', year: '2018', genre: 'Plataformas', status: 'COMPLETADO', hours: '10.6 h', hearts: 3, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/library_600x900.jpg' },
    { id: 5, title: 'Dead Cells', year: '2018', genre: 'Roguelike', status: 'ABANDONADO', hours: '14.1 h', hearts: 2, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/library_600x900.jpg' }
  ];

  const [activeTab, setActiveTab] = useState('Todos');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="inventory-wrapper">
      {/* NAVBAR SUPERIOR */}
      <nav className="inventory-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">▣</span> PixelVault
        </div>
        
        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Buscar en tu colección... /" />
        </div>

        <div className="navbar-user-controls">
          <button className="btn-add-game">
            <span className="btn-add-icon">⭘</span> + Agregar juego
          </button>
          
          <div className="user-profile-menu">
            <button 
              className="profile-btn" 
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

      <main className="inventory-content">
        {/* ENCABEZADO Y ESTADÍSTICAS */}
        <header className="inventory-header">
          <div className="header-info">
            <span className="player-tag">JUGADOR_01 / ARCHIVO PERSONAL DE JUEGOS</span>
            <h1 className="inventory-title">El inventario</h1>
            <p className="inventory-subtitle">Cada misión. Cada final. Todo en una bóveda.</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-box">
              <span className="stat-value highlight-orange">12</span>
              <span className="stat-label">JUEGOS</span>
            </div>
            <div className="stat-box">
              <span className="stat-value highlight-orange">435 h</span>
              <span className="stat-label">TIEMPO JUGADO</span>
            </div>
            <div className="stat-box">
              <span className="stat-value highlight-orange">50%</span>
              <span className="stat-label">COMPLETADO</span>
            </div>
          </div>
        </header>

        {/* PESTAÑAS DE FILTRO */}
        <div className="inventory-tabs">
          <button className={`tab-btn ${activeTab === 'Todos' ? 'active' : ''}`} onClick={() => setActiveTab('Todos')}>
            ▣ Todos <span className="tab-count">12</span>
          </button>
          <button className={`tab-btn ${activeTab === 'Jugando' ? 'active' : ''}`} onClick={() => setActiveTab('Jugando')}>
            ⚔ Jugando <span className="tab-count">04</span>
          </button>
          <button className={`tab-btn ${activeTab === 'Completados' ? 'active' : ''}`} onClick={() => setActiveTab('Completados')}>
            ✓ Completados <span className="tab-count">06</span>
          </button>
          <button className={`tab-btn ${activeTab === 'Abandonados' ? 'active' : ''}`} onClick={() => setActiveTab('Abandonados')}>
            ♥ Abandonados <span className="tab-count">02</span>
          </button>
        </div>

        {/* BARRA DE HERRAMIENTAS (Filtros y orden) */}
        <div className="inventory-toolbar">
          <div className="toolbar-left">
            <span className="highlight-green">▮</span> 12 ELEMENTOS EN TU BÓVEDA / TODAS LAS PLATAFORMAS
          </div>
          <div className="toolbar-right">
            <span>ORDEN: ACTUALIZADOS RECIENTEMENTE ▼</span>
            <button className="grid-toggle-btn active">▣</button>
          </div>
        </div>

        {/* GRILLA DE JUEGOS */}
        <div className="games-grid">
          {mockGames.map(game => (
            <div className={`game-card ${game.id === 1 ? 'card-active' : ''}`} key={game.id}>
              <div className="game-image-container">
                <span className={`game-status-badge status-${game.status.toLowerCase()}`}>
                  {game.status}
                </span>
                <img src={game.image} alt={game.title} className="game-image" />
                {game.id === 1 && (
                  <div className="edit-overlay">
                    EDITAR DATOS DE GUARDADO ↗
                  </div>
                )}
              </div>
              
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-meta">{game.year} - {game.genre}</p>
                <div className="game-footer">
                  <div className="game-hearts">
                    {/* Renderizamos corazones estáticos por ahora */}
                    <span className="heart-icon">♥</span>
                    <span className="heart-icon">♥</span>
                    <span className="heart-icon">♥</span>
                  </div>
                  <span className="game-hours">{game.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="inventory-footer-note">
          <div className="note-left">FIN DEL INVENTARIO - 12 / 12 JUEGOS CARGADOS</div>
          <div className="note-right highlight-orange">+ SIEMPRE HAY NUEVAS AVENTURAS ESPERANDO.</div>
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