import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { formatDate, formatSalary } from "../../utils/formatDate";
import { JOB_TYPE_LABELS } from "../../utils/constants";

export default function JobCard({ job }) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${job.id}`}
            className="text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{job.posted_by?.full_name}</p>
        </div>
        <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>{job.location}</span>
        {salary && <span className="text-green-700 font-medium">{salary}</span>}
        <span className="text-gray-300">·</span>
        <span>{job.application_count} applicant{job.application_count !== 1 ? "s" : ""}</span>
        <span className="text-gray-300">·</span>
        <span>Posted {formatDate(job.created_at)}</span>
      </div>

      <div className="mt-4">
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View details &rarr;
        </Link>
      </div>
    </div>
  );
}
