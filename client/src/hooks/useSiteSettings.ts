import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface SiteSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  category: string;
  updatedAt: string;
  updatedBy: number;
}

export const FONT_FAMILY_OPTIONS = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
  { label: 'Poppins', value: 'font-poppins' },
  { label: 'Roboto', value: 'font-roboto' },
  { label: 'Open Sans', value: 'font-opensans' },
];

export const COLOR_OPTIONS = [
  { label: 'Navy', value: '#0A2463' },
  { label: 'Royal Blue', value: '#3E92CC' },
  { label: 'Teal', value: '#2EC4B6' },
  { label: 'Green', value: '#57A773' },
  { label: 'Purple', value: '#7768AE' },
  { label: 'Red', value: '#D64550' },
  { label: 'Orange', value: '#FF8C42' },
  { label: 'Yellow', value: '#FFD166' },
  { label: 'Turquoise', value: '#00B295' },
  { label: 'Pink', value: '#FF6F91' },
  { label: 'Gray', value: '#4A4E69' },
];

// Categories of settings
export const SETTING_CATEGORIES = {
  APPEARANCE: 'appearance',
  FONTS: 'fonts',
  COLORS: 'colors',
  LOGO: 'logo',
};

// Default values to use when settings are not defined
export const DEFAULT_SETTINGS = {
  'primary-color': '#0A2463',
  'accent-color': '#2EC4B6',
  'background-color': '#FFFFFF',
  'text-color': '#333333',
  'font-family': 'font-sans',
  'heading-font-family': 'font-sans',
  'logo-url': '/logo.png',
  'custom-css': '',
};

// Hook to get all site settings
export function useSiteSettings() {
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Convert settings array to an object for easier access
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.settingKey] = setting.settingValue;
    return acc;
  }, {} as Record<string, string>);

  // Function to get a setting with fallback to default
  const getSetting = (key: string): string => {
    return settingsObject[key] || DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] || '';
  };

  return {
    settings: settingsObject,
    getSetting,
    isLoading,
    allSettings: settings,
  };
}

// Hook to get settings by category
export function useSiteSettingsByCategory(category: string) {
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings/category', category],
    staleTime: 5 * 60 * 1000,
  });

  return {
    settings,
    isLoading,
  };
}

// Hook to update a setting
export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return await apiRequest('PUT', `/api/site-settings/${key}`, { settingValue: value });
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/site-settings/category'] 
      });
      
      toast({
        title: 'Setting Updated',
        description: `Successfully updated ${variables.key}`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating setting:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the setting',
        variant: 'destructive',
      });
    }
  });

  const updateSetting = (key: string, value: string) => {
    if (!user?.isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can update site settings',
        variant: 'destructive',
      });
      return;
    }
    
    mutation.mutate({ key, value });
  };

  return {
    updateSetting,
    isUpdating: mutation.isPending,
  };
}

// Hook to create a new setting
export function useCreateSiteSetting() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (setting: { settingKey: string; settingValue: string; category: string }) => {
      return await apiRequest('POST', '/api/site-settings', setting);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      
      toast({
        title: 'Setting Created',
        description: 'Successfully created new setting',
      });
    },
    onError: (error: any) => {
      console.error('Error creating setting:', error);
      
      let message = 'There was an error creating the setting';
      if (error.message?.includes('409')) {
        message = 'A setting with this key already exists';
      }
      
      toast({
        title: 'Creation Failed',
        description: message,
        variant: 'destructive',
      });
    }
  });

  const createSetting = (settingKey: string, settingValue: string, category: string) => {
    if (!user?.isAdmin) {
      toast({
        title: 'Permission Denied',
        description: 'Only administrators can create site settings',
        variant: 'destructive',
      });
      return;
    }
    
    mutation.mutate({ settingKey, settingValue, category });
  };

  return {
    createSetting,
    isCreating: mutation.isPending,
  };
}