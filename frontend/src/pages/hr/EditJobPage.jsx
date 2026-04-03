import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJob, updateJob } from "../../api/jobsApi";
import JobForm from "../../components/jobs/JobForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";

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
    <PageWrapper>
      <div className="max-w-2xl">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 block">&larr; Back to dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ErrorMessage message={error} />
          {job && (
            <div className={error ? "mt-4" : ""}>
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
                submitLabel="Save Changes"
              />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
