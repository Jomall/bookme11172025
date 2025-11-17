export interface Client {
  id: string;
  name: string;
  companyName?: string;
  profilePhoto: string;
  skills: string[];
  services: Service[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  testimonials: Testimonial[];
  rating: number;
  reviews: Review[];
  photos: string[];
  availability: string;
  education: string;
  experience: string; // e.g., "5 years"
  jobDocuments?: {
    cv: string;
    applicationLetter: string;
    cvFile: string;
    applicationLetterFile: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
}

export type ServiceCategory =
  | 'industrial-services'
  | 'ride-share'
  | 'food-catering'
  | 'party-planner'
  | 'house-cleaner'
  | 'car-washing'
  | 'passive-job-seeking'
  | 'manufacturing-production'
  | 'construction-building'
  | 'energy-utilities'
  | 'mining-extraction'
  | 'transportation-logistics'
  | 'chemical-pharmaceutical'
  | 'food-beverage'
  | 'other-specialized-industrial';

export interface Testimonial {
  id: string;
  clientName: string;
  content: string;
  date: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  content: string;
  date: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
