import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const sessionCookie = request.cookies.get('user-session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userSession = JSON.parse(sessionCookie.value);

    const requests = await db.access_requests.findMany({
      where: { userId: userSession.id },
      include: {
        courses: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get user access requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}