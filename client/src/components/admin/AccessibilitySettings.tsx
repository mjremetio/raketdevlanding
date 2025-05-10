import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { HexColorPicker } from "react-colorful";
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting, DEFAULT_SETTINGS, FONT_FAMILY_OPTIONS, COLOR_OPTIONS, SETTING_CATEGORIES } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { UploadCloud, Save, Palette, Type, Box, Image, Sliders, Check } from "lucide-react";

export function AccessibilitySettings() {
  const { settings, getSetting, isLoading } = useSiteSettings();
  const { updateSetting, isUpdating } = useUpdateSiteSetting();
  const { createSetting, isCreating } = useCreateSiteSetting();
  
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [colorPickerValues, setColorPickerValues] = useState<Record<string, string>>({
    'primary-color': getSetting('primary-color'),
    'accent-color': getSetting('accent-color'),
    'background-color': getSetting('background-color'),
    'text-color': getSetting('text-color'),
  });
  const [logoUrl, setLogoUrl] = useState(getSetting('logo-url'));
  const [fontFamily, setFontFamily] = useState(getSetting('font-family'));
  const [headingFontFamily, setHeadingFontFamily] = useState(getSetting('heading-font-family'));
  const [customCss, setCustomCss] = useState(getSetting('custom-css'));
  
  const handleColorChange = (color: string) => {
    if (activeColor) {
      setColorPickerValues(prev => ({ ...prev, [activeColor]: color }));
    }
  };

  const handleSaveColor = (key: string) => {
    const colorValue = colorPickerValues[key];
    if (settings[key]) {
      updateSetting(key, colorValue);
    } else {
      createSetting(key, colorValue, SETTING_CATEGORIES.COLORS);
    }
    setActiveColor(null);
    
    // Apply the color immediately
    document.documentElement.style.setProperty(`--${key}`, colorValue);
  };

  const handleSaveFontFamily = () => {
    if (settings['font-family']) {
      updateSetting('font-family', fontFamily);
    } else {
      createSetting('font-family', fontFamily, SETTING_CATEGORIES.FONTS);
    }
    
    if (settings['heading-font-family']) {
      updateSetting('heading-font-family', headingFontFamily);
    } else {
      createSetting('heading-font-family', headingFontFamily, SETTING_CATEGORIES.FONTS);
    }
    
    toast({
      title: "Fonts Updated",
      description: "Font settings have been saved successfully",
    });
    
    // Apply font changes immediately
    document.body.className = document.body.className
      .replace(/font-(sans|serif|mono|poppins|roboto|opensans)/g, '')
      .trim();
    document.body.classList.add(fontFamily);
  };

  const handleSaveLogo = () => {
    if (settings['logo-url']) {
      updateSetting('logo-url', logoUrl);
    } else {
      createSetting('logo-url', logoUrl, SETTING_CATEGORIES.LOGO);
    }
    
    toast({
      title: "Logo Updated",
      description: "Logo URL has been saved successfully",
    });
  };

  const handleSaveCustomCss = () => {
    if (settings['custom-css']) {
      updateSetting('custom-css', customCss);
    } else {
      createSetting('custom-css', customCss, SETTING_CATEGORIES.APPEARANCE);
    }
    
    toast({
      title: "Custom CSS Updated",
      description: "Custom CSS has been saved successfully",
    });
    
    // Apply custom CSS
    let styleElement = document.getElementById('custom-css-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-css-styles';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = customCss;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Accessibility Settings</h2>
      </div>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="fonts" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Fonts
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the colors used throughout the website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(colorPickerValues).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="capitalize flex justify-between">
                        <span>{key.replace(/-/g, ' ')}</span>
                        <span className="text-xs text-muted-foreground">{value}</span>
                      </Label>
                      <div 
                        className="h-10 rounded-md border flex items-center cursor-pointer relative overflow-hidden"
                        onClick={() => setActiveColor(key === activeColor ? null : key)}
                      >
                        <div 
                          className="h-full w-full absolute"
                          style={{ backgroundColor: value }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className={`text-sm font-medium ${key === 'background-color' ? 'text-gray-700' : 'text-white'}`}>
                            {key === activeColor ? 'Click to close' : 'Click to edit'}
                          </span>
                          {key === activeColor && (
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveColor(key);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {activeColor === key && (
                        <div className="mt-2 p-3 border rounded-md bg-background">
                          <HexColorPicker 
                            color={value} 
                            onChange={handleColorChange} 
                            style={{ width: '100%' }}
                          />
                          <div className="mt-3 flex gap-2">
                            <Input 
                              type="text" 
                              value={value}
                              onChange={(e) => {
                                setColorPickerValues(prev => ({ ...prev, [key]: e.target.value }));
                              }}
                              className="flex-1"
                            />
                            <Button 
                              onClick={() => handleSaveColor(key)}
                              disabled={isUpdating || isCreating}
                              className="flex items-center gap-1"
                            >
                              {(isUpdating || isCreating) ? <Spinner className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                              Save
                            </Button>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-5 gap-1">
                            {COLOR_OPTIONS.map((option) => (
                              <div
                                key={option.value}
                                className="h-6 w-full rounded-sm cursor-pointer border"
                                style={{ backgroundColor: option.value }}
                                title={option.label}
                                onClick={() => {
                                  setColorPickerValues(prev => ({ ...prev, [key]: option.value }));
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-md text-center"
                    style={{ backgroundColor: colorPickerValues['primary-color'] }}
                  >
                    <span className="text-white font-medium">Primary Color</span>
                  </div>
                  
                  <div 
                    className="p-4 rounded-md text-center"
                    style={{ backgroundColor: colorPickerValues['accent-color'] }}
                  >
                    <span className="text-white font-medium">Accent Color</span>
                  </div>
                  
                  <div 
                    className="p-4 rounded-md text-center border"
                    style={{ 
                      backgroundColor: colorPickerValues['background-color'],
                      color: colorPickerValues['text-color']
                    }}
                  >
                    <span className="font-medium">Background with Text Color</span>
                  </div>
                  
                  <div className="p-4 rounded-md text-center border flex items-center justify-center">
                    <div 
                      className="px-3 py-1 rounded text-white"
                      style={{ backgroundColor: colorPickerValues['primary-color'] }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-3 py-1 rounded text-white ml-2"
                      style={{ backgroundColor: colorPickerValues['accent-color'] }}
                    >
                      Accent Button
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Fonts Tab */}
        <TabsContent value="fonts">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Customize the fonts used throughout the website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Main Font Family</Label>
                  <Select 
                    value={fontFamily} 
                    onValueChange={setFontFamily}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILY_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heading-font-family">Heading Font Family</Label>
                  <Select 
                    value={headingFontFamily} 
                    onValueChange={setHeadingFontFamily}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heading font family" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILY_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleSaveFontFamily}
                  disabled={isUpdating || isCreating}
                  className="w-full md:w-auto mt-4"
                >
                  {(isUpdating || isCreating) ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Font Settings
                </Button>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="space-y-4 p-4 border rounded-md">
                    <div>
                      <h1 className={`text-2xl font-bold ${headingFontFamily}`}>Heading Font Example</h1>
                      <h2 className={`text-xl font-semibold ${headingFontFamily}`}>Subheading Example</h2>
                    </div>
                    <div className={`${fontFamily}`}>
                      <p className="mb-2">
                        This is an example of the main body text. It should be easy to read and have good contrast.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tellus vitae nisl convallis tempus. 
                        Nulla facilisi. Ut at massa eu nisl lacinia facilisis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Logo Tab */}
        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>
                Change your website's logo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="logo-url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="Enter the URL for your logo image"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSaveLogo}
                      disabled={isUpdating || isCreating}
                    >
                      {(isUpdating || isCreating) ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a URL to an image file (.png, .jpg, .svg recommended). Leave empty to use the default "RaketDev" text logo.
                  </p>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Logo Preview</h3>
                  <div className="p-4 border rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="Logo Preview" 
                        className="max-h-20 max-w-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.classList.add('logo-error');
                          
                          toast({
                            title: "Logo Error",
                            description: "Could not load the logo image. Please check the URL.",
                            variant: "destructive",
                          });
                          
                          // Show text logo as fallback
                          const container = target.parentElement;
                          if (container && container.querySelector('.text-logo-fallback') === null) {
                            const textLogo = document.createElement('div');
                            textLogo.className = 'text-logo-fallback flex';
                            
                            const spanRaket = document.createElement('span');
                            spanRaket.className = 'text-foreground dark:text-white text-2xl font-bold';
                            spanRaket.textContent = 'Raket';
                            
                            const spanDev = document.createElement('span');
                            spanDev.className = 'text-accent text-2xl font-bold';
                            spanDev.textContent = 'Dev';
                            
                            textLogo.appendChild(spanRaket);
                            textLogo.appendChild(spanDev);
                            container.appendChild(textLogo);
                          }
                        }}
                      />
                    ) : (
                      <div className="text-2xl font-bold flex items-center">
                        <span className="text-foreground dark:text-white">Raket</span>
                        <span className="text-accent">Dev</span>
                        <div className="ml-4 text-sm text-muted-foreground">(Default text logo)</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>For best results:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Use an image with transparent background (PNG or SVG)</li>
                      <li>Keep file size small for faster loading</li>
                      <li>Recommended dimensions: 200px × 60px</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advanced Tab */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Add custom CSS to further customize your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <textarea
                    id="custom-css"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="Enter custom CSS rules here"
                    className="w-full h-32 p-2 border rounded-md font-mono text-sm bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Advanced: Add custom CSS rules to override styles
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveCustomCss}
                  disabled={isUpdating || isCreating}
                >
                  {(isUpdating || isCreating) ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Custom CSS
                </Button>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">CSS Tips</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Some examples of custom CSS you can add:</p>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs overflow-x-auto">
{`.hero-section {
  background-image: linear-gradient(to right, #0A2463, #3E92CC);
}

.nav-link:hover {
  color: var(--accent-color);
}

.custom-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}`}
                    </pre>
                    <p>Add CSS variables to reference your color settings:</p>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-xs overflow-x-auto">
{`--primary-color: ${colorPickerValues['primary-color']};
--accent-color: ${colorPickerValues['accent-color']};
--background-color: ${colorPickerValues['background-color']};
--text-color: ${colorPickerValues['text-color']};`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}