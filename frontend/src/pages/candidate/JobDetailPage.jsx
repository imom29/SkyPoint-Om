import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getJob } from "../../api/jobsApi";
import { applyToJob } from "../../api/applicationsApi";
import { getProfile } from "../../api/profileApi";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../../components/common/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";
import { formatDate, formatSalary } from "../../utils/formatDate";
import { JOB_TYPE_LABELS } from "../../utils/constants";

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [profileResumeUrl, setProfileResumeUrl] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();

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

  // Pre-fill resume URL from profile when candidate opens the apply form
  useEffect(() => {
    if (isAuthenticated && user?.role === "candidate") {
      getProfile()
        .then((p) => {
          if (p.resume_url) {
            setProfileResumeUrl(p.resume_url);
          }
        })
        .catch(() => {}); // non-critical — silently ignore
    }
  }, [isAuthenticated, user]);

  async function onApply({ cover_letter, resume_url, resume_text }) {
    setApplyError("");
    try {
      await applyToJob({ job_id: jobId, cover_letter, resume_url: resume_url || null, resume_text: resume_text || null });
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      setApplyError(err.response?.data?.detail || "Failed to submit application.");
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <PageWrapper><ErrorMessage message={error} /></PageWrapper>;

  const salary = formatSalary(job.salary_min, job.salary_max);
  const isCandidate = isAuthenticated && user?.role === "candidate";

  return (
    <PageWrapper>
      <div className="max-w-3xl">
        <Link to="/jobs" className="text-sm text-blue-600 hover:underline mb-6 block">&larr; Back to jobs</Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-500 mt-1">{job.posted_by?.full_name}</p>
            </div>
            <Badge value={job.job_type} label={JOB_TYPE_LABELS[job.job_type]} />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100 mb-6">
            <span>{job.location}</span>
            {salary && <span className="text-green-700 font-medium">{salary}</span>}
            <span>{job.application_count} applicant{job.application_count !== 1 ? "s" : ""}</span>
            <span>Posted {formatDate(job.created_at)}</span>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line mb-8">
            {job.description}
          </div>

          {/* Apply section */}
          {!isAuthenticated && (
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-3">You need to be signed in to apply.</p>
              <Link
                to="/login"
                state={{ from: { pathname: `/jobs/${jobId}` } }}
                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Login to apply
              </Link>
            </div>
          )}

          {isCandidate && !applied && !showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                if (profileResumeUrl) setValue("resume_url", profileResumeUrl);
              }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Apply Now
            </button>
          )}

          {isCandidate && applied && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium">
              Application submitted successfully!
            </div>
          )}

          {isCandidate && showForm && !applied && (
            <div className="border border-gray-200 rounded-xl p-6 mt-4">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Your Application</h2>
              <ErrorMessage message={applyError} />
              <form onSubmit={handleSubmit(onApply)} className="space-y-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                  <textarea
                    {...register("cover_letter", {
                      required: "Cover letter is required",
                      minLength: { value: 50, message: "At least 50 characters" },
                      maxLength: { value: 5000, message: "Max 5000 characters" },
                    })}
                    rows={5}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cover_letter && <p className="text-xs text-red-600 mt-1">{errors.cover_letter.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL (optional)</label>
                  <input
                    {...register("resume_url")}
                    placeholder="https://your-resume-link.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {profileResumeUrl && (
                    <p className="text-xs text-gray-400 mt-1">Pre-filled from your profile.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Summary (optional)</label>
                  <textarea
                    {...register("resume_text", { maxLength: { value: 3000, message: "Max 3000 characters" } })}
                    rows={3}
                    placeholder="Paste a brief summary of your experience..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.resume_text && <p className="text-xs text-red-600 mt-1">{errors.resume_text.message}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
