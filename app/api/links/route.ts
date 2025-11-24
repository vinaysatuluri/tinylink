import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateShortCode, isValidShortCode, isValidUrl } from '@/lib/utils';

// GET: List all links (for Dashboard)
export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(links);
}

// POST: Create a new link
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url, shortCode } = body;

    // 1. Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    // 2. Handle Short Code
    if (shortCode) {
      // User provided a custom code
      if (!isValidShortCode(shortCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters.' },
          { status: 422 }
        );
      }
      
      // Check for duplicates
      const existing = await prisma.link.findUnique({ where: { shortCode } });
      if (existing) {
        return NextResponse.json({ error: 'Short code already exists' }, { status: 409 });
      }
    } else {
      // Generate automatic code
      shortCode = generateShortCode();
    }

    // 3. Database Insertion
    try {
      const newLink = await prisma.link.create({
        data: {
          originalUrl: url,
          shortCode,
        },
      });
      return NextResponse.json(newLink, { status: 201 });
    } catch (error: any) {
      // Double safety: Catch Prisma unique constraint violation
      if (error.code === 'P2002') {
         return NextResponse.json({ error: 'Short code already exists' }, { status: 409 });
      }
      throw error;
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}