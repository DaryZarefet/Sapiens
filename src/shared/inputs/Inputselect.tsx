interface InputselectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const Inputselect = ({ options, value, onChange }: InputselectProps) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-gray-700 border border-gray-500 rounded-xl px-2 w-full">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
