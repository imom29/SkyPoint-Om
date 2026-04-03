import PropTypes from "prop-types";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-error-container/40 rounded-lg p-4 flex items-start gap-3 border border-error/10">
      <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0">error</span>
      <p className="text-on-error-container text-sm font-medium">{message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
};
