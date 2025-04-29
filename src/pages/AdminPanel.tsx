import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [paypalSettings, setPaypalSettings] = useState({
    clientId: 'sb-xxxx1234',
    clientSecret: '••••••••••••••••',
  });
  
  const [aboutContent, setAboutContent] = useState({
    mission: 'Our mission is to make mental health support accessible to everyone, everywhere.',
    vision: 'We envision a world where mental health is treated with the same importance as physical health.',
    values: 'Compassion, Accessibility, Quality, Privacy, and Inclusion.',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stories, setStories] = useState([
    { 
      id: '201', 
      title: 'My Journey with Depression',
      authorName: 'John Smith',
      publishedAt: '2023-04-15',
      status: 'published',
      isFeatured: false
    },
    { 
      id: '202', 
      title: 'Overcoming Social Anxiety',
      authorName: 'Lisa Wong',
      publishedAt: '2023-04-16',
      status: 'published',
      isFeatured: false
    },
    { 
      id: '203', 
      title: 'Dealing with Panic Attacks',
      authorName: 'Michael Johnson',
      publishedAt: '2023-04-17',
      status: 'flagged',
      isFeatured: false
    },
  ]);
  
  const pendingConsultants = [
    { 
      id: '101', 
      name: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      specialization: ['Depression', 'Anxiety'],
      submittedDate: '2023-04-10'
    },
    { 
      id: '102', 
      name: 'David Chen',
      email: 'david.chen@example.com',
      specialization: ['Family Therapy', 'Trauma'],
      submittedDate: '2023-04-12'
    },
  ];
  
  const users = [
    {
      id: '1',
      name: 'Test User',
      email: 'user@example.com',
      role: 'user',
      joinDate: '2023-03-01'
    },
    {
      id: '2',
      name: 'Ann Silo',
      email: 'consultant@example.com',
      role: 'consultant',
      joinDate: '2023-02-15'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      joinDate: '2023-01-10'
    }
  ];
  
  const handleToggleFeature = async (storyId: string) => {
    try {
      const storyIndex = stories.findIndex(s => s.id === storyId);
      if (storyIndex !== -1) {
        stories[storyIndex].isFeatured = !stories[storyIndex].isFeatured;
      }
      
      toast({
        title: "Story Updated",
        description: `Story has been ${stories[storyIndex].isFeatured ? 'set as featured' : 'removed from featured'}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update story.",
        variant: "destructive"
      });
    }
  };
  
  const handleSavePayPalSettings = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Updated",
        description: "PayPal settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update PayPal settings.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveAboutContent = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Content Updated",
        description: "About page content has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleApproveConsultant = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Consultant Approved",
        description: "The consultant has been approved and notified."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve consultant.",
        variant: "destructive"
      });
    }
  };
  
  const handleRejectConsultant = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Consultant Rejected",
        description: "The consultant has been rejected and notified."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject consultant.",
        variant: "destructive"
      });
    }
  };
  
  const handleModerateStory = async (id: string, action: 'approve' | 'remove') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: action === 'approve' ? "Story Approved" : "Story Removed",
        description: action === 'approve' 
          ? "The story has been approved and is now visible." 
          : "The story has been removed from the platform."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to moderate story.",
        variant: "destructive"
      });
    }
  };
  
  const handlePromoteUser = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "User Promoted",
        description: "The user has been promoted to admin."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveUser = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "User Removed",
        description: "The user has been removed from the platform."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove user.",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mental-green-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, content, and platform settings
          </p>
        </div>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingConsultants.length}</div>
                  <p className="text-sm text-gray-500">Consultant profiles waiting for review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stories.length}</div>
                  <p className="text-sm text-gray-500">Stories published in the last 7 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-gray-500">Users active in the last 30 days</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">New consultant application submitted</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">New story published</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="rounded-full bg-amber-100 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Session booked</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Review Consultants
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Moderate Stories
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Platform Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? "default" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.role !== 'admin' && user.role !== 'owner' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePromoteUser(user.id)}
                              >
                                Promote
                              </Button>
                            )}
                            {user.role !== 'owner' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Page Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Mission Statement</label>
                      <Textarea 
                        value={aboutContent.mission}
                        onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Vision</label>
                      <Textarea 
                        value={aboutContent.vision}
                        onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Values</label>
                      <Textarea 
                        value={aboutContent.values}
                        onChange={(e) => setAboutContent({...aboutContent, values: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSaveAboutContent} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Moderate Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stories.map(story => (
                        <TableRow key={story.id}>
                          <TableCell>{story.title}</TableCell>
                          <TableCell>{story.authorName}</TableCell>
                          <TableCell>{story.publishedAt}</TableCell>
                          <TableCell>
                            <Badge variant={story.status === 'flagged' ? "destructive" : "default"}>
                              {story.status || 'published'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={story.isFeatured ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleFeature(story.id)}
                            >
                              {story.isFeatured ? 'Featured' : 'Set as Featured'}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {story.status === 'flagged' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleModerateStory(story.id, 'approve')}
                                >
                                  Approve
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleModerateStory(story.id, 'remove')}
                                className="text-red-500 hover:text-red-600"
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="consultants">
            <Card>
              <CardHeader>
                <CardTitle>Pending Consultant Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingConsultants.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingConsultants.map(consultant => (
                        <TableRow key={consultant.id}>
                          <TableCell>{consultant.name}</TableCell>
                          <TableCell>{consultant.email}</TableCell>
                          <TableCell>
                            {consultant.specialization.join(', ')}
                          </TableCell>
                          <TableCell>{consultant.submittedDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                onClick={() => handleApproveConsultant(consultant.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRejectConsultant(consultant.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No pending applications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>PayPal Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Client ID</label>
                    <Input 
                      value={paypalSettings.clientId}
                      onChange={(e) => setPaypalSettings({...paypalSettings, clientId: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Client Secret</label>
                    <Input 
                      type="password"
                      value={paypalSettings.clientSecret}
                      onChange={(e) => setPaypalSettings({...paypalSettings, clientSecret: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSavePayPalSettings} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Platform Fees</h3>
                  <p className="text-sm text-gray-600">
                    The platform currently takes 4% of each session payment. 
                    Consultants receive 96% of the payment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default AdminPanel;
