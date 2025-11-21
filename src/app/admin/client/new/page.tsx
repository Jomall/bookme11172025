'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Client, Service, ServiceCategory, Testimonial, Review } from '@/types';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    companyName: string;
    profilePhoto: string;
    skills: string;
    services: { id: string; name: string; description: string; category: ServiceCategory }[];
    contactInfo: { email: string; phone: string; address: string; website: string };
    testimonials: { id: string; content: string; clientName: string; date: string }[];
    reviews: { id: string; content: string; reviewerName: string; rating: number; date: string }[];
    photos: string[];
    availability: { day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'; startTime: string; endTime: string }[];
    education: string;
    experience: string;
    rating: number;
    certificates: string[];
    priceRange: { min: number; max: number };
    jobDocuments: { cv: string; applicationLetter: string; cvFile: string; applicationLetterFile: string };
  }>({
    name: '',
    companyName: '',
    profilePhoto: '',
    skills: '',
    services: [{ id: '', name: '', description: '', category: 'industrial-services' as ServiceCategory }],
    contactInfo: { email: '', phone: '', address: '', website: '' },
    testimonials: [{ id: '', content: '', clientName: '', date: '' }],
    reviews: [{ id: '', content: '', reviewerName: '', rating: 5, date: '' }],
    photos: [],
    availability: [{ day: 'monday' as const, startTime: '', endTime: '' }],
    education: '',
    experience: '',
    rating: 5,
    certificates: [''],
    priceRange: { min: 0, max: 0 },
    jobDocuments: { cv: '', applicationLetter: '', cvFile: '', applicationLetterFile: '' },
  });

  const hasJobSeekingService = formData.services.some(service => service.category === 'passive-job-seeking');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clientData: Omit<Client, 'id'> = {
        name: formData.name,
        companyName: formData.companyName || undefined,
        profilePhoto: formData.profilePhoto,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        services: formData.services.filter(service => service.name.trim()).map(service => ({
          id: Math.random().toString(36).substr(2, 9),
          name: service.name,
          category: service.category,
          description: service.description,
        })),
        contactInfo: formData.contactInfo,
        testimonials: formData.testimonials.filter(testimonial => testimonial.content.trim()).map(testimonial => ({
          id: Math.random().toString(36).substr(2, 9),
          clientName: testimonial.clientName,
          content: testimonial.content,
          date: testimonial.date,
        })),
        reviews: formData.reviews.filter(review => review.content.trim()).map(review => ({
          id: Math.random().toString(36).substr(2, 9),
          reviewerName: review.reviewerName,
          rating: review.rating,
          content: review.content,
          date: review.date,
        })),
        photos: formData.photos.filter(photo => photo.trim()),
        availability: formData.availability.filter(slot => slot.day && slot.startTime && slot.endTime),
        education: formData.education,
        experience: formData.experience,
        rating: formData.rating,
        certificates: formData.certificates.filter(certificate => certificate.trim()),
        priceRange: formData.priceRange.min > 0 || formData.priceRange.max > 0 ? formData.priceRange : undefined,

        jobDocuments: hasJobSeekingService ? {
          cv: formData.jobDocuments.cv,
          applicationLetter: formData.jobDocuments.applicationLetter,
          cvFile: formData.jobDocuments.cvFile,
          applicationLetterFile: formData.jobDocuments.applicationLetterFile,
        } : undefined,
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error creating client');
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: '', description: '', category: 'industrial-services' as ServiceCategory }],
    });
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData({ ...formData, services: updatedServices });
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { content: '', clientName: '', date: '' }],
    });
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    setFormData({ ...formData, testimonials: updatedTestimonials });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index),
    });
  };

  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [...formData.reviews, { content: '', reviewerName: '', rating: 5, date: '' }],
    });
  };

  const updateReview = (index: number, field: keyof Review, value: string | number) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews[index] = { ...updatedReviews[index], [field]: value };
    setFormData({ ...formData, reviews: updatedReviews });
  };

  const removeReview = (index: number) => {
    setFormData({
      ...formData,
      reviews: formData.reviews.filter((_, i) => i !== index),
    });
  };

  const addPhoto = () => {
    setFormData({
      ...formData,
      photos: [...formData.photos, ''],
    });
  };

  const updatePhoto = (index: number, value: string) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index] = value;
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">BookME Admin</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Client</h2>
            <p className="text-gray-600">Create a new client profile with all portfolio information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
                  <input
                    type="url"
                    value={formData.profilePhoto}
                    onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Or Upload Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, profilePhoto: URL.createObjectURL(file) });
                      }
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target?.value || '5') })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Skill 1, Skill 2, Skill 3"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={formData.contactInfo.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, address: e.target.value }
                  })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.contactInfo.website}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, website: e.target.value }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Services */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2">Services</h3>
                <button
                  type="button"
                  onClick={addService}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md"
                >
                  Add Service
                </button>
              </div>
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium">Service {index + 1}</h4>
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Service Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={service.category}
                          onChange={(e) => updateService(index, 'category', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="industrial-services">Industrial Services</option>
                          <option value="manufacturing-production">Manufacturing and Production</option>
                          <option value="construction-building">Construction and Building</option>
                          <option value="energy-utilities">Energy and Utilities</option>
                          <option value="mining-extraction">Mining and Extraction</option>
                          <option value="transportation-logistics">Transportation and Logistics</option>
                          <option value="chemical-pharmaceutical">Chemical and Pharmaceutical</option>
                          <option value="food-beverage">Food and Beverage</option>
                          <option value="other-specialized-industrial">Other Specialized Industrial Roles</option>
                          <option value="ride-share">Ride Share</option>
                          <option value="food-catering">Food Catering</option>
                          <option value="party-planner">Party Planner</option>
                          <option value="house-cleaner">House Cleaner</option>
                          <option value="car-washing">Car Washing</option>
                          <option value="passive-job-seeking">Passive Job Seeking</option>
                          <option value="barber-hairdresser">Barber/Hairdresser</option>
                          <option value="nail-tech">Nail Tech</option>
                          <option value="doctor">Doctor</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="landscaper">Landscaper</option>
                          <option value="taxi">Taxi</option>
                          <option value="dentist">Dentist</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Documents */}
            {hasJobSeekingService && (
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">Job Documents</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CV/Resume URL</label>
                    <input
                      type="url"
                      value={formData.jobDocuments.cv}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobDocuments: { ...formData.jobDocuments, cv: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://example.com/cv.pdf"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CV/Resume File</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            jobDocuments: { ...formData.jobDocuments, cvFile: file.name }
                          });
                        }
                      }}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Letter URL</label>
                    <input
                      type="url"
                      value={formData.jobDocuments.applicationLetter}
                      onChange={(e) => setFormData({
                        ...formData,
                        jobDocuments: { ...formData.jobDocuments, applicationLetter: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://example.com/application-letter.pdf"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Letter File</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            jobDocuments: { ...formData.jobDocuments, applicationLetterFile: file.name }
                          });
                        }
                      }}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">Additional Information</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Availability</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availability: [...formData.availability, { day: 'monday' as const, startTime: '', endTime: '' }] })}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                    >
                      Add Time Slot
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.availability.map((slot, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="text-sm font-medium">Time Slot {index + 1}</h5>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              availability: formData.availability.filter((_, i) => i !== index)
                            })}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Day</label>
                            <select
                              value={slot.day}
                              onChange={(e) => {
                                const updatedAvailability = [...formData.availability];
                                updatedAvailability[index] = { ...updatedAvailability[index], day: e.target.value as typeof slot.day };
                                setFormData({ ...formData, availability: updatedAvailability });
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="monday">Monday</option>
                              <option value="tuesday">Tuesday</option>
                              <option value="wednesday">Wednesday</option>
                              <option value="thursday">Thursday</option>
                              <option value="friday">Friday</option>
                              <option value="saturday">Saturday</option>
                              <option value="sunday">Sunday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => {
                                const updatedAvailability = [...formData.availability];
                                updatedAvailability[index] = { ...updatedAvailability[index], startTime: e.target.value };
                                setFormData({ ...formData, availability: updatedAvailability });
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => {
                                const updatedAvailability = [...formData.availability];
                                updatedAvailability[index] = { ...updatedAvailability[index], endTime: e.target.value };
                                setFormData({ ...formData, availability: updatedAvailability });
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education & Qualifications</label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range (Min - Max)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={formData.priceRange.min}
                      onChange={(e) => setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, min: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={formData.priceRange.max}
                      onChange={(e) => setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, max: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Certificates</h4>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, certificates: [...formData.certificates, ''] })}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                    >
                      Add Certificate
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.certificates.map((certificate, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Certificate URL {index + 1}</label>
                            <input
                              type="url"
                              value={certificate}
                              onChange={(e) => {
                                const updatedCertificates = [...formData.certificates];
                                updatedCertificates[index] = e.target.value;
                                setFormData({ ...formData, certificates: updatedCertificates });
                              }}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="https://example.com/certificate.pdf"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              certificates: formData.certificates.filter((_, i) => i !== index)
                            })}
                            className="mt-6 text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Or Upload Certificate {index + 1}</label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const updatedCertificates = [...formData.certificates];
                                updatedCertificates[index] = URL.createObjectURL(file);
                                setFormData({ ...formData, certificates: updatedCertificates });
                              }
                            }}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2">Testimonials</h3>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md"
                >
                  Add Testimonial
                </button>
              </div>
              <div className="space-y-4">
                {formData.testimonials.map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium">Testimonial {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input
                          type="text"
                          value={testimonial.clientName}
                          onChange={(e) => updateTestimonial(index, 'clientName', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          value={testimonial.date}
                          onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2">Reviews</h3>
                <button
                  type="button"
                  onClick={addReview}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md"
                >
                  Add Review
                </button>
              </div>
              <div className="space-y-4">
                {formData.reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium">Review {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeReview(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reviewer Name</label>
                        <input
                          type="text"
                          value={review.reviewerName}
                          onChange={(e) => updateReview(index, 'reviewerName', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={review.rating}
                          onChange={(e) => updateReview(index, 'rating', parseInt(e.target.value))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          value={review.date}
                          onChange={(e) => updateReview(index, 'date', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        value={review.content}
                        onChange={(e) => updateReview(index, 'content', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2">Work Photos</h3>
                <button
                  type="button"
                  onClick={addPhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md"
                >
                  Add Photo
                </button>
              </div>
              <div className="space-y-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Photo URL {index + 1}</label>
                        <input
                          type="url"
                          value={photo}
                          onChange={(e) => updatePhoto(index, e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="mt-6 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Or Upload Photo {index + 1}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const updatedPhotos = [...formData.photos];
                            updatedPhotos[index] = file.name;
                            setFormData({ ...formData, photos: updatedPhotos });
                          }
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
