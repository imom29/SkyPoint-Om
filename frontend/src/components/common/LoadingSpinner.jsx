import PropTypes from "prop-types";

export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <div className="w-8 h-8 border-4 border-primary-fixed-dim border-t-primary rounded-full animate-spin" />
    </div>
  );
}

LoadingSpinner.propTypes = {
  className: PropTypes.string,
};
