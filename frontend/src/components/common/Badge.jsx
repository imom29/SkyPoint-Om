import PropTypes from "prop-types";

const VARIANTS = {
  // job types
  full_time: "bg-secondary-container text-primary",
  part_time: "bg-secondary-container text-primary",
  contract: "bg-secondary-container text-primary",
  // application statuses
  pending: "bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant",
  accepted: "bg-tertiary-fixed-dim/40 text-on-tertiary-fixed-variant",
  rejected: "bg-error-container/40 text-error",
};

export default function Badge({ value, label }) {
  const cls = VARIANTS[value] || "bg-surface-container-high text-on-surface-variant";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${cls}`}>
      {label || value}
    </span>
  );
}

Badge.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
};
