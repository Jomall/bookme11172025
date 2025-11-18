import { NextRequest, NextResponse } from 'next/server';
import { getClients, addClient, updateClient, deleteClient } from '@/lib/data';
import { Client } from '@/types';

export async function GET() {
  try {
    const clients = getClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData: Omit<Client, 'id'> = await request.json();
    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      ...clientData,
    };
    addClient(client);
    return NextResponse.json({ message: 'Client added successfully', id: client.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add client' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client: Client = await request.json();
    updateClient(client);
    return NextResponse.json({ message: 'Client updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }
    deleteClient(id);
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
