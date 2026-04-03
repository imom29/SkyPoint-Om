import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob } from "../../api/jobsApi";
import { getJobApplications, updateApplicationStatus } from "../../api/applicationsApi";
import ApplicationRow from "../../components/applications/ApplicationRow";
import CandidateProfileModal from "../../components/applications/CandidateProfileModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import HRLayout from "../../components/layout/HRLayout";
import { APPLICATION_STATUSES } from "../../utils/constants";

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobData, appsData] = await Promise.all([
          getJob(jobId),
          getJobApplications(jobId),
        ]);
        setJob(jobData);
        setData(appsData);
      } catch {
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [jobId]);

  async function handleStatusChange(appId, newStatus) {
    try {
      const updated = await updateApplicationStatus(appId, newStatus);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((a) => (a.id === appId ? { ...a, status: updated.status } : a)),
      }));
    } catch {
      setError("Failed to update status.");
    }
  }

  const filtered = data?.items?.filter(
    (a) => filter === "all" || a.status === filter
  ) ?? [];

  return (
    <HRLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span>Jobs</span>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">Applicants</span>
      </nav>

      {job && (
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">{job.title}</h1>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                {data?.total ?? 0} Applicant{data?.total === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Filter tabs */}
          {data && (
            <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
              {["all", ...APPLICATION_STATUSES.map((s) => s.value)].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === s
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ErrorMessage message={error} />
      {loading && <LoadingSpinner />}

      {!loading && data && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant/10">
              No applications in this category.
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Candidate</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Applied Date</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cover Letter</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Resume</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      application={app}
                      onStatusChange={handleStatusChange}
                      onViewProfile={setSelectedCandidate}
                    />
                  ))}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="px-6 py-3 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant">Page 1 of {Math.ceil((data?.total || 1) / 10)}</p>
              </div>
            </div>
          )}
        </>
      )}

      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </HRLayout>
  );
}
