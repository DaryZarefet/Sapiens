import { useAuthContext } from "@/context/AuthContext";

interface ButtonProps {
  children: React.ReactNode;
  path: string;
  className?: string;
}

export const Buttonav = ({ children, path, className }: ButtonProps) => {
  const { clearError } = useAuthContext();

  const handleClick = () => {
    clearError();
    window.location.href = path;
  };

  return (
    <button
      type="button"
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
