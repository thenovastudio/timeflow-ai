'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SettingsPage() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams?.get('success');

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/subscription`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(d => { setSubscription(d); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  const handleUpgrade = async (plan: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handlePortal = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/portal`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      {success === 'true' && <div className="p-4 bg-green-50 text-green-600 rounded-lg">Subscription updated successfully!</div>}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        <p className="text-gray-600">{user?.name}</p>
        <p className="text-gray-500">{user?.email}</p>
        <button onClick={logout} className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">Sign Out</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Subscription</h2>
        <p className="text-gray-600 mb-4">Current plan: <span className="font-medium capitalize">{subscription?.plan || 'free'}</span></p>
        {subscription?.plan === 'free' ? (
          <div className="space-y-3">
            <button onClick={() => handleUpgrade('pro')} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Upgrade to Pro ($12/mo)</button>
            <button onClick={() => handleUpgrade('business')} className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Upgrade to Business ($29/mo)</button>
          </div>
        ) : (
          <button onClick={handlePortal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Manage Subscription</button>
        )}
      </div>
    </div>
  );
}