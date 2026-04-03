import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getJob } from "../../api/jobsApi";
import { applyToJob } from "../../api/applicationsApi";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatSalary } from "../../utils/formatDate";
import { JOB_TYPE_LABELS } from "../../utils/constants";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await getJob(jobId);
        setJob(data);
      } catch {
        setError("Job not found.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  async function onApply({ cover_letter, resume_url, resume_text }) {
    setApplyError("");
    try {
      await applyToJob({ job_id: jobId, cover_letter, resume_url: resume_url || null, resume_text: resume_text || null });
      setApplied(true);
    } catch (err) {
      setApplyError(err.response?.data?.detail || "Failed to submit application.");
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-3xl mx-auto px-6 py-8"><ErrorMessage message={error} /></div>;

  const salary = formatSalary(job.salary_min, job.salary_max);
  const isCandidate = isAuthenticated && user?.role === "candidate";
  const jobTypeLabel = JOB_TYPE_LABELS[job.job_type] || job.job_type;

  return (
    <div className="min-h-screen bg-surface-container">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left: Job content */}
          <div className="flex-1 min-w-0">
            {/* Job header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[20px]">work</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{job.posted_by?.full_name || "SkyPoint"}</p>
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-on-surface mb-3">{job.title}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">{jobTypeLabel}</span>
                {salary && (
                  <span className="text-xs font-semibold bg-surface-container-lowest border border-outline-variant/20 text-on-surface px-3 py-1.5 rounded-full">
                    {salary}
                  </span>
                )}
                <span className="text-xs font-semibold bg-surface-container-lowest border border-outline-variant/20 text-on-surface px-3 py-1.5 rounded-full">
                  {job.location}
                </span>
              </div>
            </div>

            {/* Applied notification */}
            {isCandidate && applied && (
              <div className="bg-tertiary-fixed-dim/30 border border-on-tertiary-fixed-variant/20 rounded-xl p-4 text-sm text-on-surface font-medium mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-[20px]">check_circle</span>
                Application Pending — Last updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            )}

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-on-surface mb-3">The Mission</h2>
              <div className="text-on-surface-variant leading-relaxed whitespace-pre-line text-sm">{job.description}</div>
            </section>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                  <span className="text-xs font-bold uppercase tracking-wider">The Team</span>
                </div>
                <p className="text-sm text-on-surface">
                  Join a cross-functional team dedicated to building great products.
                </p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Growth Path</span>
                </div>
                <p className="text-sm text-on-surface">
                  Clear trajectory and opportunities to grow within the organization.
                </p>
              </div>
            </div>

            {/* Workplace map */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-on-surface mb-3">Workplace</h2>
              <div className="rounded-xl overflow-hidden border border-outline-variant/10 relative" style={{ height: 300 }}>
                <iframe
                  title="Office location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-122.43%2C37.76%2C-122.38%2C37.79&layer=mapnik"
                  className="w-full h-full border-0"
                  style={{ filter: "grayscale(100%)" }}
                  loading="lazy"
                />
                {/* Location badge overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {" "}{job.location || "SkyPoint HQ"}
                </div>
              </div>
            </section>
          </div>

          {/* Right: Sticky apply sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Apply card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
                <h3 className="font-semibold text-on-surface mb-4">Apply for this role</h3>

                {!isAuthenticated && (
                  <Link
                    to="/login"
                    state={{ from: { pathname: `/jobs/${jobId}` } }}
                    className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-container transition-colors"
                  >
                    Login to Apply
                  </Link>
                )}

                {isCandidate && applied && (
                  <div className="text-sm text-on-tertiary-fixed-variant font-medium text-center py-2">
                    ✓ Application submitted
                  </div>
                )}

                {isCandidate && !applied && (
                  <form onSubmit={handleSubmit(onApply)} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5" htmlFor="resume-url">
                        Resume URL
                      </label>
                      <input
                        id="resume-url"
                        type="url"
                        {...register("resume_url")}
                        placeholder="https://portfolio.me/your-resume"
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5" htmlFor="cover-letter">
                        Cover Letter
                      </label>
                      <textarea
                        id="cover-letter"
                        {...register("cover_letter", {
                          required: "Cover letter is required",
                          minLength: { value: 50, message: "At least 50 characters" },
                        })}
                        rows={4}
                        placeholder="Tell us about your visual philosophy..."
                        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      {errors.cover_letter && <p className="text-error text-[10px] mt-1">{errors.cover_letter.message}</p>}
                    </div>

                    {applyError && <p className="text-error text-xs">{applyError}</p>}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-container transition-colors disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

