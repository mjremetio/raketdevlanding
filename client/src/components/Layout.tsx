import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Footer } from "@/sections/Footer";
import { ThemeProvider } from "./ThemeProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  // Fetch site settings
  const { settingsArray, getSetting } = useSiteSettings();
  
  // Get logo URL from settings
  const customLogo = getSetting('logo-url');
  
  // Handle dark mode toggle directly
  useEffect(() => {
    // Check for user theme preference or use system default
    const storedTheme = localStorage.getItem("theme") || "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Set initial theme
    if (storedTheme === "dark" || (storedTheme === "system" && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (storedTheme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeProvider>
      <Navbar customLogo={customLogo} />
      <main>{children}</main>
      <Footer />
      {/* Chat Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-all" 
          onClick={() => alert("Chat support feature will be implemented in the future!")}
          aria-label="Chat support"
        >
          <i className="fas fa-comment-dots text-2xl"></i>
        </button>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
