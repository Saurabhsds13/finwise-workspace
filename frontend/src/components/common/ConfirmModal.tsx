import './confirm-modal.css';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className={danger ? 'confirm-title--danger' : ''}>{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={danger ? 'btn-danger-solid' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
