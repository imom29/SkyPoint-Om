import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createJob } from "../../api/jobsApi";
import JobForm from "../../components/jobs/JobForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data) {
    setError("");
    setIsSubmitting(true);
    try {
      const cleaned = {
        ...data,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
      };
      await createJob(cleaned);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create job.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 block">&larr; Back to dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ErrorMessage message={error} />
          <div className={error ? "mt-4" : ""}>
            <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Post Job" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
