import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AboutContent {
  section: string;
  title: string;
  content: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  profile_image: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_active: boolean;
}

export function AboutManagementTab() {
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch about content
  const { data: aboutContent, isLoading: contentLoading } = useQuery({
    queryKey: ['adminAboutContent'],
    queryFn: async (): Promise<AboutContent[]> => {
      const { data, error } = await supabase
        .from('about_content')
        .select('section, title, content')
        .order('section');

      if (error) throw error;
      return data;
    },
  });

  // Fetch team members
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['adminTeamMembers'],
    queryFn: async (): Promise<TeamMember[]> => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ section, title, content }: { section: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('about_content')
        .update({ title, content })
        .eq('section', section);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAboutContent'] });
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      toast({ title: 'Content updated successfully' });
      setEditingContent(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating content', description: error.message, variant: 'destructive' });
    },
  });

  // Add team member mutation
  const addMemberMutation = useMutation({
    mutationFn: async (memberData: Omit<TeamMember, 'id' | 'is_active'>) => {
      const { error } = await supabase
        .from('team_members')
        .insert([{ ...memberData, is_active: true }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({ title: 'Team member added successfully' });
      setShowAddMember(false);
    },
    onError: (error) => {
      toast({ title: 'Error adding team member', description: error.message, variant: 'destructive' });
    },
  });

  // Update team member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, ...memberData }: Partial<TeamMember> & { id: string }) => {
      const { error } = await supabase
        .from('team_members')
        .update(memberData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({ title: 'Team member updated successfully' });
      setEditingMember(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating team member', description: error.message, variant: 'destructive' });
    },
  });

  // Delete team member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTeamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast({ title: 'Team member removed successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error removing team member', description: error.message, variant: 'destructive' });
    },
  });

  const handleContentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const section = formData.get('section') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    updateContentMutation.mutate({ section, title, content });
  };

  const handleMemberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const memberData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      bio: formData.get('bio') as string || null,
      profile_image: formData.get('profile_image') as string || null,
      email: formData.get('email') as string || null,
      linkedin_url: formData.get('linkedin_url') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember, ...memberData });
    } else {
      addMemberMutation.mutate(memberData);
    }
  };

  if (contentLoading || teamLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">About Page Management</h2>
      </div>

      {/* Content Management */}
      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutContent?.map((content) => (
            <div key={content.section} className="border rounded-lg p-4">
              {editingContent === content.section ? (
                <form onSubmit={handleContentSubmit} className="space-y-4">
                  <input type="hidden" name="section" value={content.section} />
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={content.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={content.content}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingContent(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{content.title}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingContent(content.section)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm">{content.content}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Button onClick={() => setShowAddMember(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddMember && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">Add New Team Member</h3>
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" name="position" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input id="linkedin_url" name="linkedin_url" type="url" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile_image">Profile Image URL</Label>
                    <Input id="profile_image" name="profile_image" type="url" />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input id="display_order" name="display_order" type="number" defaultValue="0" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddMember(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {teamMembers?.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              {editingMember === member.id ? (
                <form onSubmit={handleMemberSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" defaultValue={member.name} required />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" name="position" defaultValue={member.position} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" defaultValue={member.bio || ''} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={member.email || ''} />
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={member.linkedin_url || ''} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile_image">Profile Image URL</Label>
                      <Input id="profile_image" name="profile_image" type="url" defaultValue={member.profile_image || ''} />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input id="display_order" name="display_order" type="number" defaultValue={member.display_order} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setEditingMember(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.profile_image || '/placeholder.svg'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge variant="outline">{member.position}</Badge>
                      <p className="text-sm text-gray-600 mt-1">Order: {member.display_order}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMember(member.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteMemberMutation.mutate(member.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default AboutManagementTab;
