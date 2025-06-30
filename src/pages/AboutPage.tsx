
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Mail, Users, Heart, Target, Eye } from 'lucide-react';

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
}

export function AboutPage() {
  const { data: aboutContent, isLoading: contentLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async (): Promise<AboutContent[]> => {
      const { data, error } = await supabase
        .from('about_content')
        .select('section, title, content')
        .order('section');

      if (error) throw error;
      return data;
    },
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async (): Promise<TeamMember[]> => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  const getContentBySection = (section: string) => {
    return aboutContent?.find(content => content.section === section);
  };

  if (contentLoading || teamLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center text-gray-900 dark:text-gray-100">Loading...</div>
        </div>
      </Layout>
    );
  }

  const aboutSection = getContentBySection('about');
  const missionSection = getContentBySection('mission');
  const visionSection = getContentBySection('vision');
  const valuesSection = getContentBySection('values');
  const privacySection = getContentBySection('privacy');

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {aboutSection?.title || 'About Our Minds'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {aboutSection?.content || 'Loading...'}
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Mission */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{missionSection?.title || 'Our Mission'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {missionSection?.content || 'Loading...'}
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{visionSection?.title || 'Our Vision'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {visionSection?.content || 'Loading...'}
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{valuesSection?.title || 'Our Values'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {valuesSection?.content || 'Loading...'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Our Team</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the dedicated professionals who make Our Minds possible. Our team is committed to providing exceptional mental health support and creating a safe space for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers?.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <img
                      src={member.profile_image || '/placeholder.svg'}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{member.name}</h3>
                    <Badge variant="outline" className="mb-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {member.position}
                    </Badge>
                    
                    {member.bio && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    <div className="flex justify-center gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Policy Section */}
        {privacySection && (
          <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900 dark:text-gray-100">{privacySection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                {privacySection.content}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default AboutPage;
