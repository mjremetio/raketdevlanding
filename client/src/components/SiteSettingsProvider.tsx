import { useEffect } from "react";
import { useSiteSettings, DEFAULT_SETTINGS } from "@/hooks/useSiteSettings";

/**
 * Component that applies site settings to the website
 * This will be mounted at the root of the application
 */
export function SiteSettingsProvider() {
  const { settings, getSetting, isLoading } = useSiteSettings();

  // Apply settings whenever they change
  useEffect(() => {
    if (isLoading) return;

    // Apply color variables to CSS
    const colors = [
      "primary-color",
      "accent-color",
      "background-color",
      "text-color"
    ];

    colors.forEach(colorKey => {
      const colorValue = getSetting(colorKey);
      if (colorValue) {
        document.documentElement.style.setProperty(`--${colorKey}`, colorValue);
      }
    });

    // Apply font family
    const fontFamily = getSetting("font-family");
    if (fontFamily) {
      document.body.className = document.body.className
        .replace(/font-(sans|serif|mono|poppins|roboto|opensans)/g, '')
        .trim();
      document.body.classList.add(fontFamily);
    }

    // Apply heading font family
    const headingFontFamily = getSetting("heading-font-family");
    if (headingFontFamily) {
      // Add a class to the html element for headings
      document.documentElement.className = document.documentElement.className
        .replace(/heading-font-(sans|serif|mono|poppins|roboto|opensans)/g, '')
        .trim();
      document.documentElement.classList.add(`heading-${headingFontFamily}`);
    }

    // Apply custom CSS
    const customCss = getSetting("custom-css");
    if (customCss) {
      let styleElement = document.getElementById('custom-css-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-css-styles';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = customCss;
    }

    // Set default styles on first load
    if (!document.body.classList.contains('font-sans') && 
        !document.body.classList.contains('font-serif') && 
        !document.body.classList.contains('font-mono')) {
      document.body.classList.add(DEFAULT_SETTINGS["font-family"]);
    }
  }, [settings, getSetting, isLoading]);

  // This component doesn't render anything
  return null;
}