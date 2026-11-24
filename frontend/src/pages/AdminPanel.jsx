import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import './Inventory.css';
import './GameDetail.css';
import './AdminPanel.css';

const initialUsers = [
  { id: 1, name: 'admin', email: 'admin@pixelvault.com', role: 'ADMIN', status: 'ACTIVO' },
  { id: 2, name: 'moderador', email: 'moderador@pixelvault.com', role: 'MODERADOR', status: 'ACTIVO' },
  { id: 3, name: 'usuario', email: 'usuario@pixelvault.com', role: 'USUARIO', status: 'ACTIVO' },
  { id: 4, name: 'Uriel_Dev', email: 'uriel@pixelvault.com', role: 'USUARIO', status: 'ACTIVO' },
  { id: 5, name: 'Kevin_Back', email: 'kevin@pixelvault.com', role: 'MODERADOR', status: 'INACTIVO' }
];

export default function AdminPanel() {
  const [users, setUsers] = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const [userToDelete, setUserToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers =
    roleFilter === 'TODOS'
      ? users
      : users.filter((u) => u.role === roleFilter);

  const handleRoleChange = (userId, newRole) => {
    // Listo para conectar cuando Kevin suba /api/admin/usuarios:
    // await api.patch(`/admin/usuarios/${userId}/rol`, { rol: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsProcessing(true);
    try {
      // await api.delete(`/admin/usuarios/${userToDelete.id}`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="inventory-wrapper">
      <Navbar showAddButton={false} />

      <main className="inventory-content">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← IR AL INVENTARIO</Link>
          <span className="detail-player-tag">SISTEMA / PANEL DE ADMINISTRACIÓN</span>
        </div>

        <header className="inventory-header">
          <div className="header-info">
            <span className="player-tag">ACCESO RESTRINGIDO · ROL ADMIN</span>
            <h1 className="inventory-title">Gestión de usuarios</h1>
            <p className="inventory-subtitle">Control de cuentas, roles y permisos de PixelVault.</p>
          </div>

          <div className="header-stats">
            <div className="stat-box">
              <span className="stat-value highlight-orange">{users.length}</span>
              <span className="stat-label">USUARIOS</span>
            </div>
            <div className="stat-box">
              <span className="stat-value highlight-orange">
                {users.filter((u) => u.role === 'ADMIN').length}
              </span>
              <span className="stat-label">ADMINS</span>
            </div>
            <div className="stat-box">
              <span className="stat-value highlight-orange">
                {users.filter((u) => u.role === 'MODERADOR').length}
              </span>
              <span className="stat-label">MODS</span>
            </div>
          </div>
        </header>

        <div className="inventory-tabs">
          {['TODOS', 'ADMIN', 'MODERADOR', 'USUARIO'].map((role) => (
            <button
              key={role}
              className={`tab-btn ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>CORREO</th>
                <th>ROL</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>#{String(u.id).padStart(3, '0')}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="admin-role-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODERADOR">MODERADOR</option>
                      <option value="USUARIO">USUARIO</option>
                    </select>
                  </td>
                  <td>
                    <span className={`admin-status ${u.status.toLowerCase()}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-admin-delete"
                      onClick={() => setUserToDelete(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="ELIMINAR USUARIO"
        message={`¿Seguro que deseas eliminar la cuenta de "${userToDelete?.name}" (${userToDelete?.email})?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isProcessing}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />

      <Footer />
    </div>
  );
}