// app/code/[code]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ExternalLink, BarChart2, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function StatsPage({ params }: Props) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Link Statistics</h1>

        <div className="space-y-6">
          
          {/* Short Link - FIXED: Changed div to 'a' tag */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Short Link</label>
            <a 
              href={`/${link.shortCode}`} 
              target="_blank" 
              className="flex items-center mt-1 text-blue-600 font-medium text-lg hover:underline cursor-pointer"
            >
              /{link.shortCode}
              <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
            </a>
          </div>

          {/* Original URL */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original Destination</label>
            <div className="mt-1 text-gray-700 break-all bg-gray-50 p-3 rounded-md border border-gray-100">
              {link.originalUrl}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
              <BarChart2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{link.clicks}</div>
              <div className="text-xs text-blue-600 font-medium uppercase">Total Clicks</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
              <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-700 mt-2">
                {new Date(link.createdAt).toLocaleDateString('en-US')}
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase mt-1">Created Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}