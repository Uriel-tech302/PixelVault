import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import { fetchGames } from '../services/gameService';
import './Inventory.css';

export default function Inventory() {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const PAGE_SIZE = 4;

  // Reinicia a la página 0 cada vez que cambia el filtro o la búsqueda
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  useEffect(() => {
    let active = true;

    const loadGames = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const res = await fetchGames({
          page,
          size: PAGE_SIZE,
          status: activeTab,
          search: searchTerm
        });
        if (active) {
          setGames(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (err) {
        if (active) {
          setErrorMsg('No se pudo conectar con el servidor. Intenta nuevamente.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadGames();
    return () => {
      active = false;
    };
  }, [page, activeTab, searchTerm]);

  return (
    <div className="inventory-wrapper">
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      <main className="inventory-content">
        <header className="inventory-header">
          <div className="header-info">
            <span className="player-tag">JUGADOR_01 / ARCHIVO PERSONAL DE JUEGOS</span>
            <h1 className="inventory-title">El inventario</h1>
            <p className="inventory-subtitle">Cada misión. Cada final. Todo en una bóveda.</p>
          </div>

          <div className="header-stats">
            <div className="stat-box">
              <span className="stat-value highlight-orange">{totalElements}</span>
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

        <div className="inventory-tabs">
          <button className={`tab-btn ${activeTab === 'Todos' ? 'active' : ''}`} onClick={() => handleTabChange('Todos')}>
            ▣ Todos
          </button>
          <button className={`tab-btn ${activeTab === 'Jugando' ? 'active' : ''}`} onClick={() => handleTabChange('Jugando')}>
            ⚔ Jugando
          </button>
          <button className={`tab-btn ${activeTab === 'Completados' ? 'active' : ''}`} onClick={() => handleTabChange('Completados')}>
            ✓ Completados
          </button>
          <button className={`tab-btn ${activeTab === 'Abandonados' ? 'active' : ''}`} onClick={() => handleTabChange('Abandonados')}>
            ♥ Abandonados
          </button>
        </div>

        <div className="inventory-toolbar">
          <div className="toolbar-left">
            <span className="highlight-green">▮</span> {totalElements} ELEMENTOS ENCONTRADOS / FILTRO: {activeTab.toUpperCase()}
          </div>
          <div className="toolbar-right">
            <span>PÁGINA {page + 1} DE {totalPages}</span>
          </div>
        </div>

        {/* MANEJO DE ERROR DE RED */}
        {errorMsg && (
          <div className="inventory-error-box">
            ⚠ {errorMsg}
          </div>
        )}

        {/* LOADING STATE O GRILLA */}
        {isLoading ? (
          <div className="inventory-loading-box">
            CARGANDO BÓVEDA... <span className="blinking-block">█</span>
          </div>
        ) : games.length === 0 ? (
          <div className="inventory-empty-box">
            No se encontraron juegos con ese filtro o búsqueda.
          </div>
        ) : (
          <div className="games-grid">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => navigate(`/juego/${game.id}`)}
              />
            ))}
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        <div className="pagination-bar">
          <button
            type="button"
            className="page-btn"
            disabled={page === 0 || isLoading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ← Anterior
          </button>

          <span className="page-indicator">
            PÁGINA <span className="highlight-green">{page + 1}</span> / {totalPages}
          </span>

          <button
            type="button"
            className="page-btn"
            disabled={page + 1 >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}