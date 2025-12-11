import Link from 'next/link';
import { getAllClients } from '@/lib/data';
import { Client, ServiceCategory } from '@/types';

interface ServicesPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { category } = await params;
  const clients = getAllClients();
  const categoryKey = category as ServiceCategory;

  const filteredClients = clients.filter(client =>
    client.services.some(service => service.category === categoryKey)
  );

  const categoryNames: Record<ServiceCategory, string> = {
    'industrial-services': 'Industrial Services',
    'manufacturing-production': 'Manufacturing and Production',
    'construction-building': 'Construction and Building',
    'energy-utilities': 'Energy and Utilities',
    'mining-extraction': 'Mining and Extraction',
    'transportation-logistics': 'Transportation and Logistics',
    'chemical-pharmaceutical': 'Chemical and Pharmaceutical',
    'food-beverage': 'Food and Beverage',
    'other-specialized-industrial': 'Other Specialized Industrial Roles',
    'ride-share': 'Ride Share',
    'food-catering': 'Food Catering',
    'party-planner': 'Party Planner',
    'house-cleaner': 'House Cleaner',
    'car-washing': 'Car Washing',
    'passive-job-seeking': 'Passive Job Seeking',
    'after-hours': 'After Hours',
    'barber-hairdresser': 'Barber & Hairdresser',
    'nail-tech': 'Nail Technician',
    'doctor': 'Doctor',
    'lawyer': 'Lawyer',
    'landscaper': 'Landscaper',
    'taxi': 'Taxi Service',
    'dentist': 'Dentist',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">BookME</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-800">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryNames[categoryKey] || 'Services'}
            </h2>
            <p className="text-gray-600">
              Discover professionals offering {categoryNames[categoryKey]?.toLowerCase() || 'services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      className="h-12 w-12 rounded-full mr-4"
                      src={client.profilePhoto || '/images/default-avatar.jpg'}
                      alt={client.name}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">{client.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {client.services
                        .filter(service => service.category === categoryKey)
                        .map((service) => (
                          <span
                            key={service.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {service.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {client.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {client.skills.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{client.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/client/${client.id}`}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No professionals found in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
