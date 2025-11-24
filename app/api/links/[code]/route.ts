import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  try {
    await prisma.link.delete({
      where: { shortCode: code },
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}