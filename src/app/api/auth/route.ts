import { NextRequest, NextResponse } from 'next/server';

// Simple hardcoded admin credentials for demo purposes
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ message: 'Login successful', token: 'demo-token' });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
