import { NextResponse } from 'next/server';
import { getVenues } from '@/lib/queries';

export async function GET(request) {
  const town = request.nextUrl.searchParams.get('town');
  try {
    const venues = await getVenues(town);
    return NextResponse.json(venues);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
