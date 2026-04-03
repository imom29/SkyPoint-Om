import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user.role === "hr" ? "/dashboard" : "/jobs", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Find your next <span className="text-blue-600">opportunity</span>
      </h1>
      <p className="text-lg text-gray-500 max-w-xl mb-10">
        SkyPoint connects talented candidates with great companies. Browse hundreds of jobs or post your own.
      </p>
      <div className="flex gap-4">
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 text-sm"
        >
          Browse Jobs
        </Link>
        <Link
          to="/register"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 text-sm"
        >
          Sign up free
        </Link>
      </div>
    </div>
  );
}
