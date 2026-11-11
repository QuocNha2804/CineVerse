import { useId } from "react";

const Input = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border ${
          error
            ? "border-red-500 focus:ring-red-500/20"
            : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/20"
        } text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
