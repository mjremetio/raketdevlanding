import React, { useState, useEffect } from 'react';
import { UserManagement } from '@/components/admin/UserManagement';
import { PermissionManagement } from '@/components/admin/PermissionManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function UserAdmin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      setLocation('/');
    }
  }, [isLoading, isAuthenticated, user, setLocation]);

  // Wait for auth to load
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  // Don't render anything if not authenticated or not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">User Administration</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions" disabled={!selectedUserId}>Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement onSelectUser={(userId: number) => setSelectedUserId(userId)} />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          {selectedUserId && <PermissionManagement userId={selectedUserId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}