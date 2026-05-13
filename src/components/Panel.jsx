import PropTypes from "prop-types";

export default function Panel({ children, className = "" }) {
  return (
    <div
      style={{ backdropFilter: "blur(28px)" }}
      className={`bg-white/[0.06] border border-white/[0.11] rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

Panel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
