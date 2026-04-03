import { useState, useEffect } from "react";
import { getMyApplications } from "../../api/applicationsApi";
import ApplicationCard from "../../components/applications/ApplicationCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import PageWrapper from "../../components/layout/PageWrapper";

export default function MyApplicationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      <ErrorMessage message={error} />
      {loading && <LoadingSpinner />}

      {!loading && !error && data?.items?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          You haven&apos;t applied to any jobs yet.
        </div>
      )}

      {!loading && data && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{data.total} application{data.total !== 1 ? "s" : ""}</p>
          {data.items.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
