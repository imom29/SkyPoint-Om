import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
];

export default function HRLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-surface-container">
      {/* Sidebar */}
      <aside className="w-[180px] min-w-[180px] bg-surface-container-lowest border-r border-outline-variant/15 flex flex-col fixed top-0 left-0 h-full z-20">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-outline-variant/10">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">rocket_launch</span>
            </div>
            <span className="text-on-surface font-black text-base tracking-tight">SkyPoint HR</span>
          </div>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1 ml-9">Recruiter Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-secondary-container text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${active ? "text-primary" : ""}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Post New Job */}
        <div className="px-3 pb-4">
          <Link
            to="/jobs/create"
            className="w-full flex items-center justify-center gap-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors"
          >
            Post New Job
          </Link>
        </div>

        {/* Bottom actions */}
        <div className="px-3 pb-5 border-t border-outline-variant/10 pt-4 space-y-0.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-all w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>{" "}
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-[180px] flex flex-col min-h-screen">
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
        <footer className="px-8 py-5 border-t border-outline-variant/10 bg-surface-container-lowest">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-outline uppercase tracking-widest">© 2024 SkyPoint Professional. All rights reserved.</p>
            <div className="flex gap-4 text-[11px] text-primary">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:underline cursor-pointer">Cookie Settings</span>
              <span className="hover:underline cursor-pointer">Contact Support</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

HRLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
