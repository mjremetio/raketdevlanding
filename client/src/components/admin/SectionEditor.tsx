import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableJsonField } from './EditableJsonField';
import { Section } from '@/hooks/useWebsiteContent';
import { toast } from '@/hooks/use-toast';
import { Spinner } from "@/components/ui/spinner";

interface SectionEditorProps {
  section: Section;
}

export function SectionEditor({ section }: SectionEditorProps) {
  const queryClient = useQueryClient();
  const [editedSection, setEditedSection] = useState<Section>(section);
  
  // Mutation for updating a section
  const updateSectionMutation = useMutation({
    mutationFn: async (updatedSection: Partial<Section>) => {
      return await apiRequest(
        "PUT", 
        `/api/sections/${section.sectionId}`, 
        updatedSection
      );
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      queryClient.invalidateQueries({ queryKey: [`/api/sections/${section.sectionId}`] });
      
      toast({
        title: "Section Updated",
        description: `${section.title} section has been updated successfully`,
      });
    },
    onError: (error) => {
      console.error("Error updating section:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the section",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateSectionMutation.mutate({
      title: editedSection.title,
      subtitle: editedSection.subtitle,
      content: editedSection.content
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSection({
      ...editedSection,
      title: e.target.value
    });
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSection({
      ...editedSection,
      subtitle: e.target.value
    });
  };

  const handleContentChange = (content: any) => {
    setEditedSection({
      ...editedSection,
      content
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg text-primary">
          Edit {section.title} Section
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${section.id}`}>Title</Label>
          <Input
            id={`title-${section.id}`}
            value={editedSection.title}
            onChange={handleTitleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`subtitle-${section.id}`}>Subtitle</Label>
          <Input
            id={`subtitle-${section.id}`}
            value={editedSection.subtitle || ''}
            onChange={handleSubtitleChange}
          />
        </div>
        
        <EditableJsonField
          value={editedSection.content}
          onChange={handleContentChange}
          label="Section Content (JSON)"
        />
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSave}
            disabled={updateSectionMutation.isPending}
          >
            {updateSectionMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}