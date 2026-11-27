import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { profileService } from '../services/profileService';
import './Inventory.css';
import './GameDetail.css';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Datos de perfil
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');

  // Steam
  const [steamInput, setSteamInput] = useState('');
  const [steamEstado, setSteamEstado] = useState(null);
  const [syncingSteam, setSyncingSteam] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [perfilData, steamData] = await Promise.all([
        profileService.getPerfil(),
        profileService.getEstadoSteam().catch(() => null)
      ]);

      setUsername(perfilData.username ?? perfilData.nombre ?? user?.name ?? '');
      setEmail(perfilData.email ?? perfilData.correo ?? user?.email ?? '');
      if (steamData) {
        setSteamEstado(steamData);
        setSteamInput(steamData.steamId ?? steamData.steam ?? '');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo cargar tu perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearFeedback = () => {
    setStatusMsg('');
    setErrorMsg('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const updated = await profileService.actualizarPerfil({
        username: username.trim()
      });
      setUsername(updated.username ?? username);
      setStatusMsg('Perfil actualizado correctamente.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      await profileService.cambiarPassword(passwordActual, passwordNueva);
      setPasswordActual('');
      setPasswordNueva('');
      setStatusMsg('Contraseña actualizada correctamente.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo cambiar la contraseña.');
    }
  };

  const handleVincularSteam = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const res = await profileService.vincularSteam(steamInput.trim());
      setSteamEstado(res);
      setStatusMsg('Cuenta de Steam vinculada correctamente.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo vincular la cuenta de Steam.');
    }
  };

  const handleDesvincularSteam = async () => {
    clearFeedback();
    try {
      await profileService.desvincularSteam();
      setSteamEstado({ vinculado: false });
      setSteamInput('');
      setStatusMsg('Cuenta de Steam desvinculada.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No se pudo desvincular Steam.');
    }
  };

  const handleSincronizarSteam = async () => {
    clearFeedback();
    setSyncingSteam(true);
    try {
      const res = await profileService.sincronizarSteam();
      setStatusMsg(
        `Steam sincronizado · Total en Steam: ${res.totalSteam ?? 0} | Importados: ${res.importados ?? 0} | Actualizados: ${res.actualizados ?? 0} | Omitidos (fuera de catálogo): ${res.omitidos ?? 0}`
      );
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al sincronizar biblioteca de Steam.');
    } finally {
      setSyncingSteam(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const steamVinculado = Boolean(steamEstado?.vinculado || steamEstado?.steamId);

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
              ROL [ <span className="highlight-green">{user?.role || 'USUARIO'}</span> ]
            </div>
          </div>

          {statusMsg && (
            <div className="profile-alert profile-alert-success">{statusMsg}</div>
          )}
          {errorMsg && (
            <div className="profile-alert profile-alert-error">{errorMsg}</div>
          )}

          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos de perfil...</p>
          ) : (
            <div className="detail-body">
              <aside className="detail-sidebar" style={{ textAlign: 'center' }}>
                <div className="profile-avatar-box">
                  {user?.avatar || (username ? username.slice(0, 2).toUpperCase() : 'P1')}
                </div>
                <p className="story-note-title">{username}</p>
                <p className="story-note-desc">{email}</p>
              </aside>

              <div className="detail-editor">
                {/* 1. Datos de perfil */}
                <form onSubmit={handleSaveProfile} className="story-note-box profile-section">
                  <p className="story-note-title">DATOS DE LA CUENTA</p>
                  <div className="profile-form-grid">
                    <label className="profile-field">
                      <span className="mission-label">NOMBRE DE USUARIO</span>
                      <input
                        type="text"
                        className="profile-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </label>
                    <button type="submit" className="btn-save-data" style={{ justifySelf: 'start' }}>
                      Guardar perfil
                    </button>
                  </div>
                </form>

                {/* 2. Steam */}
                <div className="story-note-box profile-section">
                  <p className="story-note-title">CONEXIÓN CON STEAM</p>
                  {steamVinculado ? (
                    <div className="profile-form-grid">
                      <p className="story-note-desc">
                        Vinculado: <strong>{steamEstado?.steamId || steamInput}</strong>
                      </p>
                      <div className="profile-actions-row">
                        <button
                          type="button"
                          className="btn-save-data"
                          onClick={handleSincronizarSteam}
                          disabled={syncingSteam}
                        >
                          {syncingSteam ? 'Sincronizando...' : 'Sincronizar biblioteca'}
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={handleDesvincularSteam}
                        >
                          Desvincular
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVincularSteam} className="profile-steam-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="SteamID64 o URL de perfil"
                        value={steamInput}
                        onChange={(e) => setSteamInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn-save-data">
                        Vincular Steam
                      </button>
                    </form>
                  )}
                </div>

                {/* 3. Cambiar contraseña */}
                <form onSubmit={handleChangePassword} className="story-note-box profile-section">
                  <p className="story-note-title">CAMBIAR CONTRASEÑA</p>
                  <div className="profile-form-grid">
                    <label className="profile-field">
                      <span className="mission-label">CONTRASEÑA ACTUAL</span>
                      <input
                        type="password"
                        className="profile-input"
                        placeholder="Ingresa tu contraseña actual"
                        value={passwordActual}
                        onChange={(e) => setPasswordActual(e.target.value)}
                        required
                      />
                    </label>
                    <label className="profile-field">
                      <span className="mission-label">NUEVA CONTRASEÑA</span>
                      <input
                        type="password"
                        className="profile-input"
                        placeholder="Mín. 8 caracteres, mayúscula, número y especial"
                        value={passwordNueva}
                        onChange={(e) => setPasswordNueva(e.target.value)}
                        required
                      />
                    </label>
                    <button type="submit" className="btn-cancel" style={{ justifySelf: 'start' }}>
                      Actualizar contraseña
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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