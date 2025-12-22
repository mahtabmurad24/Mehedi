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
      courses = await db.course.findMany({
        skip: offset,
        take: limit,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });
    } catch (error) {
      // Fallback if order column doesn't exist
      courses = await db.course.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
    }

    const total = await db.course.count();

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

    const course = await db.course.create({
      data: {
        title,
        description,
        bannerImage,
        pageLink
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