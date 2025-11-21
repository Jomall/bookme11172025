import { NextRequest, NextResponse } from 'next/server';
import { ContactRequest } from '@/types';

// In-memory storage for contact requests
let contactRequests: ContactRequest[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    // Validate required fields
    if (!body.clientId || !body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the contact request in memory
    const contactWithTimestamp = {
      ...body,
      timestamp: new Date().toISOString(),
    };
    contactRequests.push(contactWithTimestamp);

    // Log the contact request
    console.log('Contact request received:', contactWithTimestamp);

    return NextResponse.json(
      { message: 'Contact request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
