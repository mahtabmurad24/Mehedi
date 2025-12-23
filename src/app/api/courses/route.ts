import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let courses;
    try {
      courses = await db.courses.findMany({
        skip: offset,
        take: limit,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      // If any course has order = 0, set initial order values based on createdAt
      const hasZeroOrder = courses.some(c => (c.order || 0) === 0);
      if (hasZeroOrder && courses.length > 0) {
        const allCourses = await db.courses.findMany({
          orderBy: { createdAt: 'asc' }
        });
        await db.$transaction(
          allCourses.map((course, index) =>
            db.courses.update({
              where: { id: course.id },
              data: { order: index + 1 }
            })
          )
        );
        // Refetch with updated order
        courses = await db.courses.findMany({
          skip: offset,
          take: limit,
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
          ]
        });
      }
    } catch (error) {
      // Fallback if order column doesn't exist
      courses = await db.courses.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
    }

    const total = await db.courses.count();

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, bannerImage, pageLink } = await request.json();

    if (!title || !description || !bannerImage || !pageLink) {
      return NextResponse.json(
        { error: 'All fields are required: title, description, bannerImage, pageLink' },
        { status: 400 }
      );
    }

    // Get the current max order to assign the next order
    const maxOrderResult = await db.courses.aggregate({
      _max: {
        order: true
      }
    });
    const nextOrder = (maxOrderResult._max.order || 0) + 1;

    const course = await db.courses.create({
      data: {
        title,
        description,
        bannerImage,
        pageLink,
        order: nextOrder
      }
    });

    return NextResponse.json(
      { message: 'Course created successfully', course },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}