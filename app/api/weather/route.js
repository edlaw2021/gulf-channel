import { NextResponse } from 'next/server';
import { getWeatherCache } from '@/lib/queries';

// Always reads from our own cache table — never calls NOAA/a weather API
// directly on a page load. See lib/weatherJob.js for what fills this table.
export async function GET() {
  try {
    const rows = await getWeatherCache();
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
