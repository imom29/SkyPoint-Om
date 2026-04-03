import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../api/jobsApi";
import JobForm from "../../components/jobs/JobForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import HRLayout from "../../components/layout/HRLayout";

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
    <HRLayout>
      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">Post New Job</h1>
            <p className="text-on-surface-variant text-sm mt-1">Fill in the details for your new job posting.</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            ● New Posting
          </span>
        </div>

        <ErrorMessage message={error} />

        <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Post Job" />
      </div>
    </HRLayout>
  );
}
