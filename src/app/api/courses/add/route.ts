import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { title, description, bannerText, pageLink } = await request.json();

    if (!title || !description || !bannerText || !pageLink) {
      return NextResponse.json(
        { error: 'All fields are required: title, description, bannerText, pageLink' },
        { status: 400 }
      );
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        bannerText,
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