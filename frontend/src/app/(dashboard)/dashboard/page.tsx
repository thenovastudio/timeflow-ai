'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import Timer from '@/components/Timer';

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => { setStats(data); setLoading(false); });
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}</h1>
      </div>

      <Timer />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-3xl font-bold">{stats?.today?.hours?.toFixed(1) || 0}h</p>
          <p className="text-sm text-gray-500">{stats?.today?.entries || 0} entries</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-3xl font-bold">{stats?.week?.hours?.toFixed(1) || 0}h</p>
          <p className="text-sm text-gray-500">${stats?.week?.earnings?.toFixed(2) || '0.00'} earned</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-3xl font-bold">{stats?.month?.hours?.toFixed(1) || 0}h</p>
          <p className="text-sm text-gray-500">${stats?.month?.earnings?.toFixed(2) || '0.00'} earned</p>
        </div>
      </div>

      {stats?.activeTimer && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <p className="text-indigo-600 font-medium">Timer running: {stats.activeTimer.description || 'No description'}</p>
        </div>
      )}
    </div>
  );
}