import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminNote } = await request.json();
    
    // Get user from session
    const sessionCookie = request.cookies.get('user-session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userSession = JSON.parse(sessionCookie.value);

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userSession.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const accessRequest = await db.accessRequest.update({
      where: { id: params.id },
      data: {
        status,
        adminNote
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        course: true
      }
    });

    return NextResponse.json({
      message: 'Access request updated successfully',
      accessRequest
    });
  } catch (error) {
    console.error('Update access request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}