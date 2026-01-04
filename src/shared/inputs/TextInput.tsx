import { Controller } from "react-hook-form";

export const TextInput = ({ label, name, control, type, placeholder, className }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <>
          {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
          <input
            type={type}
            placeholder={placeholder}
            className={`block w-full  shadow-sm focus:border-primary focus:ring-primary sm:text-sm  ${className}`}
            {...field}
          />
        </>
      )}
    />
  );
};
