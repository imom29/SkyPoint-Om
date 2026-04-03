import { useAuth } from "../../hooks/useAuth";
import PageWrapper from "../../components/layout/PageWrapper";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/formatDate";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{user?.full_name}</p>
              <Badge value={user?.role} label={user?.role === "hr" ? "Recruiter / HR" : "Job Seeker"} />
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Email" value={user?.email} />
            <Row label="Role" value={user?.role === "hr" ? "Recruiter / HR" : "Candidate"} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}
