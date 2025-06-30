import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddConsultantDialogProps {
  children: React.ReactNode;
}

export const AddConsultantDialog = ({ children }: AddConsultantDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'temp123!', // Temporary password - user should reset
        email_confirm: true,
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          name,
          email,
          role: 'consultant',
          profile_image: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random&color=fff`,
        });

      if (userError) throw userError;

      // Create consultant profile with 'approved' status since added by admin
      const { error: consultantError } = await supabase
        .from('consultants')
        .insert({
          id: userId,
          specialization: [specialization],
          languages: ['English'],
          location: location || 'Remote',
          bio: '',
          paypal_email: email,
          approval_status: 'approved', // Admin-added consultants are auto-approved
          available: true, // Admin-added consultants are available by default
          hourly_rate: 50,
        });

      if (consultantError) throw consultantError;

      toast({
        title: 'Consultant added successfully',
        description: 'The consultant has been added and approved automatically.',
      });

      // Reset form
      setName('');
      setEmail('');
      setSpecialization('');
      setLocation('');
      setOpen(false);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['pending-consultants'] });
      queryClient.invalidateQueries({ queryKey: ['approved-consultants'] });

    } catch (error: any) {
      console.error('Error adding consultant:', error);
      toast({
        title: 'Failed to add consultant',
        description: error.message || 'An error occurred while adding the consultant.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Consultant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter consultant name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter consultant email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Mental Health">General Mental Health</SelectItem>
                <SelectItem value="Anxiety">Anxiety</SelectItem>
                <SelectItem value="Depression">Depression</SelectItem>
                <SelectItem value="Trauma">Trauma</SelectItem>
                <SelectItem value="Addiction">Addiction</SelectItem>
                <SelectItem value="PTSD">PTSD</SelectItem>
                <SelectItem value="Family Therapy">Family Therapy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Consultant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
