import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { register as registerUser } from "../../api/authApi";
import { login } from "../../api/authApi";
import ErrorMessage from "../../components/common/ErrorMessage";

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

  const password = watch("password");

  async function onSubmit({ email, full_name, password, role }) {
    setError("");
    try {
      await registerUser({ email, full_name, password, role });
      // Auto-login after registration
      const { login: loginApi } = await import("../../api/authApi");
      const data = await loginApi(email, password);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Join SkyPoint today</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register("full_name", { required: "Full name is required", minLength: { value: 2, message: "At least 2 characters" } })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Smith"
            />
            {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                validate: {
                  hasUpper: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
                  hasDigit: (v) => /\d/.test(v) || "Must include a digit",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "candidate", label: "Job Seeker", desc: "Browse and apply for jobs" },
                { value: "hr", label: "Recruiter / HR", desc: "Post jobs and hire talent" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`relative flex flex-col cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                    watch("role") === opt.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("role")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                  <span className="text-xs text-gray-500 mt-0.5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
