import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get requests for a specific user
      const requests = await db.accessRequest.findMany({
        where: { userId },
        include: {
          course: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ requests });
    } else {
      // Get all requests (for admin)
      const requests = await db.accessRequest.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          course: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ requests });
    }
  } catch (error) {
    console.error('Get access requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId, message } = await request.json();
    
    // Get user from session
    const sessionCookie = request.cookies.get('user-session');
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userSession = JSON.parse(sessionCookie.value);

    // Check if request already exists
    const existingRequest = await db.accessRequest.findFirst({
      where: {
        userId: userSession.id,
        courseId
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      );
    }

    const accessRequest = await db.accessRequest.create({
      data: {
        userId: userSession.id,
        courseId,
        message
      },
      include: {
        course: true
      }
    });

    return NextResponse.json(
      { message: 'Access request created successfully', accessRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create access request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}