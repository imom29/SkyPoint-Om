import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { JOB_TYPES } from "../../utils/constants";

export default function JobForm({ defaultValues = {}, onSubmit, onCancel, isSubmitting, submitLabel = "Save" }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const salaryMin = watch("salary_min");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Primary Details */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h3 className="font-semibold text-on-surface text-sm">Primary Details</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-on-surface-variant font-medium">Visibility</span>
            <div className="relative">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-outline-variant/30 rounded-full peer-checked:bg-primary transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label htmlFor="job-title" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Job Title</label>
            <input
              id="job-title"
              {...register("title", { required: "Title is required", minLength: { value: 3, message: "At least 3 characters" } })}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Senior Backend Engineer"
            />
            {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="job-description" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
            <textarea
              id="job-description"
              {...register("description", { required: "Description is required", minLength: { value: 20, message: "At least 20 characters" } })}
              rows={6}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Logistics & Compensation */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10">
          <h3 className="font-semibold text-on-surface text-sm">Logistics &amp; Compensation</h3>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="job-location" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Location</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">location_on</span>
                <input
                  id="job-location"
                  {...register("location", { required: "Location is required" })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-9 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>
              {errors.location && <p className="text-xs text-error mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label htmlFor="job-type" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Job Type</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">schedule</span>
                <select
                  id="job-type"
                  {...register("job_type", { required: "Job type is required" })}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-9 pr-10 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select type...</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">expand_more</span>
              </div>
              {errors.job_type && <p className="text-xs text-error mt-1">{errors.job_type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="salary-min" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Salary Min (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">$</span>
                <input
                  id="salary-min"
                  type="number"
                  {...register("salary_min", { min: { value: 0, message: "Must be positive" }, valueAsNumber: true })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-7 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="120000"
                />
              </div>
              {errors.salary_min && <p className="text-xs text-error mt-1">{errors.salary_min.message}</p>}
            </div>

            <div>
              <label htmlFor="salary-max" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Salary Max (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm font-medium">$</span>
                <input
                  id="salary-max"
                  type="number"
                  {...register("salary_max", {
                    min: { value: 0, message: "Must be positive" },
                    valueAsNumber: true,
                    validate: (v) => !v || !salaryMin || Number(v) >= Number(salaryMin) || "Must be \u2265 min salary",
                  })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-7 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="165000"
                />
              </div>
              {errors.salary_max && <p className="text-xs text-error mt-1">{errors.salary_max.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2.5"
          >
            Cancel Changes
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

JobForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
  submitLabel: PropTypes.string,
};



