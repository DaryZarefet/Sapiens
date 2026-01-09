interface InputProps {
  className?: string;
  type?: "text" | "email" | "password" | "search";
  placeholder?: string;
}

export const Input = ({ className = "", type = "text", placeholder = "" }: InputProps) => {
  return <input type={type} placeholder={placeholder} className={`${className}`} />;
};
