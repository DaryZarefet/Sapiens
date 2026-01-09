import { useId, useState } from "react";

type Props = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: number;
  activeBgClass?: string;
  inactiveBgClass?: string;
  activeDotClass?: string;
  inactiveDotClass?: string;
  disabled?: boolean;
  className?: string;
};

export const CheckButton = ({
  checked,
  defaultChecked = false,
  onChange,
  size = 48,
  activeBgClass = "bg-blue-600",
  inactiveBgClass = "bg-gray-200",
  activeDotClass = "bg-white",
  inactiveDotClass = "bg-gray-400",
  disabled = false,
  className = "",
}: Props) => {
  const uid = useId();
  const [internal, setInternal] = useState<boolean>(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked! : internal;

  const width = size;
  const height = Math.round(size * 0.6);
  const dotSize = Math.round(height * 0.65);

  function handleChange(e?: React.ChangeEvent<HTMLInputElement>) {
    const next = e ? e.target.checked : !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <label htmlFor={uid} className={`inline-flex items-center gap-3 select-none ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      <input
        id={uid}
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        disabled={disabled}
        aria-checked={isChecked}
      />

      <span
        role="presentation"
        style={{ width, height }}
        className={`relative inline-flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out 
          ${inactiveBgClass} peer-checked:${activeBgClass}`}
      >
        <span
          style={{ width: dotSize, height: dotSize }}
          className={`rounded-full transition-colors duration-200 ease-in-out
            ${inactiveDotClass} peer-checked:${activeDotClass}`}
        />
      </span>
    </label>
  );
};
