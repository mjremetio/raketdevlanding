import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { EditableJsonField } from './EditableJsonField';
import { Section } from '@/hooks/useWebsiteContent';
import { toast } from '@/hooks/use-toast';
import { Spinner } from "@/components/ui/spinner";
import { Check, Info } from 'lucide-react';

interface NewSectionEditorProps {
  onClose: () => void;
}

export function NewSectionEditor({ onClose }: NewSectionEditorProps) {
  const queryClient = useQueryClient();
  const [newSection, setNewSection] = useState<{
    sectionId: string;
    title: string;
    subtitle: string;
    content: any;
  }>({
    sectionId: '',
    title: '',
    subtitle: '',
    content: {
      description: '',
      layout: 'default',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      items: []
    }
  });
  
  const [errors, setErrors] = useState<{
    sectionId?: string;
    title?: string;
  }>({});
  
  const [sectionIdChanged, setSectionIdChanged] = useState(false);
  
  // Mutation for creating a new section
  const createSectionMutation = useMutation({
    mutationFn: async (sectionData: typeof newSection) => {
      return await apiRequest(
        "POST", 
        "/api/sections", 
        sectionData
      );
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      
      toast({
        title: "Section Created",
        description: `${newSection.title} section has been created successfully`,
      });
      
      onClose();
    },
    onError: (error: any) => {
      console.error("Error creating section:", error);
      
      // Extract error message if available
      let errorMessage = "There was an error creating the section";
      if (error.message?.includes("409")) {
        errorMessage = "A section with this ID already exists";
        setErrors({...errors, sectionId: errorMessage});
      }
      
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!newSection.sectionId.trim()) {
      newErrors.sectionId = "Section ID is required";
    } else if (!/^[a-z0-9-]+$/.test(newSection.sectionId)) {
      newErrors.sectionId = "Section ID must contain only lowercase letters, numbers, and hyphens";
    }
    
    if (!newSection.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      createSectionMutation.mutate(newSection);
    }
  };

  const formatSectionId = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  };

  const handleSectionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedId = formatSectionId(e.target.value);
    setNewSection({
      ...newSection,
      sectionId: formattedId
    });
    setSectionIdChanged(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewSection({
      ...newSection,
      title
    });
    
    // Auto-generate sectionId from title if not manually changed
    if (!sectionIdChanged && title) {
      setNewSection(prev => ({
        ...prev,
        sectionId: formatSectionId(title)
      }));
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSection({
      ...newSection,
      subtitle: e.target.value
    });
  };

  const handleContentChange = (content: any) => {
    setNewSection({
      ...newSection,
      content
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg text-primary">
          Create New Section
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={newSection.title}
            onChange={handleTitleChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sectionId">Section ID <span className="text-red-500">*</span></Label>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Used in navigation and HTML anchors
            </div>
          </div>
          <Input
            id="sectionId"
            value={newSection.sectionId}
            onChange={handleSectionIdChange}
            className={errors.sectionId ? "border-red-500" : ""}
            placeholder="my-custom-section"
          />
          {errors.sectionId ? (
            <p className="text-red-500 text-xs">{errors.sectionId}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Example: "team-members" or "pricing-plans"
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={newSection.subtitle}
            onChange={handleSubtitleChange}
            placeholder="Optional subtitle for the section"
          />
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Section Design & Content
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Customize how your section looks and what content it displays using JSON format.
            You can add text, images, backgrounds, and more.
          </p>
          
          <EditableJsonField
            value={newSection.content}
            onChange={handleContentChange}
            label="Section Design & Content (JSON)"
            height="200px"
          />
        </div>
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={createSectionMutation.isPending}
        >
          {createSectionMutation.isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            'Create Section'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}