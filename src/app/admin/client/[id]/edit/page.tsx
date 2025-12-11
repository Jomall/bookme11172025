'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Client, Service, ServiceCategory, Testimonial, Review } from '@/types';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<{
    name: string;
    companyName: string;
    profilePhoto: string;
    skills: string;
    services: { id: string; name: string; description: string; category: ServiceCategory }[];
    contactInfo: { email: string; phone: string; address: string };
    testimonials: { id: string; content: string; clientName: string; date: string }[];
    reviews: { id: string; content: string; reviewerName: string; rating: number; date: string }[];
    photos: string[];
    videos: string[];
    availability: string;
    education: string;
    experience: string;
    rating: number;
    jobDocuments: { cv: string; applicationLetter: string; cvFile: string; applicationLetterFile: string };
    certificates: string[];
  }>({
    name: '',
    companyName: '',
    profilePhoto: '',
    skills: '',
    services: [{ id: '', name: '', description: '', category: 'industrial-services' as ServiceCategory }],
    contactInfo: { email: '', phone: '', address: '' },
    testimonials: [{ id: '', content: '', clientName: '', date: '' }],
    reviews: [{ id: '', content: '', reviewerName: '', rating: 5, date: '' }],
    photos: [''],
    videos: [''],
    availability: '',
    education: '',
    experience: '',
    rating: 5,
    jobDocuments: { cv: '', applicationLetter: '', cvFile: '', applicationLetterFile: '' },
    certificates: [],
  });

  useEffect(() => {
    const loadClient = async () => {
      try {
        const p = await params;
        const response = await fetch(`/api/clients?id=${p.id}`);
        if (response.ok) {
          const client: Client = await response.json();
          setFormData({
            name: client.name || '',
            companyName: client.companyName || '',
            profilePhoto: client.profilePhoto || '',
            skills: Array.isArray(client.skills) ? client.skills.join(', ') : '',
            services: (client.services && Array.isArray(client.services) && client.services.length > 0) ? client.services : [{ id: '', name: '', description: '', category: 'industrial-services' as ServiceCategory }],
            contactInfo: client.contactInfo || { email: '', phone: '', address: '' },
            testimonials: (client.testimonials && Array.isArray(client.testimonials) && client.testimonials.length > 0) ? client.testimonials : [{ id: '', content: '', clientName: '', date: '' }],
            reviews: (client.reviews && Array.isArray(client.reviews) && client.reviews.length > 0) ? client.reviews : [{ id: '', content: '', reviewerName: '', rating: 5, date: '' }],
            photos: (client.photos && Array.isArray(client.photos) && client.photos.length > 0) ? client.photos : [''],
            videos: (client.videos && Array.isArray(client.videos) && client.videos.length > 0) ? client.videos : [''],
            availability: Array.isArray(client.availability) ? client.availability.map(slot => `${slot.day}: ${slot.startTime}-${slot.endTime}`).join('\n') : '',
            education: client.education || '',
            experience: client.experience || '',
            rating: client.rating || 5,
            jobDocuments: client.jobDocuments || { cv: '', applicationLetter: '', cvFile: '', applicationLetterFile: '' },
            certificates: client.certificates || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch client:', error);
      } finally {
        setFetchLoading(false);
      }
    };
    loadClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert blob URLs to base64 for photos
      const processedPhotos = await Promise.all(
        formData.photos.filter(photo => photo.trim()).map(async (photo) => {
          if (photo.startsWith('blob:')) {
            try {
              const response = await fetch(photo);
              const blob = await response.blob();
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error('Failed to convert blob to base64:', error);
              return photo; // Keep original if conversion fails
            }
          }
          return photo;
        })
      );

      // Convert blob URL to base64 for profile photo
      let processedProfilePhoto = formData.profilePhoto;
      if (formData.profilePhoto && formData.profilePhoto.startsWith('blob:')) {
        try {
          const response = await fetch(formData.profilePhoto);
          const blob = await response.blob();
          processedProfilePhoto = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Failed to convert profile photo blob to base64:', error);
        }
      }

      const clientData: Client = {
        id: params.id as string,
        name: formData.name,
        companyName: formData.companyName || undefined,
        profilePhoto: processedProfilePhoto,
        skills: formData.skills ? String(formData.skills).split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        services: (formData.services || []).filter(service => service.name && service.name.trim()).map(service => ({
          id: service.id || Math.random().toString(36).substr(2, 9),
          name: service.name,
          category: service.category,
          description: service.description,
        })),
        contactInfo: formData.contactInfo,
        testimonials: formData.testimonials.filter(testimonial => testimonial.content.trim()).map(testimonial => ({
          id: testimonial.id || Math.random().toString(36).substr(2, 9),
          clientName: testimonial.clientName,
          content: testimonial.content,
          date: testimonial.date,
        })),
        reviews: formData.reviews.filter(review => review.content.trim()).map(review => ({
          id: review.id || Math.random().toString(36).substr(2, 9),
          reviewerName: review.reviewerName,
          rating: review.rating,
          content: review.content,
          date: review.date,
        })),
        photos: processedPhotos,
        videos: formData.videos.filter(video => video.trim()),
        availability: (String(formData.availability || '')).split('\n').map(line => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          const [day, times] = trimmed.split(': ');
          if (!day || !times) return null;
          const [startTime, endTime] = times.split('-');
          if (!startTime || !endTime) return null;
          return { day: day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', startTime, endTime };
        }).filter((slot): slot is { day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', startTime: string, endTime: string } => slot !== null),
        education: formData.education,
        experience: formData.experience,
        rating: formData.rating,
        certificates: formData.certificates,
        jobDocuments: formData.services.some(service => service.category === 'passive-job-seeking') ? {
          cv: formData.jobDocuments.cv,
          applicationLetter: formData.jobDocuments.applicationLetter,
          cvFile: formData.jobDocuments.cvFile,
          applicationLetterFile: formData.jobDocuments.applicationLetterFile,
        } : undefined,
      };

      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client');
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { id: '', name: '', description: '', category: 'industrial-services' as ServiceCategory }],
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
      testimonials: [...formData.testimonials, { id: '', content: '', clientName: '', date: '' }],
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
      reviews: [...formData.reviews, { id: '', content: '', reviewerName: '', rating: 5, date: '' }],
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

  const addVideo = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, ''],
    });
  };

  const updateVideo = (index: number, value: string) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = value;
    setFormData({ ...formData, videos: updatedVideos });
  };

  const removeVideo = (index: number) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  if (fetchLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading client data...</div>;
  }

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
            <h2 className="text-2xl font-bold text-gray-900">Edit Client</h2>
            <p className="text-gray-600">Update the client profile information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700">Or Upload Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData({ ...formData, profilePhoto: e.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.profilePhoto && formData.profilePhoto.startsWith('data:') && (
                    <img src={formData.profilePhoto} alt="Profile Preview" className="mt-2 w-20 h-20 object-cover rounded-md" />
                  )}
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
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
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
            </div>

            {/* Services */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Services</h3>
                <button
                  type="button"
                  onClick={addService}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
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
            {formData.services.some(service => service.category === 'passive-job-seeking') && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Documents</h3>
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
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <textarea
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
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
                  <label className="block text-sm font-medium text-gray-700">Certificates</label>
                  <textarea
                    value={formData.certificates.join('\n')}
                    onChange={(e) => setFormData({ ...formData, certificates: e.target.value.split('\n').filter(cert => cert.trim()) })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Certificate 1\nCertificate 2\nCertificate 3"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
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
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
                <button
                  type="button"
                  onClick={addReview}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
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
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Work Photos</h3>
                <button
                  type="button"
                  onClick={addPhoto}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  Add Photo
                </button>
              </div>
              <div className="space-y-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Upload Photo {index + 1}</label>
                        <input
                          type="file"
                          accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const updatedPhotos = [...formData.photos];
                              updatedPhotos[index] = reader.result as string;
                              setFormData({ ...formData, photos: updatedPhotos });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Work Videos</h3>
                <button
                  type="button"
                  onClick={addVideo}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  Add Video
                </button>
              </div>
              <div className="space-y-4">
                {formData.videos.map((video, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Video URL {index + 1}</label>
                        <input
                          type="url"
                          value={video}
                          onChange={(e) => updateVideo(index, e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="mt-6 text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
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
                {loading ? 'Updating...' : 'Update Client'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
