'use client'; // This is a Client Component (interactive)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Copy, Check, ArrowRight } from 'lucide-react';

export default function CreateLinkForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, shortCode: code || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Requirement: Handle 409 Conflict specifically
        if (res.status === 409) {
          setError('That custom code is already taken. Please try another.');
        } else {
          setError(data.error || 'Something went wrong.');
        }
        return;
      }

      // Success!
      setSuccess(`${window.location.origin}/${data.shortCode}`);
      setUrl('');
      setCode('');
      router.refresh(); // Refresh the list below automatically
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(success);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
          <input
            type="url"
            required
            placeholder="https://example.com/long-url"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="flex items-center">
            <span className="p-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm">
              /
            </span>
            <input
              type="text"
              placeholder="my-custom-link"
              pattern="[A-Za-z0-9]{6,8}"
              title="6-8 alphanumeric characters"
              className="w-full p-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated code.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>

        {/* States: Error & Success */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200 flex items-center justify-between">
            <div>
              <span className="font-semibold">Success!</span> Your link: <span className="underline">{success}</span>
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-1 hover:bg-green-100 rounded"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}