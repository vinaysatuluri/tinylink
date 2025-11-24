import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Define the Params type as a Promise (Next.js 15/16 Requirement)
type Props = {
  params: Promise<{ code: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: Props
) {
  // 2. Await the params before using them
  const { code } = await params;

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
  { params }: Props
) {
  // 3. Await the params here too
  const { code } = await params;

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