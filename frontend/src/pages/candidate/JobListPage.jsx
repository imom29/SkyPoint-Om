import { useState, useEffect } from "react";
import { getJobs } from "../../api/jobsApi";
import { useDebounce } from "../../hooks/useDebounce";
import JobCard from "../../components/jobs/JobCard";
import JobFilters from "../../components/jobs/JobFilters";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import PageWrapper from "../../components/layout/PageWrapper";

export default function JobListPage() {
  const [filters, setFilters] = useState({ title: "", location: "", job_type: "" });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedFilters = useDebounce(filters, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError("");
      try {
        const params = { page, page_size: 10 };
        if (debouncedFilters.title) params.title = debouncedFilters.title;
        if (debouncedFilters.location) params.location = debouncedFilters.location;
        if (debouncedFilters.job_type) params.job_type = debouncedFilters.job_type;
        const data = await getJobs(params);
        setResult(data);
      } catch {
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [debouncedFilters, page]);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Jobs</h1>
        <p className="text-sm text-gray-500">
          {result ? `${result.total} job${result.total !== 1 ? "s" : ""} available` : ""}
        </p>
      </div>

      <JobFilters filters={filters} onChange={setFilters} />

      <div className="mt-6 space-y-4">
        <ErrorMessage message={error} />
        {loading && <LoadingSpinner />}
        {!loading && !error && result?.items?.length === 0 && (
          <div className="text-center py-16 text-gray-400">No jobs match your search.</div>
        )}
        {!loading && result?.items?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {result && (
        <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
      )}
    </PageWrapper>
  );
}
