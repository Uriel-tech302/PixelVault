import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import { resenaService } from '../services/resenaService';
import './Inventory.css';
import './AdminPanel.css';

const extractError = (err, fallback) => {
  const data = err.response?.data;
  if (data?.errores && typeof data.errores === 'object') {
    return Object.values(data.errores).join(' · ');
  }
  return data?.mensaje || data?.message || data?.error || fallback;
};

export default function ModerationPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Filtros
  const [filtroOculta, setFiltroOculta] = useState(''); // '', 'false', 'true'
  const [searchTerm, setSearchTerm] = useState('');

  // Acción de ocultar con motivo
  const [hidingId, setHidingId] = useState(null);
  const [motivoInput, setMotivoInput] = useState('');
  const [busyId, setBusyId] = useState(null);

  // Modal de eliminación
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarResenas = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await resenaService.listarModeracion({
        oculta: filtroOculta,
        q: searchTerm.trim() || undefined,
        page: 0,
        size: 50
      });
      const list = Array.isArray(data)
        ? data
        : data.contenido ?? data.content ?? data.items ?? [];
      setReviews(list);
    } catch (err) {
      setErrorMsg(extractError(err, 'No se pudieron cargar las reseñas para moderación.'));
    } finally {
      setLoading(false);
    }
  }, [filtroOculta, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarResenas();
    }, 250);
    return () => clearTimeout(timer);
  }, [cargarResenas]);

  const handleConfirmOcultar = async (id) => {
    const motivo = motivoInput.trim();
    if (!motivo) {
      setErrorMsg('Escribe un motivo antes de ocultar la reseña.');
      return;
    }
    setBusyId(id);
    setErrorMsg('');
    setStatusMsg('');
    try {
      const updated = await resenaService.ocultarResena(id, motivo);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setHidingId(null);
      setMotivoInput('');
      setStatusMsg(`Reseña #${id} ocultada correctamente.`);
    } catch (err) {
      setErrorMsg(extractError(err, 'No se pudo ocultar la reseña.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleMostrar = async (id) => {
    setBusyId(id);
    setErrorMsg('');
    setStatusMsg('');
    try {
      const updated = await resenaService.mostrarResena(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setStatusMsg(`Reseña #${id} restaurada y visible nuevamente.`);
    } catch (err) {
      setErrorMsg(extractError(err, 'No se pudo restaurar la reseña.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleEliminar = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      await resenaService.eliminarResenaModeracion(deleteTarget.id);
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setStatusMsg(`Reseña #${deleteTarget.id} eliminada permanentemente.`);
      setDeleteTarget(null);
    } catch (err) {
      setErrorMsg(extractError(err, 'No se pudo eliminar la reseña.'));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="inventory-wrapper">
      <Navbar
        showAddButton={false}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="detail-main">
        <div className="detail-breadcrumb">
          <Link to="/inventario" className="back-link">← VOLVER AL INVENTARIO</Link>
          <span className="detail-player-tag">PANEL DE MODERACIÓN</span>
        </div>

        <section className="save-point-card">
          <div className="box-header">
            <div className="box-header-left">
              <span className="highlight-green">🛡</span> Moderación de reseñas
            </div>
            <div className="box-header-right">
              TOTAL [ <span className="highlight-green">{reviews.length}</span> ]
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={filtroOculta === '' ? 'btn-save-data' : 'btn-cancel'}
                onClick={() => setFiltroOculta('')}
              >
                Todas
              </button>
              <button
                type="button"
                className={filtroOculta === 'false' ? 'btn-save-data' : 'btn-cancel'}
                onClick={() => setFiltroOculta('false')}
              >
                Visibles
              </button>
              <button
                type="button"
                className={filtroOculta === 'true' ? 'btn-save-data' : 'btn-cancel'}
                onClick={() => setFiltroOculta('true')}
              >
                Ocultas
              </button>
            </div>

            {errorMsg && <div className="inventory-error-box" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
            {statusMsg && <div className="save-success-banner" style={{ marginBottom: '1rem' }}>✓ {statusMsg}</div>}

            {loading ? (
              <div className="inventory-loading-box">CARGANDO RESEÑAS...</div>
            ) : reviews.length === 0 ? (
              <p className="story-note-desc">No se encontraron reseñas con los filtros actuales.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reviews.map((r) => (
                  <article key={r.id} className="story-note-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div>
                        <strong className="story-note-title">
                          #{r.id} · {r.juego}
                        </strong>
                        <span className="story-note-desc" style={{ marginLeft: '0.6rem' }}>
                          por <strong>{r.autor}</strong>
                          {r.puntuacion ? ` · ♥ ${r.puntuacion}/5` : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem' }}>
                        <span>{r.visibilidad}</span>
                        {r.contieneSpoilers && <span>· ⚠ SPOILERS</span>}
                        <span style={{ color: r.oculta ? '#ff6b6b' : '#b7ff3c', fontWeight: 'bold' }}>
                          · {r.oculta ? 'OCULTA' : 'VISIBLE'}
                        </span>
                      </div>
                    </div>

                    <p className="story-note-desc" style={{ whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>
                      {r.texto}
                    </p>

                    {r.oculta && (
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem', opacity: 0.9 }}>
                        <strong>Motivo:</strong> {r.motivoModeracion || 'Sin motivo registrado'}
                        {r.moderadaPor ? ` · Moderada por: ${r.moderadaPor}` : ''}
                      </div>
                    )}

                    {/* Formulario inline para escribir el motivo al ocultar */}
                    {hidingId === r.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input
                          type="text"
                          value={motivoInput}
                          onChange={(e) => setMotivoInput(e.target.value)}
                          placeholder="Motivo de moderación (ej. lenguaje ofensivo, spam)..."
                          style={{ flex: 1, minWidth: '220px', padding: '0.45rem 0.65rem' }}
                        />
                        <button
                          type="button"
                          className="btn-save-data"
                          disabled={busyId === r.id}
                          onClick={() => handleConfirmOcultar(r.id)}
                        >
                          {busyId === r.id ? 'Guardando...' : 'Confirmar ocultar'}
                        </button>
                        <button
                          type="button"
                          className="btn-cancel"
                          onClick={() => {
                            setHidingId(null);
                            setMotivoInput('');
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {r.oculta ? (
                          <button
                            type="button"
                            className="btn-save-data"
                            disabled={busyId === r.id}
                            onClick={() => handleMostrar(r.id)}
                          >
                            {busyId === r.id ? 'Procesando...' : 'Mostrar reseña'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-cancel"
                            disabled={busyId === r.id}
                            onClick={() => {
                              setHidingId(r.id);
                              setMotivoInput('');
                            }}
                          >
                            Ocultar
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-danger"
                          disabled={busyId === r.id}
                          onClick={() => setDeleteTarget(r)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="ELIMINAR RESEÑA"
        message={
          deleteTarget
            ? `¿Seguro que quieres eliminar permanentemente la reseña #${deleteTarget.id} de "${deleteTarget.autor}" sobre "${deleteTarget.juego}"?`
            : ''
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleEliminar}
        onCancel={() => setDeleteTarget(null)}
      />

      <Footer />
    </div>
  );
}