import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../api/applicationsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatDate } from "../../utils/formatDate";

import PropTypes from "prop-types";

function ApplicationAction({ app }) {
  return (
    <Link to={`/jobs/${app.job.id}`} className="text-xs text-primary hover:underline font-semibold">
      View Details
    </Link>
  );
}

ApplicationAction.propTypes = {
  app: PropTypes.shape({
    status: PropTypes.string.isRequired,
    job: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired }).isRequired,
  }).isRequired,
};

const STATUS_STYLES = {
  accepted: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
};

const JOB_ICONS = {
  full_time: "work",
  part_time: "part_alt",
  contract: "handshake",
  internship: "school",
};

export default function MyApplicationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await getMyApplications();
        setData(res);
      } catch {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filtered = data?.items?.filter((app) =>
    !search || app.job.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen bg-surface-container">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-on-surface">My Applications</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Track and manage your professional journey.
            {data && ` You have ${data.items?.filter(a => a.status === "pending").length} active applications in progress.`}
          </p>
        </header>

        {error && <ErrorMessage message={error} />}
        {loading && <LoadingSpinner />}

        {!loading && data && (
          <>
            {/* Search + filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden mb-8">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-on-surface-variant text-sm">
                  {search ? "No applications match your search." : "You haven't applied to any jobs yet."}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-outline-variant/10">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Job Title</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Applied Date</th>
                      <th className="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filtered.map((app) => {
                      const statusStyle = STATUS_STYLES[app.status] || "bg-surface-container-high text-on-surface-variant";
                      const icon = JOB_ICONS[app.job.job_type] || "work";
                      return (
                        <tr key={app.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
                              </div>
                              <Link to={`/jobs/${app.job.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">
                                {app.job.title}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-on-surface-variant text-sm">{app.job.posted_by?.full_name || "SkyPoint"}</td>
                          <td className="py-4 px-6 text-on-surface-variant text-sm">{formatDate(app.applied_at)}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <ApplicationAction app={app} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {filtered.length > 0 && (
                <div className="px-6 py-3 border-t border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant">
                    Showing {filtered.length} of {filtered.length} results
                  </p>
                </div>
              )}
            </div>

            {/* Bottom widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Resume Strength */}
              <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden">
                <h3 className="font-bold text-lg mb-1">Resume Strength: 84%</h3>
                <p className="text-white/80 text-sm mb-4">
                  Your profile is performing well. Tailoring your skills to specific job descriptions could increase your acceptance rate by 15%.
                </p>
                <div className="absolute bottom-0 right-4 opacity-10">
                  <span className="material-symbols-outlined text-[100px]">analytics</span>
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6">
                <h3 className="font-semibold text-on-surface mb-4">Upcoming Interviews</h3>
                <div className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-sm">18</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Lumina Systems</p>
                    <p className="text-xs text-on-surface-variant">Design Review • 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
