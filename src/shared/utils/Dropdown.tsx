import { useState } from "react";

type items = {
  label: string;
  value: any;
};

export const Dropdown = ({ items }: { items: items[] }) => {
  const [value, setValue] = useState(items[0].value);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <select onChange={handleChange} className="px-2 py-1 bg-white ">
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
