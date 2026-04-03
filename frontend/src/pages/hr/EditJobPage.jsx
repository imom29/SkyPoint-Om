import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJob, updateJob } from "../../api/jobsApi";
import JobForm from "../../components/jobs/JobForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import HRLayout from "../../components/layout/HRLayout";

export default function EditJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(data) {
    setError("");
    setIsSubmitting(true);
    try {
      const cleaned = {
        ...data,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
      };
      await updateJob(jobId, cleaned);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update job.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <HRLayout>
      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">Edit Job</h1>
            <p className="text-on-surface-variant text-sm mt-1">Refine your job requirements and manage visibility.</p>
          </div>
          <div className="text-right">
            {job && <p className="text-xs text-on-surface-variant font-mono mb-1">ID: SP-{job.id}</p>}
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              ● Active Status
            </span>
          </div>
        </div>

        <ErrorMessage message={error} />

        {job && (
          <JobForm
            defaultValues={{
              title: job.title,
              description: job.description,
              location: job.location,
              job_type: job.job_type,
              salary_min: job.salary_min ?? "",
              salary_max: job.salary_max ?? "",
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Update Job Posting"
            onCancel={() => navigate("/dashboard")}
          />
        )}

        {/* Stats */}
        {job && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">group</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Applicants</p>
                <p className="text-lg font-black text-on-surface">{job.application_count ?? 0} Candidates</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">visibility</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Views</p>
                <p className="text-lg font-black text-on-surface">1.2k Total</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Created</p>
                <p className="text-sm font-bold text-on-surface">{job.created_at ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
}



