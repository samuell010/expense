import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "icon" | "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary", // default to 'primary'
  size = "medium",
  children,
  className,
  ...props
}) => {
  const baseClasses =
    "rounded focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      " text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:text-gray-900",
  };

  const sizeClasses = {
    icon: "p-2",
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  // Adds a fallback in the component itself, so it defaults to a valid style if variant or size is undefined.
  const variantClass = variantClasses[variant] || variantClasses["primary"]; // Fallback to 'primary'
  const sizeClass = sizeClasses[size] || sizeClasses["medium"]; // Fallback to 'medium'

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
