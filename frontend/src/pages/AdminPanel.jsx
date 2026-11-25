import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { adminService } from '../services/adminService';
import './Inventory.css';
import './GameDetail.css';
import './AdminPanel.css';

const normalizeUser = (u) => {
  const isActive =
    typeof u.activo === 'boolean'
      ? u.activo
      : u.status
        ? u.status.toUpperCase() === 'ACTIVO'
        : true;

  return {
    id: u.id,
    name: u.nombre ?? u.username ?? u.name ?? 'Sin nombre',
    email: u.correo ?? u.email ?? '',
    role: (u.rol ?? u.role ?? 'USUARIO').toUpperCase(),
    activo: isActive,
    status: isActive ? 'ACTIVO' : 'INACTIVO'
  };
};

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await adminService.getUsuarios({ page: 0, size: 100 });
      const rawList = Array.isArray(data)
        ? data
        : data.contenido ?? data.items ?? data.content ?? [];
      setUsers(rawList.map(normalizeUser));
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No se pudo cargar la lista de usuarios.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers =
    roleFilter === 'TODOS'
      ? users
      : users.filter((u) => u.role === roleFilter);

  const handleRoleChange = async (userId, newRole) => {
    setErrorMsg('');
    try {
      const updated = await adminService.cambiarRol(userId, newRole);
      const normalized = normalizeUser(updated);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? normalized : u))
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No se pudo actualizar el rol del usuario.';
      setErrorMsg(msg);
    }
  };

  const handleToggleActive = async (user) => {
    setErrorMsg('');
    try {
      const updated = await adminService.cambiarEstado(user.id, !user.activo);
      const normalized = normalizeUser(updated);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? normalized : u))
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No se pudo cambiar el estado del usuario.';
      setErrorMsg(msg);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await adminService.desactivarUsuario(userToDeactivate.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userToDeactivate.id
            ? { ...u, activo: false, status: 'INACTIVO' }
            : u
        )
      );
      setUserToDeactivate(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No se pudo desactivar la cuenta.';
      setErrorMsg(msg);
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

        {errorMsg && (
          <div className="form-error-banner" style={{ marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

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
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando usuarios...</p>
          ) : (
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
                      {u.activo ? (
                        <button
                          type="button"
                          className="btn-admin-delete"
                          onClick={() => setUserToDeactivate(u)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="tab-btn"
                          onClick={() => handleToggleActive(u)}
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(userToDeactivate)}
        title="DESACTIVAR USUARIO"
        message={`¿Seguro que deseas desactivar la cuenta de "${userToDeactivate?.name}" (${userToDeactivate?.email})? Se conservarán su biblioteca y reseñas.`}
        confirmText="Sí, desactivar"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isProcessing}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setUserToDeactivate(null)}
      />

      <Footer />
    </div>
  );
}