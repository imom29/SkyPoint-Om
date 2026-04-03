import { JOB_TYPES } from "../../utils/constants";
import PropTypes from "prop-types";

export default function JobFilters({ filters, onChange }) {
  function handleChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-4 flex flex-wrap gap-3">
      <input
        name="title"
        value={filters.title}
        onChange={handleChange}
        placeholder="Search by title..."
        className="flex-1 min-w-48 rounded-xl bg-surface-container-lowest border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        name="location"
        value={filters.location}
        onChange={handleChange}
        placeholder="Location..."
        className="flex-1 min-w-36 rounded-xl bg-surface-container-lowest border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        name="job_type"
        value={filters.job_type}
        onChange={handleChange}
        className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All types</option>
        {JOB_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      {(filters.title || filters.location || filters.job_type) && (
        <button
          onClick={() => onChange({ title: "", location: "", job_type: "" })}
          className="text-sm text-on-surface-variant hover:text-error px-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}

JobFilters.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string,
    location: PropTypes.string,
    job_type: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
