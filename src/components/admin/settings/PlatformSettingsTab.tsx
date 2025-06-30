
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAdminSettings, useSaveSettings } from '@/hooks/admin/useAdminSettings';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export const PlatformSettingsTab = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, error } = useAdminSettings();
  const { mutate: saveSettings, isPending: isSaving } = useSaveSettings();
  
  // Form state with proper initialization
  const [formData, setFormData] = useState({
    platformName: '',
    contactEmail: '',
    platformFee: 4,
    enableChat: true,
    enableBooking: true,
    enableStories: true,
  });

  // Track if settings have been loaded to prevent unnecessary resets
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings data into form when available and not already loaded
  useEffect(() => {
    if (settings && !settingsLoaded) {
      console.log('Loading platform settings into form:', settings);
      setFormData({
        platformName: settings.mission?.split(' - ')[0] || 'Mental Health App',
        contactEmail: settings.contact_email || 'support@example.com',
        platformFee: settings.platform_fee_percentage || 4,
        enableChat: settings.enable_chat ?? true,
        enableBooking: settings.enable_booking ?? true,
        enableStories: settings.enable_stories ?? true,
      });
      setSettingsLoaded(true);
    }
  }, [settings, settingsLoaded]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving platform settings:', formData);
    
    // Validate form data
    if (formData.platformFee < 0 || formData.platformFee > 100) {
      toast({
        title: "Invalid platform fee",
        description: "Platform fee must be between 0 and 100%",
        variant: "destructive"
      });
      return;
    }

    if (!formData.contactEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid contact email",
        variant: "destructive"
      });
      return;
    }

    if (!formData.platformName.trim()) {
      toast({
        title: "Invalid platform name",
        description: "Platform name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Save all the settings including the new fields
    saveSettings({
      platform_fee_percentage: formData.platformFee,
      mission: `${formData.platformName} - Our mission is to make mental health support accessible to everyone, everywhere.`,
      contact_email: formData.contactEmail,
      enable_chat: formData.enableChat,
      enable_booking: formData.enableBooking, 
      enable_stories: formData.enableStories,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading settings: {error.message}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Platform Settings</h3>
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              <Label htmlFor="platformName">Platform Name</Label>
              <Input 
                id="platformName"
                type="text" 
                placeholder="Mental Health App"
                value={formData.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail"
                type="email" 
                placeholder="support@example.com"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="platformFee">Platform Fee (%)</Label>
            <Input 
              id="platformFee"
              type="number" 
              placeholder="10"
              min="0"
              max="100"
              value={formData.platformFee}
              onChange={(e) => handleInputChange('platformFee', parseFloat(e.target.value) || 0)}
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
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-0.5">
              <Label htmlFor="enableChat">Enable Chat Feature</Label>
              <p className="text-sm text-muted-foreground">Allow users to chat with consultants</p>
            </div>
            <Switch
              id="enableChat"
              checked={formData.enableChat}
              onCheckedChange={(checked) => handleInputChange('enableChat', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-0.5">
              <Label htmlFor="enableBooking">Enable Consultant Booking</Label>
              <p className="text-sm text-muted-foreground">Allow users to book sessions with consultants</p>
            </div>
            <Switch
              id="enableBooking"
              checked={formData.enableBooking}
              onCheckedChange={(checked) => handleInputChange('enableBooking', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-0.5">
              <Label htmlFor="enableStories">Enable Public Stories</Label>
              <p className="text-sm text-muted-foreground">Allow users to view and share stories publicly</p>
            </div>
            <Switch
              id="enableStories"
              checked={formData.enableStories}
              onCheckedChange={(checked) => handleInputChange('enableStories', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettingsTab;
