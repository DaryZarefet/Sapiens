import { Controller } from "react-hook-form";

export const CheckBoxInput = ({ label, name, control }: any) => {
  return (
    <Controller
      name={name}
      defaultValue={false}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <input type="checkbox" id={name} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-2" {...field} />
          <label htmlFor={name} className="text-sm font-medium">
            {label}
          </label>
        </div>
      )}
    />
  );
};
