import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatDate";
import { APPLICATION_STATUSES, STATUS_LABELS } from "../../utils/constants";

export default function ApplicationRow({ application, onStatusChange }) {
  const { candidate, cover_letter, resume_url, status, applied_at } = application;

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
      <td className="py-4 px-4">
        <p className="font-medium text-gray-900 text-sm">{candidate.full_name}</p>
        <p className="text-xs text-gray-500">{candidate.email}</p>
      </td>
      <td className="py-4 px-4 text-xs text-gray-500">{formatDate(applied_at)}</td>
      <td className="py-4 px-4 max-w-xs">
        <p className="text-xs text-gray-600 line-clamp-2">{cover_letter}</p>
        {resume_url && (
          <a
            href={resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1 block"
          >
            View Resume
          </a>
        )}
      </td>
      <td className="py-4 px-4">
        <select
          value={status}
          onChange={(e) => onStatusChange(application.id, e.target.value)}
          className="text-xs rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
