import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

interface PasswordInputProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  className?: string;
  rules?: object;
}

export const PasswordInput = <T extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  className = "",
  rules,
}: PasswordInputProps<T>) => {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-primary-700 mb-1">
              {label}
            </label>
          )}

          <div className="relative">
            <input
              {...field}
              type={visible ? "text" : "password"}
              placeholder={placeholder}
              className={`block w-full px-4 py-2.5 pr-11 border rounded-xl sm:text-sm transition-all outline-none bg-surface border-default shadow-sm ${
                error
                  ? "!border-red-500 !ring-4 !ring-red-500/20 !shadow-md !bg-red-50/10"
                  : "hover:border-primary-300 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-md"
              } ${className}`}
            />
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              tabIndex={-1} // Para que al usar Tab el usuario no se detenga en el ojo
            >
              {visible ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold animate-in fade-in slide-in-from-top-1 px-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
