
export interface Consultant {
  id: string;
  name: string;
  profileImage: string;
  specialization: string[];
  languages: string[];
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isOnline: boolean;
  availability: {
    day: string;
    slots: string[];
  }[];
}

export const consultants: Consultant[] = [
  {
    id: '2',
    name: 'Ann Silo',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    specialization: ['Anxiety', 'Depression', 'PTSD', 'Stress Management', 'Trauma', 'Grief'],
    languages: ['English', 'Spanish'],
    location: 'New York, USA',
    bio: 'Experienced mental health consultant with 10+ years of practice.',
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 85,
    isOnline: true,
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '12:00 PM', '4:00 PM'] }
    ]
  },
  {
    id: '8',
    name: 'Dr. Michael Stevens',
    profileImage: 'https://i.pravatar.cc/150?img=11',
    specialization: ['Trauma', 'PTSD', 'Grief Counseling', 'Anxiety', 'Depression', 'Phobias'],
    languages: ['English', 'French'],
    location: 'Toronto, Canada',
    bio: 'Specializing in trauma recovery and post-traumatic growth.',
    rating: 4.9,
    reviewCount: 187,
    hourlyRate: 95,
    isOnline: false,
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '12:00 PM', '2:00 PM'] },
      { day: 'Thursday', slots: ['11:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Saturday', slots: ['9:00 AM', '11:00 AM', '1:00 PM'] }
    ]
  },
  {
    id: '9',
    name: 'Sarah Johnson',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    specialization: ['Teen Counseling', 'Family Therapy', 'Anxiety', 'Depression', 'Self Esteem', 'Social Skills'],
    languages: ['English'],
    location: 'Chicago, USA',
    bio: 'Helping teens and families navigate mental health challenges.',
    rating: 4.7,
    reviewCount: 98,
    hourlyRate: 75,
    isOnline: true,
    availability: [
      { day: 'Monday', slots: ['3:00 PM', '4:00 PM', '5:00 PM'] },
      { day: 'Wednesday', slots: ['3:00 PM', '4:00 PM', '5:00 PM'] },
      { day: 'Friday', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] }
    ]
  },
  {
    id: '10',
    name: 'Dr. Amara Okafor',
    profileImage: 'https://i.pravatar.cc/150?img=13',
    specialization: ['Cultural Identity', 'Racial Trauma', 'Anxiety', 'Depression', 'PTSD', 'Stress'],
    languages: ['English', 'Igbo', 'Yoruba'],
    location: 'London, UK',
    bio: 'Specializing in cultural identity issues and racial trauma.',
    rating: 4.9,
    reviewCount: 145,
    hourlyRate: 90,
    isOnline: false,
    availability: [
      { day: 'Tuesday', slots: ['9:00 AM', '11:00 AM', '1:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '12:00 PM', '2:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '12:00 PM'] }
    ]
  },
  {
    id: '11',
    name: 'Javier Rodriguez',
    profileImage: 'https://i.pravatar.cc/150?img=14',
    specialization: ['Addiction Recovery', 'Substance Abuse', 'Anxiety', 'Depression', 'Trauma', 'Stress Management'],
    languages: ['English', 'Spanish', 'Portuguese'],
    location: 'Miami, USA',
    bio: 'Helping individuals overcome addiction and build healthier lives.',
    rating: 4.6,
    reviewCount: 112,
    hourlyRate: 80,
    isOnline: true,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['11:00 AM', '2:00 PM', '5:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] }
    ]
  }
];
