const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-red-700",
    outline:
      "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default Button;
