import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatDate";
import { JOB_TYPE_LABELS, STATUS_LABELS } from "../../utils/constants";

export default function ApplicationCard({ application }) {
  const { job, status, applied_at } = application;

  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-6 hover:bg-surface-container-lowest transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/jobs/${job.id}`}
            className="text-lg font-bold text-on-surface hover:text-primary transition-colors"
          >
            {job.title}
          </Link>
          <p className="text-sm text-on-surface-variant mt-1">
            {job.location} · <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
          </p>
        </div>
        <Badge value={status} label={STATUS_LABELS[status]} />
      </div>
      <p className="text-xs text-outline mt-4">Applied {formatDate(applied_at)}</p>
    </div>
  );
}

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    status: PropTypes.string.isRequired,
    applied_at: PropTypes.string.isRequired,
    job: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      job_type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
