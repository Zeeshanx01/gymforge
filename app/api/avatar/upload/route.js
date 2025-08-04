// app/api/avatar/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const blob = await put(
    request.headers.get('x-filename') || 'avatar.jpg',
    request.body,
    {
      access: 'public',
      addRandomSuffix: true,
    }
  );
  return NextResponse.json(blob);
}
