import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light"; // Always resolved to either dark or light
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  // Initial theme from localStorage or default
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        const savedTheme = localStorage.getItem(storageKey);
        return (savedTheme as Theme) || defaultTheme;
      } catch {
        return defaultTheme;
      }
    }
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  // Media query for system theme preference
  const prefersDarkMQ = window.matchMedia("(prefers-color-scheme: dark)");

  // Function to resolve the actual theme
  const resolveTheme = (themeSetting: Theme): "dark" | "light" => {
    if (themeSetting === "system") {
      return prefersDarkMQ.matches ? "dark" : "light";
    }
    return themeSetting;
  };

  // Update the resolved theme when system preference changes
  useEffect(() => {
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = prefersDarkMQ.matches ? "dark" : "light";
        setResolvedTheme(newResolvedTheme);
        
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newResolvedTheme);
      }
    };

    prefersDarkMQ.addEventListener("change", handleChange);
    return () => prefersDarkMQ.removeEventListener("change", handleChange);
  }, [theme, prefersDarkMQ]);

  // Set initial resolved theme on component mount
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme));
  }, []);

  // Apply theme class to html element whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    const newResolvedTheme = resolveTheme(theme);
    setResolvedTheme(newResolvedTheme);
    root.classList.add(newResolvedTheme);

    // For debugging
    console.log(`Theme changed to: ${theme}, resolved as: ${newResolvedTheme}`);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // If localStorage is not available, just continue
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
