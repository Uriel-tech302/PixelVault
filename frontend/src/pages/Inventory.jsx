import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockGames } from '../data/mockGames';
import GameCard from '../components/GameCard';
import './Inventory.css';

export default function Inventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');

  return (
    <div className="inventory-wrapper">
      <Navbar />

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

        {/* BARRA DE HERRAMIENTAS */}
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
          {mockGames.map((game) => (
          <GameCard
          key={game.id}
          game={game}
          onClick={() => navigate(`/juego/${game.id}`)}
        />
    ))}
</div>
        <div className="inventory-footer-note">
          <div className="note-left">FIN DEL INVENTARIO - 12 / 12 JUEGOS CARGADOS</div>
          <div className="note-right highlight-orange">+ SIEMPRE HAY NUEVAS AVENTURAS ESPERANDO.</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}