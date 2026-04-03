import { useForm } from "react-hook-form";
import { JOB_TYPES } from "../../utils/constants";

export default function JobForm({ defaultValues = {}, onSubmit, isSubmitting, submitLabel = "Save" }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const salaryMin = watch("salary_min");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
        <input
          {...register("title", { required: "Title is required", minLength: { value: 3, message: "At least 3 characters" } })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Senior Backend Engineer"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          {...register("description", { required: "Description is required", minLength: { value: 20, message: "At least 20 characters" } })}
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the role, responsibilities, and requirements..."
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Remote, New York, NY"
          />
          {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
          <select
            {...register("job_type", { required: "Job type is required" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type...</option>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.job_type && <p className="text-xs text-red-600 mt-1">{errors.job_type.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (USD)</label>
          <input
            type="number"
            {...register("salary_min", {
              min: { value: 0, message: "Must be positive" },
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 80000"
          />
          {errors.salary_min && <p className="text-xs text-red-600 mt-1">{errors.salary_min.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (USD)</label>
          <input
            type="number"
            {...register("salary_max", {
              min: { value: 0, message: "Must be positive" },
              valueAsNumber: true,
              validate: (v) =>
                !v || !salaryMin || Number(v) >= Number(salaryMin) || "Must be ≥ min salary",
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 120000"
          />
          {errors.salary_max && <p className="text-xs text-red-600 mt-1">{errors.salary_max.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
