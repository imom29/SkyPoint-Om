import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob } from "../../api/jobsApi";
import { getJobApplications, updateApplicationStatus } from "../../api/applicationsApi";
import ApplicationRow from "../../components/applications/ApplicationRow";
import CandidateProfileModal from "../../components/applications/CandidateProfileModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";
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
    <PageWrapper>
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 block">&larr; Back to dashboard</Link>

      {job && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{job.location} · {data?.total ?? 0} applicant{data?.total !== 1 ? "s" : ""}</p>
        </div>
      )}

      <ErrorMessage message={error} />
      {loading && <LoadingSpinner />}

      {!loading && data && (
        <>
          {/* Status filter tabs */}
          <div className="flex gap-2 mb-4">
            {["all", ...APPLICATION_STATUSES.map((s) => s.value)].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === s
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s === "all" ? `All (${data.total})` : `${s} (${data.items.filter((a) => a.status === s).length})`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No applications in this category.</div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Applied</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Cover Letter / Resume</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
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
    </PageWrapper>
  );
}
