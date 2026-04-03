import { useState, useEffect } from "react";
import { getJobs } from "../../api/jobsApi";
import { useDebounce } from "../../hooks/useDebounce";
import JobCard from "../../components/jobs/JobCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";

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
    <div className="min-h-screen bg-surface-container">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-on-surface leading-tight tracking-tight">
            Discover your next{" "}
            <span className="text-primary">career<br />anchor.</span>
          </h1>
          <p className="text-on-surface-variant mt-4 text-sm max-w-md mx-auto">
            Browse through high-impact opportunities at SkyPoint. We pair visionary talent with
            industry-leading architectural and corporate roles.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary text-on-surface text-sm placeholder:text-outline transition-all"
            placeholder="Search job titles, keywords, or departments..."
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[160px]">
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 pl-4 pr-8 focus:ring-2 focus:ring-primary text-sm text-on-surface"
            >
              <option value="">All Locations</option>
              <option value="New York, NY">New York, NY</option>
              <option value="Remote">Remote</option>
              <option value="London, UK">London, UK</option>
              <option value="San Francisco, CA">San Francisco, CA</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">expand_more</span>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <select
              value={filters.job_type}
              onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 pl-4 pr-8 focus:ring-2 focus:ring-primary text-sm text-on-surface"
            >
              <option value="">All Job Types</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">expand_more</span>
          </div>

          <button
            onClick={() => setFilters({ title: "", location: "", job_type: "" })}
            className="bg-surface-container-high text-on-surface-variant px-5 py-3 rounded-xl text-sm font-medium hover:bg-surface-container-highest transition-colors"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="bg-error-container/40 rounded-lg p-4 flex items-start gap-3 border border-error/10 mb-6">
            <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0">error</span>
            <p className="text-on-error-container text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && !error && result?.items?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-on-surface-variant text-base">No jobs match your search.</p>
          </div>
        )}

        {/* Job list */}
        <div className="space-y-3">
          {!loading && result?.items?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {result && (
          <Pagination page={result.page} pages={result.pages} onPageChange={setPage} />
        )}
      </main>
    </div>
  );
}



