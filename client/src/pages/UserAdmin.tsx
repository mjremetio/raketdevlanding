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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Administration</h1>
        <a 
          href="/admin" 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Dashboard
        </a>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6 p-4">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-gray-100 dark:bg-gray-900">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              disabled={!selectedUserId}
              className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=disabled]:opacity-50"
            >
              Permissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement onSelectUser={(userId: number) => setSelectedUserId(userId)} />
          </TabsContent>
          
          <TabsContent value="permissions" className="mt-6">
            {selectedUserId && <PermissionManagement userId={selectedUserId} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}