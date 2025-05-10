import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// Auth is not needed in this hook

export interface SiteSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  category: string;
  updatedAt: string;
  updatedBy: number;
}

// Default settings values
export const DEFAULT_SETTINGS = {
  "font-family": "font-sans",
  "heading-font-family": "font-sans", 
  "primary-color": "#1e3a8a", // Navy blue
  "accent-color": "#0ea5e9", // Teal blue
  "background-color": "#ffffff",
  "text-color": "#1f2937",
  "logo-url": "/logo.svg", // Default logo path
  "custom-css": ""
};

// Font options
export const FONT_FAMILY_OPTIONS = [
  { value: "font-sans", label: "Sans Serif (Default)" },
  { value: "font-serif", label: "Serif" },
  { value: "font-mono", label: "Monospace" },
  { value: "font-poppins", label: "Poppins" },
  { value: "font-roboto", label: "Roboto" },
  { value: "font-opensans", label: "Open Sans" }
];

// Color options for quick selection
export const COLOR_OPTIONS = [
  { value: "#1e3a8a", label: "Navy Blue" },
  { value: "#0ea5e9", label: "Teal Blue" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#10b981", label: "Green" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#ef4444", label: "Red" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#f1f5f9", label: "Gray Light" },
  { value: "#1f2937", label: "Gray Dark" },
  { value: "#111827", label: "Dark" },
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#94a3b8", label: "Slate" },
  { value: "#cbd5e1", label: "Light Gray" }
];

// Setting categories
export const SETTING_CATEGORIES = {
  FONTS: "fonts",
  COLORS: "colors",
  LOGO: "logo",
  APPEARANCE: "appearance"
};

/**
 * Hook for fetching all site settings
 */
export function useSiteSettings() {
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Function to get a setting by key, with fallback to defaults
  const getSetting = (key: string): string => {
    const setting = settings.find(s => s.settingKey === key);
    return setting ? setting.settingValue : DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] || "";
  };

  return {
    settings: settings.reduce((acc, setting) => {
      acc[setting.settingKey] = setting.settingValue;
      return acc;
    }, {} as Record<string, string>),
    settingsArray: settings,
    getSetting,
    isLoading
  };
}

/**
 * Hook for fetching site settings by category
 */
export function useSiteSettingsByCategory(category: string) {
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings/category", category],
  });

  return {
    settings,
    isLoading
  };
}

/**
 * Hook for updating a site setting
 */
export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      apiRequest("PUT", `/api/site-settings/${key}`, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  return {
    updateSetting: (key: string, value: string) => mutation.mutate({ key, value }),
    isUpdating: mutation.isPending
  };
}

/**
 * Hook for creating a new site setting
 */
export function useCreateSiteSetting() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ key, value, category }: { key: string; value: string; category: string }) => 
      apiRequest("POST", "/api/site-settings", { 
        settingKey: key, 
        settingValue: value, 
        category 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
    }
  });

  return {
    createSetting: (key: string, value: string, category: string) => 
      mutation.mutate({ key, value, category }),
    isCreating: mutation.isPending
  };
}