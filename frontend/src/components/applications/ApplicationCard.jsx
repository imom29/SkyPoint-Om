import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatDate";
import { JOB_TYPE_LABELS, STATUS_LABELS } from "../../utils/constants";

export default function ApplicationCard({ application }) {
  const { job, status, applied_at } = application;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/jobs/${job.id}`}
            className="text-base font-semibold text-gray-900 hover:text-blue-600"
          >
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">
            {job.location} · <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
          </p>
        </div>
        <Badge value={status} label={STATUS_LABELS[status]} />
      </div>
      <p className="text-xs text-gray-400 mt-3">Applied {formatDate(applied_at)}</p>
    </div>
  );
}
