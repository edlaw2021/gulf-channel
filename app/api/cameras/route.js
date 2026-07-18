import { NextResponse } from 'next/server';
import { getCameras } from '@/lib/queries';

export async function GET(request) {
  const town = request.nextUrl.searchParams.get('town');
  try {
    const cameras = await getCameras(town);
    return NextResponse.json(cameras);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
