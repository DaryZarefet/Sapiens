import { Sun, Moon } from "lucide-react";

export const ToggleTheme = () => {
  const handleToggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return <button onClick={handleToggleTheme}>{document.documentElement.classList.contains("dark") ? <Sun size={24} /> : <Moon size={24} />}</button>;
};

export const handleToggleTheme = () => {
  const isDark = document.documentElement.classList.contains("dark");

  if (isDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};
