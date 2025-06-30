
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SpecializationManager from './SpecializationManager';
import LanguageManager from './LanguageManager';
import { ConsultantFormData } from './types';

interface ConsultantFieldsProps {
  consultantData: ConsultantFormData;
  setConsultantData: (data: ConsultantFormData | ((prev: ConsultantFormData) => ConsultantFormData)) => void;
  isLoading: boolean;
}

export default function ConsultantFields({ 
  consultantData, 
  setConsultantData, 
  isLoading 
}: ConsultantFieldsProps) {
  const handleConsultantDataChange = (field: keyof ConsultantFormData, value: any) => {
    setConsultantData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Consultant Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-200">Professional Bio</Label>
        <Textarea
          id="bio"
          value={consultantData.bio}
          onChange={(e) => handleConsultantDataChange('bio', e.target.value)}
          placeholder="Tell us about your background, experience, and approach to mental health support..."
          rows={4}
          disabled={isLoading}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 dark:text-gray-200">Location</Label>
          <Input
            id="location"
            value={consultantData.location}
            onChange={(e) => handleConsultantDataChange('location', e.target.value)}
            placeholder="Remote, City, Country"
            disabled={isLoading}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate" className="text-gray-700 dark:text-gray-200">Hourly Rate (USD)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="1"
            step="0.01"
            value={consultantData.hourlyRate}
            onChange={(e) => handleConsultantDataChange('hourlyRate', e.target.value)}
            placeholder="50.00"
            disabled={isLoading}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paypalEmail" className="text-gray-700 dark:text-gray-200">PayPal Email</Label>
        <Input
          id="paypalEmail"
          type="email"
          value={consultantData.paypalEmail}
          onChange={(e) => handleConsultantDataChange('paypalEmail', e.target.value)}
          placeholder="your-paypal@email.com"
          disabled={isLoading}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
      </div>

      <SpecializationManager
        specializations={consultantData.specializations}
        onSpecializationsChange={(specs) => handleConsultantDataChange('specializations', specs)}
        isLoading={isLoading}
      />

      <LanguageManager
        languages={consultantData.languages}
        onLanguagesChange={(langs) => handleConsultantDataChange('languages', langs)}
        isLoading={isLoading}
      />
    </div>
  );
}
