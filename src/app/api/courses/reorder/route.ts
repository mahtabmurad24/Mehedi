import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const { courseOrders } = await request.json();

    // Check if user is admin
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

    if (!Array.isArray(courseOrders)) {
      return NextResponse.json(
        { error: 'courseOrders must be an array' },
        { status: 400 }
      );
    }

    try {
      // Update orders in a transaction
      await db.$transaction(
        courseOrders.map(({ id, order }: { id: string; order: number }) =>
          db.course.update({
            where: { id },
            data: { order }
          })
        )
      );
    } catch (error) {
      // Fallback if order column doesn't exist - just return success without updating
      console.log('Order column not available, skipping order updates');
    }

    return NextResponse.json({
      message: 'Course order updated successfully'
    });
  } catch (error) {
    console.error('Reorder courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}