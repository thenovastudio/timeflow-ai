'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import Timer from '@/components/Timer';

export default function TimeTrackingPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/time-entries`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => { setEntries(data); setLoading(false); });
  }, [token]);

  const formatDuration = (hours: number) => hours?.toFixed(1) + 'h' || '0h';
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Time Tracking</h1>
      <Timer />
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr><th className="px-4 py-3 text-left text-sm font-medium">Date</th><th className="px-4 py-3 text-left text-sm font-medium">Project</th><th className="px-4 py-3 text-left text-sm font-medium">Description</th><th className="px-4 py-3 text-left text-sm font-medium">Duration</th></tr>
          </thead>
          <tbody>
            {entries.slice(0, 20).map(entry => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{formatDate(entry.startTime)}</td>
                <td className="px-4 py-3">{entry.project?.name || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{entry.description || '-'}</td>
                <td className="px-4 py-3 font-medium">{formatDuration(entry.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}