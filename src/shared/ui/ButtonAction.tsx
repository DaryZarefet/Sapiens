interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type: "submit" | "button" | "reset";
  color?: "primary" | "danger";
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonAction = ({
  children,
  className,
  type = "button",
  color = "primary",
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer text-white ${
        color === "primary"
          ? "bg-blue-500"
          : color === "danger"
          ? "bg-red-500"
          : ""
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </button>
  );
};
