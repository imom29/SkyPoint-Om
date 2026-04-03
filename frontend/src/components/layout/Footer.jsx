import { useAuth } from "../../hooks/useAuth";

export default function Footer() {
  const { user, isAuthenticated } = useAuth();

  // HR users have their own footer inside HRLayout
  if (isAuthenticated && user?.role === "hr") return null;

  return (
    <footer className="border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-[11px] text-outline uppercase tracking-widest">© 2024 SkyPoint Professional. All rights reserved.</p>
        <div className="flex gap-4 text-[11px] text-primary">
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Terms of Service</span>
          <span className="cursor-pointer hover:underline">Cookie Settings</span>
          <span className="cursor-pointer hover:underline">Contact Support</span>
        </div>
      </div>
    </footer>
  );
}
