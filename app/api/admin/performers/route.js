import { NextResponse } from 'next/server';
import { getPerformers, addPerformer } from '@/lib/queries';

function isAuthorized(request) {
  const provided = request.headers.get('x-admin-password');
  return provided && provided === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const performers = await getPerformers();
    return NextResponse.json(performers);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { name, actType } = body;
  if (!name || !actType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const performer = await addPerformer({ name, actType });
    return NextResponse.json(performer, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
