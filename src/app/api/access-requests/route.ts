import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (userId) {
      // Get requests for a specific user
      const requests = await db.access_requests.findMany({
        where: { userId },
        include: {
          courses: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ requests });
    } else if (courseId) {
      // Get requests for a specific course
      const requests = await db.access_requests.findMany({
        where: { courseId },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          courses: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({ requests });
    } else {
      // Get all requests (for admin)
      const requests = await db.access_requests.findMany({
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          courses: true
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
    const existingRequest = await db.access_requests.findFirst({
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

    const accessRequest = await db.access_requests.create({
      data: {
        userId: userSession.id,
        courseId,
        message
      },
      include: {
        courses: true
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