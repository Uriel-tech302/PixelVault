import './ConfirmModal.css';

export default function ConfirmModal({
  isOpen,
  title = 'CONFIRMAR ACCIÓN',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="box-header">
          <div className="box-header-left">
            <span className={isDanger ? 'highlight-pink' : 'highlight-green'}>⚠</span> {title}
          </div>
          <button type="button" className="modal-close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger' : 'btn-save-data'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'PROCESANDO...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}