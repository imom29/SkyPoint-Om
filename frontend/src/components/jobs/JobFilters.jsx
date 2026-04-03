import { JOB_TYPES } from "../../utils/constants";

export default function JobFilters({ filters, onChange }) {
  function handleChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
      <input
        name="title"
        value={filters.title}
        onChange={handleChange}
        placeholder="Search by title..."
        className="flex-1 min-w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="location"
        value={filters.location}
        onChange={handleChange}
        placeholder="Location..."
        className="flex-1 min-w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="job_type"
        value={filters.job_type}
        onChange={handleChange}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="text-sm text-gray-500 hover:text-red-500 px-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}
