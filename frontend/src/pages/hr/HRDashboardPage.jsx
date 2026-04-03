import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../api/jobsApi";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";
import { formatDate } from "../../utils/formatDate";
import { JOB_TYPE_LABELS } from "../../utils/constants";

export default function HRDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function fetchJobs() {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch {
      setError("Failed to load your jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(); }, []);

  async function handleDelete() {
    try {
      await deleteJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    } catch {
      setError("Failed to delete job.");
    } finally {
      setDeleteTarget(null);
    }
  }

  const totalApplications = jobs.reduce((sum, j) => sum + (j.application_count || 0), 0);

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your job listings</p>
        </div>
        <Link
          to="/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Jobs Posted" value={jobs.length} />
        <StatCard label="Active Jobs" value={jobs.filter((j) => j.is_active).length} />
        <StatCard label="Total Applications" value={totalApplications} />
      </div>

      <ErrorMessage message={error} />
      {loading && <LoadingSpinner />}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No jobs posted yet.{" "}
          <Link to="/jobs/create" className="text-blue-600 hover:underline">Post your first job</Link>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Job</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Posted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Applicants</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.location}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(job.created_at)}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{job.application_count}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${job.is_active ? "text-green-600" : "text-gray-400"}`}>
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/jobs/${job.id}/applicants`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Applicants
                      </Link>
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="Delete Job"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This will also remove all applications.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Delete"
          danger
        />
      )}
    </PageWrapper>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
