import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit3 } from 'lucide-react';

// Import icon libraries
import * as LucideIcons from 'lucide-react';
import { IconBaseProps } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import * as IoIcons5 from 'react-icons/io5';
import * as RiIcons from 'react-icons/ri';
import * as TiIcons from 'react-icons/ti';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';
import * as HiIcons from 'react-icons/hi';
import * as SiIcons from 'react-icons/si';

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

// Helper to render dynamic icons
const DynamicIcon = ({ icon, ...props }: { icon: string } & IconBaseProps) => {
  // Parse library and icon name
  const [library, iconName] = icon.includes(':') 
    ? icon.split(':') 
    : ['lucide', icon]; // Default to Lucide if no prefix
  
  // Select the icon library
  const iconLibrary = {
    lucide: LucideIcons,
    fa: FaIcons,
    fi: FiIcons,
    ai: AiIcons,
    bi: BiIcons,
    bs: BsIcons,
    io: IoIcons,
    io5: IoIcons5,
    ri: RiIcons,
    ti: TiIcons,
    md: MdIcons,
    gi: GiIcons,
    hi: HiIcons,
    si: SiIcons,
  }[library.toLowerCase()] || LucideIcons;
  
  // Get the icon component
  // @ts-ignore
  const IconComponent = iconLibrary[iconName] || LucideIcons.HelpCircle;
  
  return <IconComponent {...props} />;
};

// Organize icons by category for better UX
interface IconCategory {
  name: string;
  prefix: string;
  icons: { name: string; component: React.FC<IconBaseProps> }[];
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [manualInput, setManualInput] = useState(selectedIcon);
  
  // Update manual input when the selected icon changes
  useEffect(() => {
    setManualInput(selectedIcon);
  }, [selectedIcon]);
  
  // Popular Lucide icons for quick selection
  const popularLucideIcons = [
    'Activity', 'AlertCircle', 'Archive', 'Award', 'Bell', 'BookOpen', 
    'Calendar', 'Check', 'ChevronDown', 'ChevronRight', 'ChevronUp', 
    'Clock', 'Code', 'Coffee', 'Copy', 'CreditCard', 'Database', 'Download', 
    'Edit', 'Eye', 'Facebook', 'File', 'FileText', 'Film', 'Filter', 
    'Flag', 'Folder', 'Gift', 'Github', 'Globe', 'Heart', 'Home', 
    'Image', 'Info', 'Instagram', 'Layers', 'Layout', 'Link', 'List', 
    'Lock', 'Mail', 'Map', 'MapPin', 'Menu', 'MessageCircle', 'MessageSquare', 
    'Mic', 'Moon', 'Music', 'Package', 'Paperclip', 'Phone', 'PieChart', 
    'Play', 'Plus', 'PlusCircle', 'Power', 'RefreshCw', 'Save', 'Search', 
    'Send', 'Server', 'Settings', 'Share', 'Shield', 'ShoppingBag', 
    'ShoppingCart', 'Shuffle', 'Smartphone', 'Star', 'Sun', 'Tag', 
    'Terminal', 'ThumbsUp', 'Trash', 'Trello', 'TrendingUp', 'Twitter', 
    'Upload', 'User', 'Users', 'Video', 'Wifi', 'Youtube', 'ZoomIn'
  ].map(name => ({
    name,
    // @ts-ignore
    component: LucideIcons[name] || LucideIcons.HelpCircle
  }));
  
  // Handle manual icon input
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };
  
  const handleManualInputApply = () => {
    onSelectIcon(manualInput);
  };
  
  // Filter icons based on search
  const filteredIcons = search
    ? popularLucideIcons.filter(icon => 
        icon.name.toLowerCase().includes(search.toLowerCase())
      )
    : popularLucideIcons;
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-grow">
          <Input
            value={manualInput}
            onChange={handleManualInputChange}
            placeholder="Icon name (e.g. 'lucide:Code' or 'fa:FaReact')"
            onBlur={handleManualInputApply}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleManualInputApply();
              }
            }}
          />
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Select an Icon</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
              />
              
              <div className="mt-2">
                <Label>Popular Icons</Label>
                <ScrollArea className="h-[400px] mt-2 border rounded-md p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {filteredIcons.map((icon) => (
                      <Card 
                        key={icon.name}
                        className={cn(
                          "cursor-pointer hover:bg-primary/10 transition-colors",
                          manualInput === icon.name && "bg-primary/20"
                        )}
                        onClick={() => {
                          onSelectIcon(icon.name);
                          setManualInput(icon.name);
                          setIsOpen(false);
                        }}
                      >
                        <CardContent className="p-2 flex flex-col items-center justify-center">
                          <icon.component className="h-6 w-6" />
                          <p className="text-[10px] mt-1 text-center truncate w-full">
                            {icon.name}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="mt-4">
                <Label>Alternative Icon Libraries</Label>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>You can use icons from these libraries by prefixing the icon name:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Lucide Icons: <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">lucide:IconName</code></li>
                    <li>Font Awesome: <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">fa:FaIconName</code></li>
                    <li>Material Design: <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">md:MdIconName</code></li>
                    <li>Simple Icons: <code className="text-xs bg-primary/10 px-1 py-0.5 rounded">si:SiIconName</code></li>
                    <li>And many more: fi, ai, bi, bs, io, io5, ri, ti, gi, hi</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Preview */}
      <div className="h-16 w-full border rounded-md flex items-center justify-center bg-background">
        <DynamicIcon icon={manualInput} className="h-8 w-8" />
      </div>
    </div>
  );
}