'use client';

import { useState, useEffect } from 'react';
import { Trash2, Copy, BarChart2, ExternalLink, RefreshCw, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Renamed to LinkData to avoid conflict with the <Link> component
interface LinkData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

export default function LinkTable({ links }: { links: LinkData[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Auto-Refresh every 5 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);
  // ------------------------------------

  async function handleDelete(shortCode: string, id: number) {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    setDeletingId(id);
    await fetch(`/api/links/${shortCode}`, { method: 'DELETE' });
    setDeletingId(null);
    router.refresh(); 
  }

  const copyToClipboard = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Copied!');
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-500">No links created yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-700">Your Links</h3>
        <button 
          onClick={handleManualRefresh}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating...' : 'Auto-updates every 5s'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Short Link</th>
              <th className="p-4 font-semibold text-gray-700">Original URL</th>
              <th className="p-4 font-semibold text-gray-700">Clicks</th>
              <th className="p-4 font-semibold text-gray-700">Created</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-blue-600">
                  <a href={`/${link.shortCode}`} target="_blank" className="flex items-center hover:underline">
                    /{link.shortCode} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </td>
                <td className="p-4 text-gray-600 max-w-[200px] truncate" title={link.originalUrl}>
                  {link.originalUrl}
                </td>
                <td className="p-4">
                  {/* Updated: Clicks are now a link to the Stats Page */}
                  <Link href={`/code/${link.shortCode}`} title="View Analytics">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-all duration-300">
                      <BarChart2 className="w-3 h-3 mr-1" />
                      {link.clicks}
                    </span>
                  </Link>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(link.createdAt).toLocaleDateString('en-US')}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  {/* NEW STATS BUTTON */}
                  <Link 
                    href={`/code/${link.shortCode}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition"
                    title="View Stats"
                  >
                    <PieChart className="h-4 w-4" />
                  </Link>
                  
                  <button 
                    onClick={() => copyToClipboard(link.shortCode)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                    title="Copy Link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(link.shortCode, link.id)}
                    disabled={deletingId === link.id}
                    className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-30"
                    title="Delete Link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}