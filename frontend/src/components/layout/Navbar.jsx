import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // HR users have their own sidebar layout — no top navbar needed
  if (isAuthenticated && user?.role === "hr") return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(to) {
    return location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  }

  const linkBase = "text-sm font-medium transition-colors";
  const linkActive = "text-primary border-b-2 border-primary pb-0.5";
  const linkInactive = "text-on-surface-variant hover:text-on-surface";

  return (
    <nav className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-black tracking-tight text-primary flex-shrink-0">
          SkyPoint
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {isAuthenticated && user?.role === "candidate" && (
            <>
              <Link to="/jobs" className={`${linkBase} ${isActive("/jobs") ? linkActive : linkInactive}`}>
                Jobs
              </Link>
              <Link to="/my-applications" className={`${linkBase} ${isActive("/my-applications") ? linkActive : linkInactive}`}>
                My Applications
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/jobs" className={`${linkBase} ${isActive("/jobs") ? linkActive : linkInactive}`}>
              Jobs
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`${linkBase} ${isActive("/profile") ? linkActive : linkInactive}`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary-container transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${linkBase} ${linkInactive}`}>
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary-container transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
