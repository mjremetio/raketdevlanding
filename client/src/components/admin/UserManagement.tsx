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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Pencil, Trash2, UserPlus, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserFormData = {
  username: string;
  password: string;
  isAdmin: boolean;
};

type UserManagementProps = {
  onSelectUser?: (userId: number) => void;
};

export function UserManagement({ onSelectUser }: UserManagementProps = {}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    isAdmin: false,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
  });

  // Mutation to create user
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      return apiRequest('/api/users', {
        method: 'POST',
        data: userData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsCreateDialogOpen(false);
      setFormData({ username: '', password: '', isAdmin: false });
      toast({
        title: 'User created',
        description: 'The user was created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<UserFormData> }) => {
      return apiRequest(`/api/users/${id}`, {
        method: 'PUT',
        data: userData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: 'User updated',
        description: 'The user was updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest(`/api/users/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: 'User deleted',
        description: 'The user was deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({
        title: 'Error',
        description: 'Username and password are required',
        variant: 'destructive',
      });
      return;
    }
    createUserMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    // Only include username if it has changed
    const updateData: Partial<UserFormData> = {
      isAdmin: formData.isAdmin,
    };
    
    if (formData.username !== selectedUser.username) {
      updateData.username = formData.username;
    }
    
    // Only include password if it's not empty
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    updateUserMutation.mutate({ id: selectedUser.id, userData: updateData });
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't populate password field
      isAdmin: user.isAdmin,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const renderCreateDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 flex items-center" onClick={() => setFormData({ username: '', password: '', isAdmin: false })}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleCreateSubmit}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isAdmin: checked === true })
                }
              />
              <Label htmlFor="isAdmin">Administrator Access</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderEditDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <form onSubmit={handleEditSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password blank to keep current password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isAdmin: checked === true })
                }
              />
              <Label htmlFor="edit-isAdmin">Administrator Access</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm font-medium">Username: {selectedUser?.username}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        {renderCreateDialog()}
      </div>
      
      {users.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No users found. Add a new user to get started.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge variant="default">Administrator</Badge>
                    ) : (
                      <Badge variant="outline">Standard User</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                        title="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(user)}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {onSelectUser && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onSelectUser(user.id)}
                          title="Manage Permissions"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {renderEditDialog()}
      {renderDeleteDialog()}
    </div>
  );
}