import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
          SkyPoint
        </Link>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
                Browse Jobs
              </Link>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "candidate" && (
            <>
              <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
                Browse Jobs
              </Link>
              <Link to="/my-applications" className="text-sm text-gray-600 hover:text-gray-900">
                My Applications
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "hr" && (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/jobs/create" className="text-sm text-gray-600 hover:text-gray-900">
                Post a Job
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <Link to="/profile" className="text-sm text-gray-700 hover:text-gray-900 font-medium">
                {user?.full_name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
