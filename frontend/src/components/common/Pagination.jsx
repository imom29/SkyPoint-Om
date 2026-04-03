import PropTypes from "prop-types";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="mt-16 flex justify-center items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Page numbers */}
      {Array.from({ length: Math.min(pages, 3) }, (_, i) => page + i).map((p) =>
        p <= pages ? (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
              p === page
                ? "bg-primary text-white shadow-sm"
                : "text-secondary hover:bg-surface-container"
            }`}
          >
            {p}
          </button>
        ) : null
      )}

      {pages > 3 && page < pages - 2 && (
        <span className="px-2 text-outline">...</span>
      )}

      {pages > 3 && page < pages - 1 && (
        <button
          onClick={() => onPageChange(pages)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container transition-colors"
        >
          {pages}
        </button>
      )}

      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
