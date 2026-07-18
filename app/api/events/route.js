import { NextResponse } from 'next/server';
import { getEventsForWeek } from '@/lib/queries';

// GET /api/events?week=2026-07-13&town=madeira-beach
// `week` should be the Monday of the week you want. `town` is optional.
export async function GET(request) {
  const week = request.nextUrl.searchParams.get('week');
  const town = request.nextUrl.searchParams.get('town');

  if (!week) {
    return NextResponse.json({ error: 'week is required, e.g. ?week=2026-07-13' }, { status: 400 });
  }

  try {
    const events = await getEventsForWeek(week, town);
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
