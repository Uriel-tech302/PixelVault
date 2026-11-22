import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ showAddButton = true }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="inventory-navbar">
      <Link
        to="/inventario"
        className="navbar-logo"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <span className="logo-icon">▣</span> PixelVault
      </Link>

      <div className="navbar-search">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Buscar en tu colección... /" />
      </div>

      <div className="navbar-user-controls">
        {showAddButton && (
          <button
            className="btn-add-game"
            type="button"
            onClick={() => navigate('/agregar')}
          >
            <span className="btn-add-icon">⭘</span> + Agregar juego
          </button>
        )}

        <div className="user-profile-menu">
          <button
            className="profile-btn"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            P1
          </button>
          {dropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/login" className="logout-link">
                Cerrar sesión ▼
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}