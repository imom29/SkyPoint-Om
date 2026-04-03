import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { login } from "../../api/authApi";

export default function LoginPage() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit({ email, password }) {
    setError("");
    try {
      const data = await login(email, password);
      setAuth(data.access_token, {
        id: data.user_id,
        full_name: data.full_name,
        role: data.role,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-surface-container flex flex-col items-center justify-center px-6 py-10">
      <main className="w-full max-w-[440px]">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black tracking-tight text-primary">SkyPoint</h2>
          <h1 className="text-[32px] font-bold text-on-surface tracking-tight leading-tight mt-2">Welcome back</h1>
          <p className="text-on-surface-variant mt-2 text-sm">Enter your credentials to access your portal</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient-sm border border-outline-variant/10 p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-error-container/40 rounded-lg p-3 flex items-center gap-3 border border-error/10">
                <span className="material-symbols-outlined text-error text-[20px]">error</span>
                <p className="text-on-error-container text-xs font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary" htmlFor="password">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-on-surface-variant font-medium cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-semibold text-sm py-4 rounded-lg hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-2 w-full max-w-[440px]">
        <p className="text-[11px] font-medium text-outline uppercase tracking-widest text-center">
          © 2024 SkyPoint Professional. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
