import { Client } from '@/types';

// In-memory storage for clients (for Vercel deployment)
let clientsData: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    companyName: 'Tech Solutions Inc.',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    services: [
      {
        id: '1',
        name: 'Web Development',
        category: 'industrial-services',
        description: 'Full-stack web development services'
      }
    ],
    contactInfo: {
      email: 'john.doe@techsolutions.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94043',
      website: 'https://techsolutions.com'
    },
    testimonials: [
      {
        id: '1',
        clientName: 'Jane Smith',
        content: 'John did an excellent job on our website. Highly recommended!',
        date: '2024-01-15'
      }
    ],
    rating: 4.8,
    reviews: [
      {
        id: '1',
        reviewerName: 'Mike Johnson',
        rating: 5,
        content: 'Outstanding work and great communication.',
        date: '2024-01-20'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ],
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '17:00' }
    ],
    education: 'Bachelor of Computer Science, Stanford University',
    experience: '8 years',
    certificates: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional Developer'
    ],
    priceRange: { min: 50, max: 150 }
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    companyName: 'Creative Design Studio',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    skills: ['UI/UX Design', 'Graphic Design', 'Adobe Creative Suite', 'Figma'],
    services: [
      {
        id: '2',
        name: 'UI/UX Design',
        category: 'industrial-services',
        description: 'User interface and experience design services'
      }
    ],
    contactInfo: {
      email: 'sarah.wilson@creativestudio.com',
      phone: '+1 (555) 987-6543',
      address: '456 Design Avenue, Los Angeles, CA 90210',
      website: 'https://creativestudio.com'
    },
    testimonials: [
      {
        id: '2',
        clientName: 'David Brown',
        content: 'Sarah transformed our brand identity completely. Amazing results!',
        date: '2024-02-01'
      }
    ],
    rating: 4.9,
    reviews: [
      {
        id: '2',
        reviewerName: 'Lisa Chen',
        rating: 5,
        content: 'Creative and professional. Exceeded our expectations.',
        date: '2024-02-10'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
    ],
    availability: [
      { day: 'monday', startTime: '10:00', endTime: '18:00' },
      { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'friday', startTime: '10:00', endTime: '18:00' }
    ],
    education: 'Bachelor of Fine Arts, Rhode Island School of Design',
    experience: '6 years',
    certificates: [
      'Adobe Certified Expert',
      'Google UX Design Certificate'
    ],
    priceRange: { min: 75, max: 200 }
  }
];

export function getAllClients(): Client[] {
  return [...clientsData]; // Return a copy to prevent external mutation
}

export function saveClient(client: Client): void {
  // In Vercel, we can't write to file system, so we just update in-memory
  const index = clientsData.findIndex(c => c.id === client.id);
  if (index !== -1) {
    clientsData[index] = client;
  } else {
    clientsData.push(client);
  }
}

export function getClientById(id: string): Client | undefined {
  return clientsData.find(client => client.id === id);
}

export function addClient(client: Client): void {
  clientsData.push(client);
}

export function updateClient(updatedClient: Client): void {
  const index = clientsData.findIndex(client => client.id === updatedClient.id);
  if (index !== -1) {
    clientsData[index] = updatedClient;
  }
}

export function deleteClient(id: string): void {
  clientsData = clientsData.filter(client => client.id !== id);
}
