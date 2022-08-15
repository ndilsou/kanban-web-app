import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeState>({} as ThemeState);

export const ThemeContextProvider = (props: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ThemeState["theme"]>("light");
  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    if (theme == "dark") {
      document.body.classList.add("dark");
    } else if (theme === "light") {
      document.body.classList.remove("dark");
    } else {
      throw new Error(
        `invalid theme provided. expected 'light' or 'dark' got ${theme}`
      );
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }} {...props} />;
};
