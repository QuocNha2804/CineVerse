const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  />
);
export default Input;
