
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const PlatformSettingsTab = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your platform settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Platform Settings</h3>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage platform-wide configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <input 
                type="text" 
                placeholder="Mental Health App"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <input 
                type="email" 
                placeholder="support@example.com"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform Fee (%)</label>
            <input 
              type="number" 
              placeholder="10"
              min="0"
              max="100"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 border rounded-md">
            <span>Enable Chat Feature</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-2 border rounded-md">
            <span>Enable Consultant Booking</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-2 border rounded-md">
            <span>Enable Public Stories</span>
            <input type="checkbox" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettingsTab;
