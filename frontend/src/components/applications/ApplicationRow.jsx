import PropTypes from "prop-types";
import { formatDate } from "../../utils/formatDate";
import { APPLICATION_STATUSES } from "../../utils/constants";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-secondary-container text-primary",
  "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant",
  "bg-primary-fixed-dim text-primary",
  "bg-error-container text-error",
];

export default function ApplicationRow({ application, onStatusChange, onViewProfile }) {
  const { candidate, cover_letter, resume_url, status, applied_at } = application;
  const statusStyle = STATUS_STYLES[status] || "bg-surface-container-high text-on-surface-variant border-outline-variant/20";
  const colorIdx = (candidate.full_name.codePointAt(0) || 0) % AVATAR_COLORS.length;

  return (
    <tr className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors">
      {/* Candidate */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[colorIdx]}`}>
            {getInitials(candidate.full_name)}
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm">{candidate.full_name}</p>
            <p className="text-xs text-on-surface-variant">{candidate.email}</p>
            <button
              onClick={() => onViewProfile(candidate)}
              className="text-xs text-primary hover:underline mt-0.5 font-medium"
            >
              View Profile
            </button>
          </div>
        </div>
      </td>

      {/* Applied date */}
      <td className="py-4 px-6 text-xs text-on-surface-variant whitespace-nowrap">{formatDate(applied_at)}</td>

      {/* Cover letter */}
      <td className="py-4 px-6 max-w-[180px]">
        <p className="text-xs text-on-surface-variant line-clamp-2">{cover_letter}</p>
      </td>

      {/* Resume */}
      <td className="py-4 px-6">
        {resume_url ? (
          <a
            href={resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">attachment</span>
            {resume_url.split("/").pop() || "Resume.pdf"}
          </a>
        ) : (
          <span className="text-xs text-outline">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <select
          value={status}
          onChange={(e) => onStatusChange(application.id, e.target.value)}
          className={`text-xs rounded-lg border px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary ${statusStyle}`}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

ApplicationRow.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.number.isRequired,
    candidate: PropTypes.shape({
      full_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    cover_letter: PropTypes.string,
    resume_url: PropTypes.string,
    status: PropTypes.string.isRequired,
    applied_at: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onViewProfile: PropTypes.func.isRequired,
};



