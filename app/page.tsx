import { prisma } from '@/lib/prisma';
import CreateLinkForm from '@/components/CreateLinkForm';
import LinkTable from '@/components/LinkTable';

export const dynamic = 'force-dynamic'; // Ensures the list is always fresh

export default async function Home() {
  // Fetch links on the server (Server Component)
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans text-gray-900">
      <main className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TinyLink</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-500 font-medium">System Operational</span>
          </div>
        </header>

        {/* Create Link Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <CreateLinkForm />
          </div>

          {/* List Links Section */}
          <div className="md:col-span-2">
             <LinkTable links={links} />
          </div>
        </div>
      </main>
    </div>
  );
}