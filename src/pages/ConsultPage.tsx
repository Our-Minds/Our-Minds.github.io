
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import AuthRedirect from '@/components/auth/AuthRedirect';
import { ConsultantSearchFilters } from '@/components/consult/ConsultantSearchFilters';
import { ConsultantGrid } from '@/components/consult/ConsultantGrid';
import { useConsultants } from '@/hooks/useConsultants';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  hourly_rate: number;
  available: boolean;
}

export function ConsultPage() {
  const { isAuthenticated } = useAuth();
  const { consultants, isLoading } = useConsultants();
  const [filteredConsultants, setFilteredConsultants] = useState<ConsultantData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    const filterConsultants = () => {
      let results = consultants;

      if (searchQuery) {
        results = results.filter(consultant =>
          consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          consultant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          consultant.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (selectedSpecialization) {
        results = results.filter(consultant =>
          consultant.specialization.includes(selectedSpecialization)
        );
      }

      setFilteredConsultants(results);
    };

    filterConsultants();
  }, [consultants, searchQuery, selectedSpecialization]);

  if (!isAuthenticated) {
    return <AuthRedirect />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Find Your Mental Health Professional
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with qualified consultants who understand your needs and can provide 
              personalized support for your mental health journey.
            </p>
          </div>

          {/* Search and Filter Section */}
          <ConsultantSearchFilters
            searchQuery={searchQuery}
            selectedSpecialization={selectedSpecialization}
            onSearchChange={setSearchQuery}
            onSpecializationChange={setSelectedSpecialization}
          />

          {/* Results Section */}
          <ConsultantGrid
            consultants={filteredConsultants}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ConsultPage;
