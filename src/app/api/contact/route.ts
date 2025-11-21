import { NextRequest, NextResponse } from 'next/server';
import { ContactRequest } from '@/types';

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

    // In a real application, you would send an email here
    // For now, we'll just log the contact request
    console.log('Contact request received:', {
      clientId: body.clientId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      message: body.message,
      timestamp: new Date().toISOString(),
    });

    // You could also store this in a database or send via email service

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
