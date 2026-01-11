import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Delete existing admin user if exists
    await db.users.deleteMany({
      where: { email: 'admin@mehedimath.com' }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('mehedi@dmin', 12);

    // Create admin user
    const admin = await db.users.create({
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
      { message: 'Admin user recreated successfully', admin },
      { status: 201 }
    );
  } catch (error) {
    console.error('Recreate admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}