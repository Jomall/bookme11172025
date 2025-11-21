'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client } from '@/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);

  // Get unique services
  const services = clients.flatMap(client => client.services);
  const uniqueServices = Array.from(
    new Set(services.map(service => service.name))
  ).map(serviceName => {
    const service = services.find(s => s.name === serviceName);
    return {
      name: serviceName,
      category: service?.category,
      href: `/services/${service?.category}`,
      color: getCategoryColor(service?.category),
    };
  });

  const categories = [
    { name: 'Industrial Services', href: '/services/industrial-services', color: 'bg-blue-500', category: 'industrial-services' },
    { name: 'Ride Share', href: '/services/ride-share', color: 'bg-green-500', category: 'ride-share' },
    { name: 'Food Catering', href: '/services/food-catering', color: 'bg-yellow-500', category: 'food-catering' },
    { name: 'Party Planner', href: '/services/party-planner', color: 'bg-purple-500', category: 'party-planner' },
    { name: 'House Cleaner', href: '/services/house-cleaner', color: 'bg-pink-500', category: 'house-cleaner' },
    { name: 'Car Washing', href: '/services/car-washing', color: 'bg-indigo-500', category: 'car-washing' },
    { name: 'Job Seeking', href: '/services/passive-job-seeking', color: 'bg-red-500', category: 'passive-job-seeking' },
  ];

  // Combine categories and services for search
  const allItems = [...categories, ...uniqueServices];

  const filteredItems = allItems.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">BookME</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                Client Management
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
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Find the Perfect Service Provider in St. Vincent and the Grenadines
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Discover skilled professionals offering a wide range of services
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for professionals by category or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${item.color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
              >
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-sm opacity-90">
                  {item.category ? 'Explore professionals offering this service' : 'Explore professionals in this category'}
                </p>
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try searching for a different category or service.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function getCategoryColor(category?: string): string {
  const colorMap: Record<string, string> = {
    'industrial-services': 'bg-blue-500',
    'ride-share': 'bg-green-500',
    'food-catering': 'bg-yellow-500',
    'party-planner': 'bg-purple-500',
    'house-cleaner': 'bg-pink-500',
    'car-washing': 'bg-indigo-500',
    'passive-job-seeking': 'bg-red-500',
    'manufacturing-production': 'bg-teal-500',
    'construction-building': 'bg-orange-500',
    'energy-utilities': 'bg-cyan-500',
    'mining-extraction': 'bg-stone-500',
    'transportation-logistics': 'bg-lime-500',
    'chemical-pharmaceutical': 'bg-violet-500',
    'food-beverage': 'bg-amber-500',
    'other-specialized-industrial': 'bg-slate-500',
    'barber-hairdresser': 'bg-rose-500',
    'nail-tech': 'bg-fuchsia-500',
    'doctor': 'bg-emerald-500',
    'lawyer': 'bg-sky-500',
    'landscaper': 'bg-green-600',
    'taxi': 'bg-yellow-600',
    'dentist': 'bg-blue-600',
  };
  return colorMap[category || ''] || 'bg-gray-500';
}
