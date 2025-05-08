'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/api';
import { usePathname } from 'next/navigation';

interface Note {
  id: string;
  title: string;
}

export function NotesSidebar() {
  const { getToken } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [q, setQ] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await fetcher<Note[]>(`/notes?q=${encodeURIComponent(q)}`, token);
      setNotes(data);
    })();
  // ← now refetch whenever q _or_ the path changes
  }, [q, getToken, pathname]);

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search…"
          value={q}
          onChange={e => setQ(e.currentTarget.value)}
          className="flex-1"
        />
        <Link href="/notes/new">
          <Button variant="outline" className="p-3">+</Button>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-1">
        {notes.map(n => (
          <Link
            key={n.id}
            href={`/notes/${n.id}`}
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {n.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
