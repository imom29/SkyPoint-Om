import PropTypes from "prop-types";

export default function Modal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md mx-4 p-8">
        <h2 className="text-lg font-bold text-on-surface mb-2">{title}</h2>
        <p className="text-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 text-sm rounded-lg text-on-primary font-medium transition-all ${
              danger
                ? "bg-error hover:bg-error/90"
                : "bg-primary-container hover:bg-primary"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  danger: PropTypes.bool,
};
