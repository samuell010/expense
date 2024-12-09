import { useState } from "react";
import { Moon, Sun } from "lucide-react";
// npm install lucide-react
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // Applied the group utility

  return (
    <button
      className="relative w-9 rounded-full p-2 hover:bg-blue-dark-900 dark:hover:bg-gray-light-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleTheme}
    >
      {theme === "dark" && !isHovered && (
        <Moon className="h-[1.2rem] w-[1.2rem] fill-current text-gray-light-100 transition-all" />
      )}
      {theme === "light" && !isHovered && (
        <Sun className="h-[1.2rem] w-[1.2rem] text-gray-800 transition-all" />
      )}
      {theme === "dark" && isHovered && (
        <Sun className="h-[1.2rem] w-[1.2rem] text-gray-800 transition-all" />
      )}
      {theme === "light" && isHovered && (
        <Moon className="h-[1.2rem] w-[1.2rem] fill-current text-gray-light-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
