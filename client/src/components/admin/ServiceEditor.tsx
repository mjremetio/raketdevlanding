import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Service } from '@/hooks/useWebsiteContent';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Plus, X } from 'lucide-react';
import { IconSelector } from './IconSelector';

interface ServiceEditorProps {
  service: Service;
  onDelete?: () => void;
  isNew?: boolean;
}

export function ServiceEditor({ service, onDelete, isNew = false }: ServiceEditorProps) {
  const queryClient = useQueryClient();
  const [editedService, setEditedService] = useState<Service>(service);
  const [newDetail, setNewDetail] = useState<string>('');
  
  // Mutation for updating a service
  const updateServiceMutation = useMutation({
    mutationFn: async (updatedService: Partial<Service>) => {
      if (isNew) {
        return await apiRequest("POST", '/api/services', updatedService);
      } else {
        return await apiRequest("PUT", `/api/services/${service.id}`, updatedService);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: isNew ? "Service Created" : "Service Updated",
        description: `${editedService.title} has been ${isNew ? 'created' : 'updated'} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error updating service:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the service",
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a service
  const deleteServiceMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/services/${service.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service Deleted",
        description: `${service.title} has been deleted successfully`,
      });
      if (onDelete) onDelete();
    },
    onError: (error) => {
      console.error("Error deleting service:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the service",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateServiceMutation.mutate({
      title: editedService.title,
      icon: editedService.icon,
      description: editedService.description,
      details: editedService.details,
      order: editedService.order
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${service.title}?`)) {
      deleteServiceMutation.mutate();
    }
  };

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      setEditedService({
        ...editedService,
        details: [...editedService.details, newDetail.trim()]
      });
      setNewDetail('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    const updatedDetails = [...editedService.details];
    updatedDetails.splice(index, 1);
    setEditedService({
      ...editedService,
      details: updatedDetails
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg text-primary">
          {isNew ? 'New Service' : `Edit ${service.title}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${service.id}`}>Title</Label>
          <Input
            id={`title-${service.id}`}
            value={editedService.title}
            onChange={(e) => setEditedService({...editedService, title: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Icon</Label>
          <IconSelector 
            selectedIcon={editedService.icon} 
            onSelectIcon={(icon) => setEditedService({...editedService, icon})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`description-${service.id}`}>Description</Label>
          <Textarea
            id={`description-${service.id}`}
            value={editedService.description}
            onChange={(e) => setEditedService({...editedService, description: e.target.value})}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Details</Label>
          
          <div className="space-y-2">
            {editedService.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={detail}
                  onChange={(e) => {
                    const updatedDetails = [...editedService.details];
                    updatedDetails[index] = e.target.value;
                    setEditedService({...editedService, details: updatedDetails});
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveDetail(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Add a new detail"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDetail();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddDetail}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`order-${service.id}`}>Display Order</Label>
          <Input
            id={`order-${service.id}`}
            type="number"
            value={editedService.order}
            onChange={(e) => setEditedService({...editedService, order: Number(e.target.value)})}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isNew && (
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteServiceMutation.isPending}
          >
            {deleteServiceMutation.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        )}
        <Button 
          onClick={handleSave}
          disabled={updateServiceMutation.isPending}
        >
          {updateServiceMutation.isPending ? (
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