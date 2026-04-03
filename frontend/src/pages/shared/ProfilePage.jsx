import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile } from "../../api/profileApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function ProfilePage() {
  const { user } = useAuth();
  const isCandidate = user?.role === "candidate";

  return (
    <div className="min-h-screen bg-surface-container">
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary text-2xl font-black select-none shadow-ambient-sm">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-on-surface">{user?.full_name}</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                {user?.role === "hr" ? "Recruiter / HR" : "Job Seeker"}{" "}
                <span className="text-outline">·</span>{" "}
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isCandidate ? (
          <CandidateProfileSection user={user} />
        ) : (
          <HRProfileSection user={user} />
        )}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CANDIDATE PROFILE — two-column layout
══════════════════════════════════════════════════════════ */
function CandidateProfileSection({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
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
    <div>
      {saved && (
        <div className="bg-tertiary-fixed-dim/30 border border-on-tertiary-fixed-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface font-medium mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {" "}Profile saved successfully.
        </div>
      )}

      {editing ? (
        <ProfileEditForm profile={profile} onSaved={handleSaved} onCancel={() => setEditing(false)} />
      ) : (
        <ProfileView profile={profile} user={user} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}

CandidateProfileSection.propTypes = {
  user: PropTypes.shape({ full_name: PropTypes.string, email: PropTypes.string }).isRequired,
};

/* ── Read-only two-column view ───────────────────────────── */
function ProfileView({ profile, user, onEdit }) {
  const yrs = profile.years_of_experience;
  const yrSuffix = yrs === 1 ? "" : "s";
  const yearsLabel = yrs == null ? null : `${yrs} yr${yrSuffix}`;

  const isEmpty =
    !profile.bio &&
    !profile.resume_url &&
    !profile.years_of_experience &&
    !(profile.skills?.length) &&
    !(profile.experience?.length) &&
    !(profile.projects?.length);

  if (isEmpty) {
    return (
      <div className="bg-secondary-container/60 border border-outline-variant/20 rounded-xl px-6 py-8 text-center">
        <span className="material-symbols-outlined text-4xl text-primary mb-3 block">person_add</span>
        <p className="text-sm text-on-surface font-medium mb-2">Your profile is empty.</p>
        <p className="text-xs text-on-surface-variant mb-4">Add your details to stand out to recruiters.</p>
        <button
          onClick={onEdit}
          className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors"
        >
          Build Profile
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      {/* ── LEFT COLUMN ── */}
      <div className="w-72 flex-shrink-0 space-y-4">
        {/* Bio card */}
        {profile.bio && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Professional Bio</p>
              <button onClick={onEdit} className="text-primary" title="Edit">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <p className="text-sm text-on-surface leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Contact & Details card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Contact &amp; Details</p>
            <button onClick={onEdit} className="text-primary" title="Edit">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
          <div className="space-y-3">
            <ContactRow icon="mail" label="Email" value={user?.email} />
            {profile.phone && <ContactRow icon="call" label="Phone" value={profile.phone} />}
            {profile.location && <ContactRow icon="location_on" label="Location" value={profile.location} />}
            {yearsLabel && <ContactRow icon="work_history" label="Experience" value={yearsLabel} />}
            {profile.resume_url && (
              <ContactRow
                icon="attachment"
                label="Resume"
                value={
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all text-xs">
                    View Resume ↗
                  </a>
                }
              />
            )}
          </div>
        </div>

        {/* Socials card */}
        {(profile.linkedin_url || profile.github_url) && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Socials</p>
              <button onClick={onEdit} className="text-primary" title="Edit">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="space-y-2">
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">link</span>{" "}
                  LinkedIn
                </a>
              )}
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">code</span>{" "}
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* Skills card */}
        {profile.skills?.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Core Skills</p>
              <button onClick={onEdit} className="text-primary" title="Edit">
                <span className="material-symbols-outlined text-[18px]">settings</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={`${s}-${i}`} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Work Experience timeline */}
        {profile.experience?.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Work Experience</p>
              <button onClick={onEdit} className="text-primary" title="Edit">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="space-y-5">
              {profile.experience.map((exp, i) => {
                const isCurrent = !exp.end_year;
                return (
                  <div key={`${exp.company}-${exp.role}-${exp.start_year}-${i}`} className="flex gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-3 h-3 rounded-full border-2 ${isCurrent ? "bg-primary border-primary" : "bg-transparent border-outline-variant"}`} />
                      {i < profile.experience.length - 1 && (
                        <div className="w-px flex-1 bg-outline-variant/30 mt-1" style={{ minHeight: "2rem" }} />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-on-surface text-sm">{exp.role}</p>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Present</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{exp.company}</p>
                      <p className="text-xs text-outline mt-0.5">
                        {exp.start_year} — {exp.end_year ?? "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects grid */}
        {profile.projects?.length > 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Selected Projects</p>
              <button onClick={onEdit} className="text-primary" title="Edit">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map((proj, i) => (
                <div key={`${proj.name}-${i}`} className="border border-outline-variant/20 rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-on-surface text-sm">{proj.name}</p>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-on-surface-variant leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>{" "}
          Edit Profile
        </button>
      </div>
    </div>
  );
}

ProfileView.propTypes = {
  profile: PropTypes.shape({
    bio: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    years_of_experience: PropTypes.number,
    resume_url: PropTypes.string,
    linkedin_url: PropTypes.string,
    github_url: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string,
        company: PropTypes.string,
        start_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        end_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
      })
    ),
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  user: PropTypes.shape({ email: PropTypes.string }),
  onEdit: PropTypes.func.isRequired,
};

ProfileView.defaultProps = { user: null };

/* ── Contact row helper ──────────────────────────────────── */
function ContactRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
        <div className="text-xs text-on-surface mt-0.5">{value}</div>
      </div>
    </div>
  );
}

ContactRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
};

ContactRow.defaultProps = { value: null };

/* ══════════════════════════════════════════════════════════
   HR PROFILE — simple info card
══════════════════════════════════════════════════════════ */
function HRProfileSection({ user }) {
  return (
    <div className="max-w-xl">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Account Details</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">mail</span>
          <span className="text-on-surface-variant">Email:</span>
          <span className="text-on-surface font-medium">{user?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">badge</span>
          <span className="text-on-surface-variant">Role:</span>
          <span className="text-on-surface font-medium">Recruiter / HR</span>
        </div>
      </div>
    </div>
  );
}

HRProfileSection.propTypes = {
  user: PropTypes.shape({ email: PropTypes.string, full_name: PropTypes.string }),
};

HRProfileSection.defaultProps = { user: null };

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
      years_of_experience: values.years_of_experience === "" ? null : Number(values.years_of_experience),
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
            <Label>Skills <span className="text-outline font-normal">(comma-separated)</span></Label>
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
            <div key={field.id} className="border border-outline-variant/20 bg-surface-container-low rounded-xl p-4 relative">
              <button
                type="button"
                onClick={() => removeExp(i)}
                className="absolute top-3 right-3 text-xs text-error hover:opacity-80"
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
                  <Label>End Year <span className="text-outline font-normal">(leave blank if current)</span></Label>
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
            className="text-sm text-primary hover:text-primary-container font-medium"
          >
            + Add experience
          </button>
        </div>
      </FormSection>

      {/* Projects */}
      <FormSection title="Projects">
        <div className="space-y-4">
          {projFields.map((field, i) => (
            <div key={field.id} className="border border-outline-variant/20 bg-surface-container-low rounded-xl p-4 relative">
              <button
                type="button"
                onClick={() => removeProj(i)}
                className="absolute top-3 right-3 text-xs text-error hover:opacity-80"
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
            className="text-sm text-primary hover:text-primary-container font-medium"
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
          className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-sm border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
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
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-ambient-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-on-surface">{title}</h2>
        <button onClick={onEdit} className="text-xs text-primary hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-ambient-sm">
      <h2 className="font-semibold text-on-surface mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2 px-1 border-b border-outline-variant/10">
      <span className="text-on-surface-variant text-sm shrink-0 mr-4">{label}</span>
      <span className="text-on-surface text-sm font-medium text-right break-all">{value}</span>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm font-semibold text-on-surface mb-1.5">{children}</label>;
}

function Err({ children }) {
  return <p className="text-xs text-error mt-1.5">{children}</p>;
}

function input() {
  return "w-full rounded-xl bg-surface-container-low border border-outline-variant/30 px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary";
}

ProfileView.propTypes = {
  profile: PropTypes.shape({
    bio: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    years_of_experience: PropTypes.number,
    resume_url: PropTypes.string,
    linkedin_url: PropTypes.string,
    github_url: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string,
        company: PropTypes.string,
        start_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        end_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
      })
    ),
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

ProfileEditForm.propTypes = {
  profile: PropTypes.shape({
    bio: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    resume_url: PropTypes.string,
    linkedin_url: PropTypes.string,
    github_url: PropTypes.string,
    years_of_experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(PropTypes.object),
    projects: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
};

InfoRow.defaultProps = {
  value: null,
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
};

Err.propTypes = {
  children: PropTypes.node.isRequired,
};
