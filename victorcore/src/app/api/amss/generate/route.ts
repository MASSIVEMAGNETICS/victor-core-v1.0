import { NextRequest, NextResponse } from 'next/server';

const VICTOR_CORE_URL = process.env.VICTOR_CORE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${VICTOR_CORE_URL}/amss/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Victor Core responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Error in proxying to Victor Core:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to Victor Core',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 502 } // Bad Gateway
    );
  }
}

export async function GET() {
  try {
    const res = await fetch(`${VICTOR_CORE_URL}/amss/stats`);

    if (!res.ok) {
      throw new Error(`Victor Core responded with status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in proxying to Victor Core:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to connect to Victor Core',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 502 } // Bad Gateway
    );
  }
}