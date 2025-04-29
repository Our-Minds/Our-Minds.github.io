
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { consultants } from '@/data/mockConsultants';
import { Star, Search, Filter, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils';
import { chatThreads } from '@/data/mockChats';

export function ConsultPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  const onlineConsultants = consultants.filter(c => c.isOnline);
  
  const specializations = Array.from(
    new Set(onlineConsultants.flatMap(c => c.specialization))
  );
  
  const filteredConsultants = onlineConsultants.filter(consultant => {
    const matchesSearch = 
      searchQuery === '' || 
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialization = 
      selectedSpecialization === '' || 
      consultant.specialization.includes(selectedSpecialization);
      
    return matchesSearch && matchesSpecialization;
  });

  const startConsultation = (consultantId: string) => {
    // Find the existing chat or create a new one
    let chatThread = chatThreads.find(thread => 
      thread.participants.some(p => p.id === consultantId)
    );

    if (!chatThread) {
      const consultant = consultants.find(c => c.id === consultantId);
      if (!consultant) {
        toast({
          title: "Error",
          description: "Consultant not found",
          variant: "destructive"
        });
        return;
      }

      // Create new chat thread
      chatThread = {
        id: generateId(),
        participants: [
          {
            id: '1', // Current user
            name: 'Current User',
            image: '/public/lovable-uploads/7646df82-fc16-4ccb-8469-742a8722685b.png'
          },
          {
            id: consultant.id,
            name: consultant.name,
            image: consultant.profileImage
          }
        ],
        messages: [
          {
            id: generateId(),
            senderId: '1',
            senderName: 'Current User',
            senderImage: 'https://i.pravatar.cc/150?img=1',
            content: "Hi, I would like to consult",
            timestamp: new Date().toISOString(),
          }
        ],
        lastActive: new Date().toISOString()
      };

      chatThreads.unshift(chatThread);
    }

    navigate(`/chat/${consultantId}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mental-green-800 mb-2">Free Mental Health Consultation</h1>
          <p className="text-gray-600">
            Connect with our qualified consultants online for free consultation
          </p>
          <p className="text-sm text-mental-green-700 mt-1">
            These are consultants currently online and available for immediate consultation
          </p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map(consultant => (
            <Card key={consultant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/2] overflow-hidden relative">
                <img 
                  src={consultant.profileImage} 
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
                <div className="flex items-center mb-3">
                  <div className="flex items-center text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="ml-1 text-sm font-medium">{consultant.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{consultant.reviewCount} reviews</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{consultant.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <Globe size={16} className="mr-1" />
                  <span className="text-sm">{consultant.languages.join(', ')}</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm line-clamp-2 text-gray-700">{consultant.bio}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {consultant.specialization.slice(0, 3).map((spec, index) => {
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
                  <div>
                    <p className="font-medium text-mental-green-800">Free Consultation</p>
                    <p className="text-xs text-gray-600">Chat with expert now</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => startConsultation(consultant.id)}
                  >
                    Start Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredConsultants.length === 0 && (
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
