import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Testimonial } from '@/hooks/useWebsiteContent';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from 'lucide-react';

interface TestimonialEditorProps {
  testimonial: Testimonial;
  onDelete?: () => void;
  isNew?: boolean;
}

export function TestimonialEditor({ testimonial, onDelete, isNew = false }: TestimonialEditorProps) {
  const queryClient = useQueryClient();
  const [editedTestimonial, setEditedTestimonial] = useState<Testimonial>(testimonial);
  
  // Mutation for updating a testimonial
  const updateTestimonialMutation = useMutation({
    mutationFn: async (updatedTestimonial: Partial<Testimonial>) => {
      if (isNew) {
        return await apiRequest("POST", '/api/testimonials', updatedTestimonial);
      } else {
        return await apiRequest("PUT", `/api/testimonials/${testimonial.id}`, updatedTestimonial);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: isNew ? "Testimonial Created" : "Testimonial Updated",
        description: `${editedTestimonial.name}'s testimonial has been ${isNew ? 'created' : 'updated'} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error updating testimonial:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the testimonial",
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a testimonial
  const deleteTestimonialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/testimonials/${testimonial.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: "Testimonial Deleted",
        description: `${testimonial.name}'s testimonial has been deleted successfully`,
      });
      if (onDelete) onDelete();
    },
    onError: (error) => {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the testimonial",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateTestimonialMutation.mutate({
      name: editedTestimonial.name,
      position: editedTestimonial.position,
      content: editedTestimonial.content,
      order: editedTestimonial.order
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${testimonial.name}'s testimonial?`)) {
      deleteTestimonialMutation.mutate();
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg text-primary">
          {isNew ? 'New Testimonial' : `Edit ${testimonial.name}'s Testimonial`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
          <Input
            id={`name-${testimonial.id}`}
            value={editedTestimonial.name}
            onChange={(e) => setEditedTestimonial({...editedTestimonial, name: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`position-${testimonial.id}`}>Position</Label>
          <Input
            id={`position-${testimonial.id}`}
            value={editedTestimonial.position}
            onChange={(e) => setEditedTestimonial({...editedTestimonial, position: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`content-${testimonial.id}`}>Testimonial Content</Label>
          <Textarea
            id={`content-${testimonial.id}`}
            value={editedTestimonial.content}
            onChange={(e) => setEditedTestimonial({...editedTestimonial, content: e.target.value})}
            rows={5}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`order-${testimonial.id}`}>Display Order</Label>
          <Input
            id={`order-${testimonial.id}`}
            type="number"
            value={editedTestimonial.order}
            onChange={(e) => setEditedTestimonial({...editedTestimonial, order: Number(e.target.value)})}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isNew && (
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTestimonialMutation.isPending}
          >
            {deleteTestimonialMutation.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        )}
        <Button 
          onClick={handleSave}
          disabled={updateTestimonialMutation.isPending}
        >
          {updateTestimonialMutation.isPending ? (
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