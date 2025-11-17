import fs from 'fs';
import path from 'path';
import { Client } from '@/types';

const dataPath = path.join(process.cwd(), 'data', 'clients.json');

export function getClients(): Client[] {
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading clients data:', error);
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(clients, null, 2));
  } catch (error) {
    console.error('Error saving clients data:', error);
  }
}

export function getClientById(id: string): Client | undefined {
  const clients = getClients();
  return clients.find(client => client.id === id);
}

export function addClient(client: Client): void {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
}

export function updateClient(updatedClient: Client): void {
  const clients = getClients();
  const index = clients.findIndex(client => client.id === updatedClient.id);
  if (index !== -1) {
    clients[index] = updatedClient;
    saveClients(clients);
  }
}

export function deleteClient(id: string): void {
  const clients = getClients();
  const filteredClients = clients.filter(client => client.id !== id);
  saveClients(filteredClients);
}
