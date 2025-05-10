import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project } from '@/hooks/useWebsiteContent';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface ProjectEditorProps {
  project: Project;
  onDelete?: () => void;
  isNew?: boolean;
}

export function ProjectEditor({ project, onDelete, isNew = false }: ProjectEditorProps) {
  const queryClient = useQueryClient();
  const [editedProject, setEditedProject] = useState<Project>(project);
  
  // Mutation for updating a project
  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      if (isNew) {
        return await apiRequest("POST", '/api/projects', updatedProject);
      } else {
        return await apiRequest("PUT", `/api/projects/${project.id}`, updatedProject);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: isNew ? "Project Created" : "Project Updated",
        description: `${editedProject.title} has been ${isNew ? 'created' : 'updated'} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the project",
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a project
  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/projects/${project.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project Deleted",
        description: `${project.title} has been deleted successfully`,
      });
      if (onDelete) onDelete();
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the project",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateProjectMutation.mutate({
      title: editedProject.title,
      category: editedProject.category,
      image: editedProject.image,
      link: editedProject.link,
      description: editedProject.description,
      order: editedProject.order
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${project.title}?`)) {
      deleteProjectMutation.mutate();
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg text-primary">
          {isNew ? 'New Project' : `Edit ${project.title}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${project.id}`}>Title</Label>
          <Input
            id={`title-${project.id}`}
            value={editedProject.title}
            onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`category-${project.id}`}>Category</Label>
          <Input
            id={`category-${project.id}`}
            value={editedProject.category}
            onChange={(e) => setEditedProject({...editedProject, category: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <ImageUploadField 
            value={editedProject.image}
            onChange={(url) => setEditedProject({...editedProject, image: url})}
            label="Project Image"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`link-${project.id}`}>Project Link (Optional)</Label>
          <Input
            id={`link-${project.id}`}
            value={editedProject.link || ''}
            onChange={(e) => setEditedProject({...editedProject, link: e.target.value})}
            placeholder="https://example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`description-${project.id}`}>Description (Optional)</Label>
          <Textarea
            id={`description-${project.id}`}
            value={editedProject.description || ''}
            onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`order-${project.id}`}>Display Order</Label>
          <Input
            id={`order-${project.id}`}
            type="number"
            value={editedProject.order}
            onChange={(e) => setEditedProject({...editedProject, order: Number(e.target.value)})}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isNew && (
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProjectMutation.isPending}
          >
            {deleteProjectMutation.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        )}
        <Button 
          onClick={handleSave}
          disabled={updateProjectMutation.isPending}
        >
          {updateProjectMutation.isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}