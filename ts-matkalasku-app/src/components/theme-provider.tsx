import { createContext, useContext, useEffect, useState } from "react";

// Type Definitions
type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial State
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Creating the Context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// ThemeProvider Component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // State Management
  // It first tries to load the theme from localStorage using storageKey. If nothing is found, it falls back to the defaultTheme
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  // Effect to Apply the Theme
  // useEffect: Runs every time the theme state changes.
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    // The systemTheme is determined by checking the user's system preferences
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      // After determining systemTheme, the appropriate class ("light" or "dark") is added to the root element (<html>)
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  // Setting the Theme
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  // Providing the Theme Context
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom Hook -'useTheme'
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
