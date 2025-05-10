import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type Section = {
  id: number;
  sectionId: string;
  title: string;
};

type Permission = {
  id: number;
  userId: number;
  sectionId: string;
  canEdit: boolean;
  createdAt: string;
};

type SectionWithPermission = Section & {
  hasPermission: boolean;
  permissionId?: number;
};

export function PermissionManagement({ userId }: { userId: number }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch user details
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Query to fetch all sections
  const { data: sections = [], isLoading: isSectionsLoading } = useQuery({
    queryKey: ['/api/sections'],
  });

  // Query to fetch user permissions
  const { data: permissions = [], isLoading: isPermissionsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/permissions`],
    enabled: !!userId,
  });

  // Mutation to add permission
  const addPermissionMutation = useMutation({
    mutationFn: async ({ sectionId, canEdit }: { sectionId: string; canEdit: boolean }) => {
      return apiRequest(`/api/users/${userId}/permissions`, {
        method: 'POST',
        data: { sectionId, canEdit },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/permissions`] });
      setIsAddDialogOpen(false);
      setSelectedSection("");
      toast({
        title: 'Permission added',
        description: 'The section permission was added successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add permission',
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete permission
  const deletePermissionMutation = useMutation({
    mutationFn: async ({ sectionId }: { sectionId: string }) => {
      return apiRequest(`/api/users/${userId}/permissions/${sectionId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/permissions`] });
      toast({
        title: 'Permission removed',
        description: 'The section permission was removed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove permission',
        variant: 'destructive',
      });
    },
  });

  const handleAddPermission = () => {
    if (!selectedSection) {
      toast({
        title: 'Error',
        description: 'Please select a section',
        variant: 'destructive',
      });
      return;
    }
    
    addPermissionMutation.mutate({ 
      sectionId: selectedSection,
      canEdit: true
    });
  };

  const handleRemovePermission = (sectionId: string) => {
    deletePermissionMutation.mutate({ sectionId });
  };

  // Merge sections and permissions to show which sections the user has access to
  const sectionsWithPermissions: SectionWithPermission[] = sections.map((section: Section) => {
    const permission = permissions.find((p: Permission) => p.sectionId === section.sectionId);
    return {
      ...section,
      hasPermission: !!permission,
      permissionId: permission?.id,
    };
  });

  // Get sections that the user doesn't have permission for yet
  const availableSections = sections.filter((section: Section) => {
    return !permissions.some((p: Permission) => p.sectionId === section.sectionId);
  });

  if (isUserLoading || isSectionsLoading || isPermissionsLoading) {
    return <div className="flex justify-center p-8">Loading permissions...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">User not found</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          Section Permissions for {user.username}
        </CardTitle>
        <CardDescription>
          Manage which sections this user can edit on the website.
          {user.isAdmin && (
            <Badge variant="outline" className="ml-2">
              Administrator (has access to all sections)
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user.isAdmin ? (
          <p className="text-muted-foreground mb-4">
            This user is an administrator and automatically has permission to edit all sections.
            Individual section permissions do not need to be assigned.
          </p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center" disabled={availableSections.length === 0}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section Permission
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Section Permission</DialogTitle>
                    <DialogDescription>
                      Give this user permission to edit a specific section of the website.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="section">Choose Section</label>
                      <Select
                        value={selectedSection}
                        onValueChange={setSelectedSection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSections.map((section: Section) => (
                            <SelectItem key={section.sectionId} value={section.sectionId}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleAddPermission}
                      disabled={addPermissionMutation.isPending || !selectedSection}
                    >
                      {addPermissionMutation.isPending ? 'Adding...' : 'Add Permission'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {permissions.length === 0 ? (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">
                  This user doesn't have permission to edit any sections yet.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Section ID</TableHead>
                      <TableHead>Granted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionsWithPermissions
                      .filter(section => section.hasPermission)
                      .map(section => (
                        <TableRow key={section.sectionId}>
                          <TableCell className="font-medium">{section.title}</TableCell>
                          <TableCell>{section.sectionId}</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleRemovePermission(section.sectionId)}
                              title="Remove Permission"
                              disabled={deletePermissionMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}