// app/[code]/page.tsx
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ code: string }>; // <--- Type changed to Promise
}

export default async function RedirectPage({ params }: Props) {
  // 1. Await the params (CRITICAL FIX FOR NEXT.JS 15/16)
  const { code } = await params;

  // 2. Find the link
  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    notFound();
  }

  // 3. Track click
  await prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  redirect(link.originalUrl);
}