import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ showAddButton = true, searchTerm = '', onSearchChange }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <input
          type="text"
          placeholder="Buscar en tu colección... /"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
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
            title={user?.email}
          >
            {user?.avatar || 'P1'}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <span className="dropdown-user-name">{user?.name || 'Jugador'}</span>
                <span className="dropdown-user-email">{user?.email || 'sin@correo.com'}</span>
                <span className="dropdown-user-role">ROL: {user?.role || 'USER'}</span>
              </div>

              <Link
                to="/perfil"
                className="dropdown-item-link"
                onClick={() => setDropdownOpen(false)}
              >
                ▣ Mi perfil
              </Link>

              <button
                type="button"
                className="logout-link logout-btn-reset"
                onClick={handleLogout}
              >
                Cerrar sesión ▼
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}