import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  // Check the current theme when component mounts
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Update DOM directly
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    // For debugging
    console.log(`Theme changed to: ${newIsDark ? 'dark' : 'light'}, resolved as: ${newIsDark ? 'dark' : 'light'}`);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="w-full text-left justify-start px-4 py-2 rounded-md transition-colors flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  );
}