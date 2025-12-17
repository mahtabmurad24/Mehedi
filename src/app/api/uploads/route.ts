import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename parameter required' }, { status: 400 });
    }

    // Security check - only allow certain file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Read the file from uploads directory
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const contentType = extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' :
                       extension === '.png' ? 'image/png' :
                       extension === '.gif' ? 'image/gif' :
                       'image/webp';

    // Return the file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}