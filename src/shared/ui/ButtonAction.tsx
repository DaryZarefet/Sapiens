interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type: "submit" | "button" | "reset";
  color?: "primary" | "danger";
  onClick?: () => void;
}

export const ButtonAction = ({ children, className, type = "button", color = "primary", onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-white ${color === "primary" ? "bg-blue-500" : color === "danger" ? "bg-red-500" : ""} ${className}`}
    >
      {children}
    </button>
  );
};
