'use client';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/time-tracking', label: 'Time Tracking', icon: '⏱️' },
  { href: '/clients', label: 'Clients', icon: '👥' },
  { href: '/reports', label: 'Reports', icon: '📈' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { if (!loading && !token) router.push('/login'); }, [token, loading, router]);

  if (loading || !token) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold mb-8 px-2">TimeFlow AI</h1>
        <nav className="space-y-1">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>{item.icon}</span> {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}