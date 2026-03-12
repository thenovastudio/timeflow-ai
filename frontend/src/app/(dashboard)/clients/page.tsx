'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function ClientsPage() {
  const { token } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', hourlyRate: '' });

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(data => { setClients(data); setLoading(false); });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null })
    });
    if (res.ok) { setClients([...clients, await res.json()]); setShowForm(false); setForm({ name: '', email: '', hourlyRate: '' }); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Add Client'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <input type="text" placeholder="Client name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Hourly rate (optional)" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} className="w-full p-2 border rounded" step="0.01" />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Client</button>
        </form>
      )}
      <div className="grid gap-4">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-gray-500">{client.email || 'No email'}</p>
            <p className="text-sm text-gray-500 mt-1">Rate: ${client.hourlyRate || 'Not set'}/hr</p>
          </div>
        ))}
        {clients.length === 0 && <p className="text-gray-500 text-center py-8">No clients yet</p>}
      </div>
    </div>
  );
}