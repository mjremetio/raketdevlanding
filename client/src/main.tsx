import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";

// Determine default theme based on user preferences
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = prefersDarkMode ? "dark" : "light";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme={initialTheme} storageKey="theme">
    <App />
  </ThemeProvider>
);
