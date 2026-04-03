import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatDate, formatSalary } from "../../utils/formatDate";
import { JOB_TYPE_LABELS } from "../../utils/constants";

const TYPE_BADGE_COLORS = {
  full_time: "bg-secondary-container text-primary",
  part_time: "bg-primary-fixed text-primary",
  contract: "bg-surface-container-high text-on-surface-variant",
  internship: "bg-tertiary-fixed-dim/60 text-on-tertiary-fixed-variant",
};

export default function JobCard({ job, applied }) {
  const salary = formatSalary(job.salary_min, job.salary_max);
  const badgeColor = TYPE_BADGE_COLORS[job.job_type] || "bg-surface-container-high text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-outline-variant/30 hover:shadow-ambient-sm transition-all">
      {/* Left: icon */}
      <div className="w-9 h-9 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-secondary text-[20px]">work</span>
      </div>

      {/* Middle: info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Link
            to={`/jobs/${job.id}`}
            className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
          >
            {job.title}
          </Link>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeColor}`}>
            {JOB_TYPE_LABELS[job.job_type] || job.job_type}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {job.location}
          </span>
          {salary && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">payments</span>
              {salary}
            </span>
          )}
          <span className="text-outline">Posted {formatDate(job.created_at)}</span>
        </div>
      </div>

      {/* Right: button */}
      {applied ? (
        <span className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-lg font-semibold text-xs whitespace-nowrap flex-shrink-0 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>{" "}
          Applied
        </span>
      ) : (
        <Link
          to={`/jobs/${job.id}`}
          className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-xs hover:bg-primary-container transition-colors whitespace-nowrap flex-shrink-0"
        >
          Apply Now
        </Link>
      )}
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    job_type: PropTypes.string.isRequired,
    salary_min: PropTypes.number,
    salary_max: PropTypes.number,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  applied: PropTypes.bool,
};

JobCard.defaultProps = {
  applied: false,
};



