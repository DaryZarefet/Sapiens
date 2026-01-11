import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface TextInputProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  type?: string;
  placeholder?: string;
  className?: string;
  rules?: object;
}

export const TextInput = <T extends FieldValues>({
  label,
  name,
  control,
  type = "text",
  placeholder,
  className = "",
  rules,
}: TextInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
          )}
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`block w-full px-3 py-2 border rounded-md sm:text-sm transition-all outline-none ${
              error
                ? "!border-red-500 !ring-2 !ring-red-500/40 !shadow-[0_0_8px_rgba(239,68,68,0.2)] !bg-red-50/20"
                : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/40 focus:shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]"
            } ${className}`}
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-600 font-semibold animate-in fade-in slide-in-from-top-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
