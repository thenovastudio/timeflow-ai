'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';

interface TimerProps { onUpdate?: () => void }

export default function Timer({ onUpdate }: TimerProps) {
  const { token } = useAuth();
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchActive();
    fetchProjects();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [token]);

  useEffect(() => {
    if (activeEntry) {
      intervalRef.current = setInterval(() => {
        setElapsed((Date.now() - new Date(activeEntry.startTime).getTime()) / 1000);
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeEntry]);

  const fetchActive = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time-entries/active`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data) { setActiveEntry(data); setSelectedProject(data.projectId || ''); setDescription(data.description || ''); }
  };

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?isActive=true`, { headers: { Authorization: `Bearer ${token}` } });
    setProjects(await res.json());
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time-entries`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId: selectedProject || null, description })
    });
    fetchActive();
    onUpdate?.();
  };

  const stopTimer = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time-entries/${activeEntry.id}/stop`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}` }
    });
    setActiveEntry(null);
    setElapsed(0);
    onUpdate?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-mono font-bold">{formatTime(elapsed)}</div>
        <div className="flex-1 space-y-2">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full p-2 border rounded" disabled={!!activeEntry}>
            <option value="">Select project...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="text" placeholder="What are you working on?" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" disabled={!!activeEntry} />
        </div>
        <button onClick={activeEntry ? stopTimer : startTimer} className={`px-6 py-3 rounded-lg font-medium ${activeEntry ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {activeEntry ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
}