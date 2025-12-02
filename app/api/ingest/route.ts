import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Ingest received:', data);
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Data ingested',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ingest failed' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Ingest API ready',
    endpoint: '/api/ingest',
    method: 'POST'
  });
}
