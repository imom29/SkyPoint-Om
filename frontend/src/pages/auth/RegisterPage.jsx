import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { register as registerUser, login } from "../../api/authApi";

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "candidate" } });

  const role = watch("role");

  async function onSubmit({ email, full_name, password, role }) {
    setError("");
    try {
      await registerUser({ email, full_name, password, role });
      // Auto-login after registration
      const data = await login(email, password);
      setAuth(data.access_token, {
        id: data.user_id,
        full_name: data.full_name,
        role: data.role,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center px-6 py-10 overflow-x-hidden relative">

      <main className="w-full max-w-md relative">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 justify-center mb-1">
            <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
            <h1 className="text-2xl font-black tracking-tighter text-primary">SkyPoint</h1>
          </div>
          <p className="text-secondary text-sm mt-1 tracking-wide">Elevate your professional trajectory.</p>
        </div>

        {/* Card */}
        <section className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-ambient-sm border border-outline-variant/10">
          <header className="mb-6">
            <h2 className="text-on-surface text-lg font-bold tracking-tight">Create your account</h2>
            <p className="text-on-surface-variant text-sm mt-1">Join the elite talent ecosystem.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-error-container/40 rounded-lg p-3 flex items-start gap-3 border border-error/10">
                <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0 mt-0.5">error</span>
                <p className="text-on-error-container text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-secondary" htmlFor="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                {...register("full_name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-outline/50 outline-none text-sm text-on-surface"
                placeholder="E.g. Julian Thorne"
              />
              {errors.full_name && <p className="text-xs text-error">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-secondary" htmlFor="email">
                Professional Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-outline/50 outline-none text-sm text-on-surface"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-secondary" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  validate: {
                    hasUpper: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
                    hasDigit: (v) => /\d/.test(v) || "Must include a digit",
                  },
                })}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-outline/50 outline-none text-sm text-on-surface"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-semibold text-secondary">Account Type</span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-lg">
                <label className="cursor-pointer">
                  <input className="sr-only peer" type="radio" value="candidate" {...register("role")} />
                  <div
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                      role === "candidate"
                        ? "bg-surface-container-lowest text-primary shadow-sm"
                        : "text-secondary hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Candidate
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="sr-only peer" type="radio" value="hr" {...register("role")} />
                  <div
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                      role === "hr"
                        ? "bg-surface-container-lowest text-primary shadow-sm"
                        : "text-secondary hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">business_center</span>
                    HR / Admin
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Creating account..." : (
                <><span>Register</span><span className="text-lg">&rarr;</span></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-container-high text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </section>

        <footer className="mt-6 text-center">
          <p className="text-[11px] text-outline uppercase tracking-widest">
            © 2024 SkyPoint Professional. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}

