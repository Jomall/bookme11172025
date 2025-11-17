import { notFound } from 'next/navigation';
import { getClientById } from '@/lib/data';
import { Client } from '@/types';

interface ClientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;
  const client: Client | undefined = getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">BookME</h1>
            </div>
            <nav className="flex space-x-4">
              <a href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </a>
              <a href="/admin/login" className="text-blue-600 hover:text-blue-800">
                Admin Login
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <img
                className="h-24 w-24 rounded-full mr-6"
                src={client.profilePhoto || '/images/default-avatar.jpg'}
                alt={client.name}
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{client.name}</h2>
                {client.companyName && (
                  <p className="text-gray-600">{client.companyName}</p>
                )}
                <p className="text-gray-600">{client.experience} experience</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-gray-700">{client.rating}/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {client.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Services</h3>
                <div className="space-y-4">
                  {client.services.map((service) => (
                    <div key={service.id} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-gray-600">{service.description}</p>
                      <span className="text-sm text-blue-600 capitalize">
                        {service.category.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              {client.photos.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Work Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {client.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Work ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {client.testimonials.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Testimonials</h3>
                  <div className="space-y-4">
                    {client.testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border-l-4 border-green-500 pl-4">
                        <p className="italic text-gray-700">"{testimonial.content}"</p>
                        <p className="text-sm text-gray-500 mt-2">
                          - {testimonial.clientName}, {testimonial.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {client.reviews.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                  <div className="space-y-4">
                    {client.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{review.reviewerName}</span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                        <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {client.contactInfo.email}</p>
                  <p><strong>Phone:</strong> {client.contactInfo.phone}</p>
                  <p><strong>Address:</strong> {client.contactInfo.address}</p>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Availability</h3>
                <p>{client.availability}</p>
              </div>

              {/* Education */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Education & Qualifications</h3>
                <p>{client.education}</p>
              </div>

              {/* Job Documents */}
              {client.services.some(service => service.category === 'passive-job-seeking') && client.jobDocuments && (client.jobDocuments.cv || client.jobDocuments.applicationLetter || client.jobDocuments.cvFile || client.jobDocuments.applicationLetterFile) && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Job Documents</h3>
                  <div className="space-y-2">
                    {client.jobDocuments.cv && (
                      <p>
                        <strong>CV/Resume:</strong>{' '}
                        <a
                          href={client.jobDocuments.cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Download CV
                        </a>
                      </p>
                    )}
                    {client.jobDocuments.cvFile && (
                      <p>
                        <strong>CV/Resume File:</strong>{' '}
                        <span className="text-gray-700">{client.jobDocuments.cvFile}</span>
                      </p>
                    )}
                    {client.jobDocuments.applicationLetter && (
                      <p>
                        <strong>Application Letter:</strong>{' '}
                        <a
                          href={client.jobDocuments.applicationLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Download Application Letter
                        </a>
                      </p>
                    )}
                    {client.jobDocuments.applicationLetterFile && (
                      <p>
                        <strong>Application Letter File:</strong>{' '}
                        <span className="text-gray-700">{client.jobDocuments.applicationLetterFile}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
