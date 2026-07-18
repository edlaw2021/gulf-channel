import { NextResponse } from 'next/server';
import { addEvent } from '@/lib/queries';

function isAuthorized(request) {
  const provided = request.headers.get('x-admin-password');
  return provided && provided === process.env.ADMIN_PASSWORD;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { venueId, performerId, date, startTime, endTime } = body;

  if (!venueId || !performerId || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const event = await addEvent({ venueId, performerId, date, startTime, endTime });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
