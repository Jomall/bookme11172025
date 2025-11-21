import fs from 'fs';
import path from 'path';
import { Client } from '@/types';

const dataPath = path.join(process.cwd(), 'data', 'clients.json');

// In-memory storage for clients
let clientsData: Client[] = [];

// Load initial data from file if available
try {
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  clientsData = JSON.parse(fileContents);
} catch (error) {
  console.error('Error loading initial clients data:', error);
  clientsData = [];
}

export function getClients(): Client[] {
  return [...clientsData]; // Return a copy to prevent external mutation
}

export function saveClients(clients: Client[]): void {
  // In Vercel, we can't write to file system, so we just update in-memory
  clientsData = [...clients];
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
