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
    <div className="min-h-screen bg-gradient-to-br from-surface-container-low to-surface-container-lowest flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-black tracking-tight text-on-surface mb-4">
        Find your next <span className="text-primary">opportunity</span>
      </h1>
      <p className="text-lg text-on-surface-variant max-w-xl mb-10">
        SkyPoint connects talented candidates with great companies. Browse hundreds of jobs or post your own.
      </p>
      <div className="flex gap-4">
        <Link
          to="/jobs"
          className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary transition-colors text-sm"
        >
          Browse Jobs
        </Link>
        <Link
          to="/register"
          className="border border-outline-variant/30 text-on-surface-variant px-6 py-3 rounded-xl font-semibold hover:bg-surface-container-low text-sm"
        >
          Sign up free
        </Link>
      </div>
    </div>
  );
}
