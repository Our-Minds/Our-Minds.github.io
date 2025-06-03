
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Star, Search, Filter, MapPin, Globe, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { findOrCreateChatThread } from '@/utils/chatUtils';
import { useQuery } from '@tanstack/react-query';
import { ConsultantDetails, Consultant } from '@/utils/consultantTypes';
import { consultants as mockConsultants } from '@/data/mockConsultants';

export function ConsultPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  // Fetch consultants from Supabase using separate queries
  const { data: consultants = [], isLoading } = useQuery({
    queryKey: ['consultants'],
    queryFn: async () => {
      try {
        // 1. First, fetch all users with consultant role
        const { data: consultantUsers, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            name,
            email,
            profile_image,
            role
          `)
          .eq('role', 'consultant');
          
        if (userError) throw userError;
        
        // 2. Get consultant details from consultants table using the IDs
        const consultantIds = consultantUsers.map(user => user.id);
        const { data: consultantDetails, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .in('id', consultantIds);
          
        if (consultantError) throw consultantError;
        
        // 3. Merge the data to create complete consultant profiles
        return consultantUsers.map(user => {
          // Find the details for this consultant or use defaults if not found
          const details: ConsultantDetails = consultantDetails?.find(c => c.id === user.id) || {
            specialization: [],
            languages: ['English'],
            location: 'Remote',
            bio: '',
            rating: 0,
            review_count: 0,
            hourly_rate: 50,
            available: false
          };
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_image: user.profile_image || 'https://i.pravatar.cc/150?img=2',
            specialization: details.specialization,
            languages: details.languages,
            location: details.location,
            bio: details.bio,
            rating: 0, // Removed mock ratings
            review_count: 0, // Removed mock review counts
            hourly_rate: details.hourly_rate,
            available: details.available
          };
        }) as Consultant[];
      } catch (error) {
        console.error("Error fetching consultants:", error);
        
        // Fallback to mock data if there's an error
        console.log("Using mock consultants data as fallback");
        return mockConsultants.map(c => ({
          id: c.id,
          name: c.name,
          email: `${c.name.toLowerCase().replace(' ', '.')}@example.com`,
          profile_image: c.profileImage,
          specialization: c.specialization,
          languages: c.languages,
          location: c.location,
          bio: c.bio,
          rating: 0, // Removed mock ratings
          review_count: 0, // Removed mock review counts
          hourly_rate: c.hourlyRate,
          available: c.isOnline
        }));
      }
    }
  });
  
  const onlineConsultants = consultants.filter(c => c.available);
  
  const specializations = Array.from(
    new Set(onlineConsultants.flatMap(c => c.specialization || []))
  );
  
  const filteredConsultants = onlineConsultants.filter(consultant => {
    const matchesSearch = 
      searchQuery === '' || 
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialization = 
      selectedSpecialization === '' || 
      (consultant.specialization && consultant.specialization.includes(selectedSpecialization));
      
    return matchesSearch && matchesSpecialization;
  });

  const startConsultation = async (consultantId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a consultation",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      // Find or create chat thread
      const chatThread = await findOrCreateChatThread(consultantId, user.id);
      
      // Navigate to chat with this thread open
      navigate(`/chat/${chatThread.id}`);
      
      toast({
        title: "Consultation Started",
        description: "You are now connected with the consultant",
      });
    } catch (error) {
      console.error("Error starting consultation:", error);
      toast({
        title: "Error",
        description: "Could not start consultation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToBooking = (consultantId: string) => {
    navigate(`/book-session/${consultantId}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mental-green-800 mb-2">Free Mental Health Consultation</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name or keyword..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select 
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mental-green-500"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>Loading consultants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultants.map(consultant => (
              <Card key={consultant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/2] overflow-hidden relative">
                  <img 
                    src={consultant.profile_image} 
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{consultant.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{consultant.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <Globe size={16} className="mr-1" />
                    <span className="text-sm">{consultant.languages ? consultant.languages.join(', ') : 'English'}</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm line-clamp-2 text-gray-700">{consultant.bio}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.specialization?.slice(0, 3).map((spec, index) => {
                      if (index === 0 && selectedSpecialization && consultant.specialization.includes(selectedSpecialization)) {
                        return (
                          <Badge key={selectedSpecialization} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                            {selectedSpecialization}
                          </Badge>
                        );
                      }
                      
                      return (
                        <Badge key={spec} variant="outline" className="bg-mental-green-50 text-mental-green-800 border-mental-green-200">
                          {spec}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => startConsultation(consultant.id)}
                        variant="default"
                        className="flex items-center"
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Chat Now
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => navigateToBooking(consultant.id)}
                        variant="outline"
                        className="flex items-center"
                      >
                        <Calendar size={16} className="mr-1" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredConsultants.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No consultants online</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ConsultPage;
