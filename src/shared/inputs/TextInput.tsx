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
            <label className="block text-sm font-medium text-primary-700 mb-1">
              {label}
            </label>
          )}
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`block w-full px-4 py-2.5 border rounded-xl sm:text-sm transition-all outline-none bg-surface border-default shadow-sm ${
              error
                ? "!border-red-500 !ring-4 !ring-red-500/20 !shadow-md !bg-red-50/10"
                : "hover:border-primary-300 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-md"
            } ${className}`}
          />
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
