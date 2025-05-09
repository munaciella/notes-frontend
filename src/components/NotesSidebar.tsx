'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/api';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetTrigger,
  SheetOverlay,
  SheetContent,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useNotesRefresh } from '@/context/notes-refresh';

interface Note {
  id: string;
  title: string;
}

export function NotesSidebar() {
  const { getToken } = useAuth();
  const pathname = usePathname();
  const { refreshKey } = useNotesRefresh();
  const [notes, setNotes] = useState<Note[]>([]);
  const [q, setQ] = useState('');
  //const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await fetcher<Note[]>(
        `/notes?q=${encodeURIComponent(q)}`,
        token
      );
      setNotes(data);
    })();
  }, [q, getToken, pathname, refreshKey]);

  // Raw sidebar UI, without SheetClose wrappers
  const SidebarContent = (
    <div className="p-6 flex flex-col h-full bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4">My Notes</h2>
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          className="flex-1"
        />
        <Link href="/notes/new">
          <Button variant="outline" className="p-3">+</Button>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-1">
        {notes.map((n) => (
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

  return (
    <>
      {/* Mobile: hamburger → full-screen sheet */}
      <div className="md:hidden mt-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="m-2 p-2">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetOverlay className="fixed inset-0 bg-black/50 z-40" />
          <SheetContent side="left" className="w-full md:w-80 p-0 z-50">
            <div className="relative h-full">
              {/* Close button */}
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4"
                  aria-label="Close sidebar"
                >
                </Button>
              </SheetClose>
              {/* Search + New Note */}
              <div className="p-4 flex items-center gap-2">
                <h2 className="text-2xl font-semibold mb-4">My Notes</h2>
              </div>
              <div className="p-8 flex items-center gap-2">
                <Input
                  placeholder="Search…"
                  value={q}
                  onChange={(e) => setQ(e.currentTarget.value)}
                  className="flex-1"
                />
                <SheetClose asChild>
                  <Link href="/notes/new">
                    <Button variant="outline" className="p-3">+</Button>
                  </Link>
                </SheetClose>
              </div>
              {/* Notes list, each wrapped to close */}
              <nav className="p-6 flex-1 overflow-y-auto space-y-1">
                {notes.map((n) => (
                  <SheetClose asChild key={n.id}>
                    <Link
                      href={`/notes/${n.id}`}
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {n.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:flex md:w-80">{SidebarContent}</div>
    </>
  );
}
