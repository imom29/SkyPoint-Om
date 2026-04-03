import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../api/jobsApi";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import HRLayout from "../../components/layout/HRLayout";
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
  const totalPending = jobs.reduce((sum, j) => sum + (j.pending_count || 0), 0);
  const totalAccepted = jobs.reduce((sum, j) => sum + (j.accepted_count || 0), 0);
  const activeJobs = jobs.filter((j) => j.is_active).length;

  return (
    <HRLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Recruiter Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage your active job postings and candidate pipelines.</p>
        </div>
        <Link
          to="/jobs/create"
          className="flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-container transition-colors whitespace-nowrap"
        >
          <span className="text-lg font-light">+</span> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Jobs Posted" value={jobs.length} sub="+2 this month" />
        <StatCard label="Active Jobs" value={activeJobs} />
        <StatCard label="Total Apps" value={totalApplications} />
        <StatCard label="Pending Review" value={totalPending} accent="pending" />
        <StatCard label="Accepted" value={totalAccepted} accent="accepted" />
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
          <p className="text-on-surface-variant text-sm mb-4">No jobs posted yet.</p>
          <Link to="/jobs/create" className="text-primary font-bold hover:underline underline-offset-4">
            Post your first job
          </Link>
        </div>
      )}

      {/* Recently Posted Jobs */}
      {!loading && jobs.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
            <h2 className="font-semibold text-on-surface text-sm">Recently Posted Jobs</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Title &amp; Location</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Posted Date</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Applicants</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-on-surface">{job.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{job.location}</p>
                  </td>
                  <td className="py-4 px-6">
                    <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
                  </td>
                  <td className="py-4 px-6 text-xs text-on-surface-variant">{formatDate(job.created_at)}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-on-surface">{job.application_count} total</p>
                    {job.application_count > 0 && (
                      <div className="flex flex-wrap gap-2 mt-0.5 text-xs">
                        {job.pending_count > 0 && (
                          <span className="text-amber-600">{job.pending_count} pending</span>
                        )}
                        {job.accepted_count > 0 && (
                          <span className="text-emerald-600">{job.accepted_count} accepted</span>
                        )}
                        {job.rejected_count > 0 && (
                          <span className="text-error">{job.rejected_count} rejected</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${job.is_active ? "text-emerald-600" : "text-outline"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-outline"}`} />
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 justify-end">
                      <Link to={`/jobs/${job.id}/applicants`} className="text-xs text-primary hover:underline font-semibold">
                        Applicants
                      </Link>
                      <Link to={`/jobs/${job.id}/edit`} className="text-xs text-on-surface-variant hover:text-primary font-semibold">
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="text-xs text-error hover:opacity-75 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Banner */}
      {!loading && (
        <div className="bg-primary rounded-xl p-6 flex items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Talent Sourcing AI is Now Active</h3>
            <p className="text-white/80 text-sm mb-4">
              Let our new automated matching system find the top 5 candidates for your Senior Designer role while you sleep.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 bg-white/10 rounded-xl px-6 py-4 min-w-[160px]">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span className="text-sm font-semibold">Auto-matching</span>
            </div>
            <p className="text-white/70 text-xs uppercase tracking-widest">Scanning Talent Pool</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
              <div className="bg-tertiary-fixed h-1.5 rounded-full w-3/4 transition-all" />
            </div>
            <p className="text-white/70 text-xs">75%</p>
          </div>
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
    </HRLayout>
  );
}

function StatCard({ label, value, sub, accent }) {
  const accentMap = {
    pending: { text: "text-amber-600", border: "border-l-amber-400", bg: "" },
    accepted: { text: "text-emerald-600", border: "border-l-emerald-400", bg: "" },
  };
  const a = accentMap[accent] || { text: "text-on-surface", border: "border-l-transparent", bg: "" };

  return (
    <div className={`bg-surface-container-lowest rounded-xl border border-outline-variant/10 border-l-4 ${a.border} px-5 py-4`}>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-black ${a.text}`}>{value}</p>
      {sub && <p className="text-[10px] text-primary mt-0.5 font-medium">{sub}</p>}
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  sub: PropTypes.string,
  accent: PropTypes.string,
};



