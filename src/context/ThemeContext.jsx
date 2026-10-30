import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("cv_theme") || "system",
  );

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t) => {
      root.classList.remove("light", "dark");
      if (t === "system") {
        const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(sys);
      } else root.classList.add(t);
    };
    applyTheme(theme);
    localStorage.setItem("cv_theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
