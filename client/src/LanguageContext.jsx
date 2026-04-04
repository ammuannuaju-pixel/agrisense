import { createContext, useContext, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const t = (key) => translations[language][key] || key;
  const toggleLanguage = () => setLanguage(prev => prev === "en" ? "ml" : "en");

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}