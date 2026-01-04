import { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

export const PasswordInput = ({ label, name, control, placeholder, className }: any) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <div>
          {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              placeholder={placeholder}
              className={` w-full  shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${className}`}
              {...field}
            />
            <button type="button" onClick={toggleVisible} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500">
              {visible ? <Eye /> : <EyeClosed />}
            </button>
          </div>
        </div>
      )}
    />
  );
};
