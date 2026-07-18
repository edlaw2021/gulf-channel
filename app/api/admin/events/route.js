import { NextResponse } from 'next/server';
import { addEvent } from '@/lib/queries';

// Minimal shared-password gate. Fine for "just me editing this," not real
// auth — swap for something like NextAuth before more than one person
// needs access, or before this is reachable from the public internet.
function isAuthorized(request) {
  const provided = request.headers.get('x-admin-password');
  return provided && provided === process.env.ADMIN_PASSWORD;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { venueId, date, startTime, endTime, performerName, actType } = body;

  if (!venueId || !date || !performerName || !actType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const event = await addEvent({ venueId, date, startTime, endTime, performerName, actType });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
