import { useEffect, useState } from "react";
import { getCandidateProfile } from "../../api/profileApi";
import LoadingSpinner from "../common/LoadingSpinner";

export default function CandidateProfileModal({ candidate, onClose }) {
  const [profile, setProfile] = useState(undefined); // undefined = loading, null = no profile
  const [error, setError] = useState("");

  useEffect(() => {
    getCandidateProfile(candidate.id)
      .then(setProfile)
      .catch(() => setError("Failed to load profile."));
  }, [candidate.id]);

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-lg bg-white h-full shadow-xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{candidate.full_name}</h2>
            <p className="text-sm text-gray-500">{candidate.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {error && <p className="text-sm text-red-600">{error}</p>}

          {profile === undefined && !error && <LoadingSpinner />}

          {profile === null && !error && (
            <div className="text-center py-12 text-gray-400 text-sm">
              This candidate hasn&apos;t built a profile yet.
            </div>
          )}

          {profile && (
            <>
              {/* About */}
              <Section title="About">
                {profile.bio && <p className="text-sm text-gray-700 mb-4">{profile.bio}</p>}
                <div className="space-y-0">
                  <InfoRow label="Location" value={profile.location} />
                  <InfoRow label="Phone" value={profile.phone} />
                  <InfoRow
                    label="Experience"
                    value={
                      profile.years_of_experience != null
                        ? `${profile.years_of_experience} yr${profile.years_of_experience !== 1 ? "s" : ""}`
                        : null
                    }
                  />
                  <InfoRow
                    label="Resume"
                    value={
                      profile.resume_url ? (
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {profile.resume_url}
                        </a>
                      ) : null
                    }
                  />
                  <InfoRow
                    label="LinkedIn"
                    value={
                      profile.linkedin_url ? (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {profile.linkedin_url}
                        </a>
                      ) : null
                    }
                  />
                  <InfoRow
                    label="GitHub"
                    value={
                      profile.github_url ? (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all"
                        >
                          {profile.github_url}
                        </a>
                      ) : null
                    }
                  />
                </div>

                {profile.skills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* Work Experience */}
              {profile.experience?.length > 0 && (
                <Section title="Work Experience">
                  <div className="space-y-4">
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-blue-200 pl-4">
                        <p className="font-medium text-gray-900 text-sm">{exp.role}</p>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {exp.start_year} — {exp.end_year ?? "Present"}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Projects */}
              {profile.projects?.length > 0 && (
                <Section title="Projects">
                  <div className="space-y-4">
                    {profile.projects.map((proj, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">{proj.name}</p>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Link ↗
                            </a>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 text-sm">
      <span className="text-gray-500 shrink-0 mr-4">{label}</span>
      <span className="text-gray-900 font-medium text-right break-all">{value}</span>
    </div>
  );
}
