import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile } from "../../api/profileApi";
import PageWrapper from "../../components/layout/PageWrapper";
import Badge from "../../components/common/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function ProfilePage() {
  const { user } = useAuth();
  const isCandidate = user?.role === "candidate";

  return (
    <PageWrapper>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Account card — same for both roles */}
        <AccountCard user={user} />

        {/* Extended profile — candidates only */}
        {isCandidate && <CandidateProfileSection />}
      </div>
    </PageWrapper>
  );
}

/* ── Account card (read-only) ─────────────────────────────── */
function AccountCard({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold select-none">
          {user?.full_name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{user?.full_name}</p>
          <Badge value={user?.role} label={user?.role === "hr" ? "Recruiter / HR" : "Job Seeker"} />
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Role" value={user?.role === "hr" ? "Recruiter / HR" : "Candidate"} />
      </div>
    </div>
  );
}

/* ── Candidate extended profile ───────────────────────────── */
function CandidateProfileSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(updated) {
    setProfile(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
          Profile saved successfully.
        </div>
      )}

      {editing ? (
        <ProfileEditForm
          profile={profile}
          onSaved={handleSaved}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ProfileView profile={profile} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}

/* ── Read-only view ───────────────────────────────────────── */
function ProfileView({ profile, onEdit }) {
  const isEmpty =
    !profile.bio &&
    !profile.resume_url &&
    !profile.years_of_experience &&
    !(profile.skills?.length) &&
    !(profile.experience?.length) &&
    !(profile.projects?.length);

  return (
    <div className="space-y-4">
      {isEmpty && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          Your profile is empty.{" "}
          <button onClick={onEdit} className="font-medium underline">
            Add your details
          </button>{" "}
          to stand out to recruiters.
        </div>
      )}

      {/* About */}
      <Section title="About" onEdit={onEdit}>
        <div className="space-y-0 text-sm">
          {profile.bio && (
            <div className="py-2 border-b border-gray-50">
              <p className="text-gray-500 mb-1">Bio</p>
              <p className="text-gray-900">{profile.bio}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <InfoRow label="Phone" value={profile.phone} />
            <InfoRow label="Location" value={profile.location} />
            <InfoRow label="Years of experience" value={profile.years_of_experience != null ? `${profile.years_of_experience} yr${profile.years_of_experience !== 1 ? "s" : ""}` : null} />
            <InfoRow label="Resume" value={profile.resume_url ? <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{profile.resume_url}</a> : null} />
            <InfoRow label="LinkedIn" value={profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{profile.linkedin_url}</a> : null} />
            <InfoRow label="GitHub" value={profile.github_url ? <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{profile.github_url}</a> : null} />
          </div>
        </div>

        {profile.skills?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <Section title="Work Experience" onEdit={onEdit}>
          <div className="space-y-4">
            {profile.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-blue-200 pl-4">
                <p className="font-medium text-gray-900 text-sm">{exp.role}</p>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {exp.start_year} — {exp.end_year ?? "Present"}
                </p>
                {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {profile.projects?.length > 0 && (
        <Section title="Projects" onEdit={onEdit}>
          <div className="space-y-4">
            {profile.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 text-sm">{proj.name}</p>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Link ↗
                    </a>
                  )}
                </div>
                {proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {!isEmpty && (
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}

/* ── Edit form ────────────────────────────────────────────── */
function ProfileEditForm({ profile, onSaved, onCancel }) {
  const [saveError, setSaveError] = useState("");

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      bio: profile.bio ?? "",
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      resume_url: profile.resume_url ?? "",
      linkedin_url: profile.linkedin_url ?? "",
      github_url: profile.github_url ?? "",
      years_of_experience: profile.years_of_experience ?? "",
      skillsRaw: profile.skills?.join(", ") ?? "",
      experience: profile.experience?.length
        ? profile.experience
        : [{ company: "", role: "", start_year: "", end_year: "", description: "" }],
      projects: profile.projects?.length
        ? profile.projects
        : [{ name: "", description: "", url: "" }],
    },
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experience" });

  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({ control, name: "projects" });

  async function onSubmit(values) {
    setSaveError("");
    // Parse skills from comma-separated string
    const skills = values.skillsRaw
      ? values.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    // Clean experience — drop blank entries
    const experience = values.experience
      .filter((e) => e.company?.trim() && e.role?.trim() && e.start_year)
      .map((e) => ({
        company: e.company.trim(),
        role: e.role.trim(),
        start_year: Number(e.start_year),
        end_year: e.end_year ? Number(e.end_year) : null,
        description: e.description?.trim() || null,
      }));

    // Clean projects — drop blank entries
    const projects = values.projects
      .filter((p) => p.name?.trim())
      .map((p) => ({
        name: p.name.trim(),
        description: p.description?.trim() || null,
        url: p.url?.trim() || null,
      }));

    const payload = {
      bio: values.bio || null,
      phone: values.phone || null,
      location: values.location || null,
      resume_url: values.resume_url || null,
      linkedin_url: values.linkedin_url || null,
      github_url: values.github_url || null,
      years_of_experience: values.years_of_experience !== "" ? Number(values.years_of_experience) : null,
      skills,
      experience,
      projects,
    };

    try {
      const updated = await updateProfile(payload);
      onSaved(updated);
    } catch (err) {
      setSaveError(err.response?.data?.detail || "Failed to save profile.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ErrorMessage message={saveError} />

      {/* Basic info */}
      <FormSection title="About">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Bio</Label>
            <textarea
              {...register("bio", { maxLength: { value: 1000, message: "Max 1000 chars" } })}
              rows={3}
              placeholder="A short summary about yourself..."
              className={input()}
            />
            {errors.bio && <Err>{errors.bio.message}</Err>}
          </div>
          <div>
            <Label>Phone</Label>
            <input {...register("phone")} placeholder="+1 555 000 0000" className={input()} />
          </div>
          <div>
            <Label>Location</Label>
            <input {...register("location")} placeholder="City, Country" className={input()} />
          </div>
          <div>
            <Label>Years of Experience</Label>
            <input
              type="number"
              {...register("years_of_experience", { min: { value: 0, message: "Must be ≥ 0" } })}
              placeholder="e.g. 3"
              className={input()}
            />
            {errors.years_of_experience && <Err>{errors.years_of_experience.message}</Err>}
          </div>
          <div>
            <Label>Resume URL</Label>
            <input {...register("resume_url")} placeholder="https://your-resume.com" className={input()} />
          </div>
          <div>
            <Label>LinkedIn URL</Label>
            <input {...register("linkedin_url")} placeholder="https://linkedin.com/in/you" className={input()} />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <input {...register("github_url")} placeholder="https://github.com/you" className={input()} />
          </div>
          <div className="sm:col-span-2">
            <Label>Skills <span className="text-gray-400 font-normal">(comma-separated)</span></Label>
            <input
              {...register("skillsRaw")}
              placeholder="e.g. Python, React, Docker, PostgreSQL"
              className={input()}
            />
          </div>
        </div>
      </FormSection>

      {/* Work Experience */}
      <FormSection title="Work Experience">
        <div className="space-y-4">
          {expFields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-xl p-4 relative">
              <button
                type="button"
                onClick={() => removeExp(i)}
                className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Company *</Label>
                  <input {...register(`experience.${i}.company`)} placeholder="Acme Corp" className={input()} />
                </div>
                <div>
                  <Label>Role *</Label>
                  <input {...register(`experience.${i}.role`)} placeholder="Software Engineer" className={input()} />
                </div>
                <div>
                  <Label>Start Year *</Label>
                  <input type="number" {...register(`experience.${i}.start_year`)} placeholder="2021" className={input()} />
                </div>
                <div>
                  <Label>End Year <span className="text-gray-400 font-normal">(leave blank if current)</span></Label>
                  <input type="number" {...register(`experience.${i}.end_year`)} placeholder="2024" className={input()} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <textarea
                    {...register(`experience.${i}.description`)}
                    rows={2}
                    placeholder="What did you do in this role?"
                    className={input()}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendExp({ company: "", role: "", start_year: "", end_year: "", description: "" })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add experience
          </button>
        </div>
      </FormSection>

      {/* Projects */}
      <FormSection title="Projects">
        <div className="space-y-4">
          {projFields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-xl p-4 relative">
              <button
                type="button"
                onClick={() => removeProj(i)}
                className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Project Name *</Label>
                  <input {...register(`projects.${i}.name`)} placeholder="My Awesome App" className={input()} />
                </div>
                <div>
                  <Label>URL</Label>
                  <input {...register(`projects.${i}.url`)} placeholder="https://github.com/you/project" className={input()} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <textarea
                    {...register(`projects.${i}.description`)}
                    rows={2}
                    placeholder="What does this project do?"
                    className={input()}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendProj({ name: "", description: "", url: "" })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add project
          </button>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── Small helpers ────────────────────────────────────────── */
function Section({ title, onEdit, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <button onClick={onEdit} className="text-xs text-blue-600 hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2 px-1 border-b border-gray-50">
      <span className="text-gray-500 text-sm shrink-0 mr-4">{label}</span>
      <span className="text-gray-900 text-sm font-medium text-right break-all">{value}</span>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function Err({ children }) {
  return <p className="text-xs text-red-600 mt-1">{children}</p>;
}

function input() {
  return "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
}
