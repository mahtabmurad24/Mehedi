import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@mehedimath.com' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('mehedi@dmin', 12);

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@mehedimath.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      { message: 'Admin user created successfully', admin },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}