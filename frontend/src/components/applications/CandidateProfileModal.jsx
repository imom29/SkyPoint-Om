import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getCandidateProfile } from "../../api/profileApi";
import LoadingSpinner from "../common/LoadingSpinner";

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function CandidateProfileModal({ candidate, onClose }) {
  const [profile, setProfile] = useState(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    getCandidateProfile(candidate.id)
      .then(setProfile)
      .catch(() => setError("Failed to load profile."));
  }, [candidate.id]);

  const yearsLabel = profile?.years_of_experience == null
    ? null
    : `${profile.years_of_experience}+ Years`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close profile modal"
        className="absolute inset-0"
      />
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-slide-in relative z-10">

        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {getInitials(candidate.full_name)}
              </div>
              <div>
                <h2 className="font-bold text-on-surface">{candidate.full_name}</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{candidate.email}</p>
                {profile?.skills?.slice(0, 2).map((tag) => (
                  <span key={tag} className="inline-block mr-1 mt-1 text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-primary px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-outline hover:text-on-surface-variant transition-colors p-1 rounded-lg hover:bg-surface-container-low mt-0.5"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {error && <p className="text-sm text-error">{error}</p>}
          {profile === undefined && !error && <LoadingSpinner />}
          {profile === null && !error && (
            <div className="text-center py-12 text-on-surface-variant text-sm">
              This candidate hasn&apos;t built a profile yet.
            </div>
          )}

          {profile && (
            <>
              {/* Professional Summary */}
              {profile.bio && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Professional Summary</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {profile.location && (
                  <div className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Location</p>
                    <p className="text-sm font-semibold text-on-surface">{profile.location}</p>
                  </div>
                )}
                {yearsLabel && (
                  <div className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Experience</p>
                    <p className="text-sm font-semibold text-on-surface">{yearsLabel}</p>
                  </div>
                )}
                {profile.resume_url && (
                  <div className="bg-surface-container-low rounded-xl p-3 col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Resume</p>
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium break-all">
                      {profile.resume_url.split("/").pop() || "View Resume"}
                    </a>
                  </div>
                )}
              </div>

              {/* Core Competencies */}
              {profile.skills?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Core Competencies</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span
                        key={`${s}-${i}`}
                        className="bg-surface-container-low border border-outline-variant/20 text-on-surface text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Timeline */}
              {profile.experience?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Career Timeline</p>
                  <div className="space-y-4">
                    {profile.experience.map((exp, i) => (
                      <div key={`${exp.company}-${exp.role}-${i}`} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 ${i === 0 ? "border-primary bg-primary" : "border-outline-variant bg-surface-container-lowest"}`} />
                          {i < profile.experience.length - 1 && (
                            <div className="w-0.5 bg-outline-variant/30 flex-1 my-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-on-surface text-sm">{exp.role}</p>
                            {i === 0 && (
                              <span className="text-[10px] font-bold uppercase bg-tertiary-fixed-dim/60 text-on-tertiary-fixed-variant px-2 py-0.5 rounded-full">Present</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-medium">{exp.company}</span>
                          <p className="text-xs text-outline mt-0.5">
                            {exp.start_year} — {exp.end_year ?? "Present"}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-outline-variant/20 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

CandidateProfileModal.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};



