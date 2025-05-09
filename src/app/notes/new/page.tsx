'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { fetcher } from '@/lib/api';
import { NoteEditor } from '@/components/NoteEditor';
import { Note } from '@/lib/types';

export default function NewNotePage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleSave = async ({
    title,
    content,
    tags,
  }: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    const token = await getToken();
    if (!token) return;
    const note = await fetcher<Note>(
      '/notes',
      token,
      {
        method: 'POST',
        body: JSON.stringify({ title, content, tags }),
      }
    );
    router.push(`/notes/${note.id}`);
  };

  return <NoteEditor onSave={handleSave} />;
}
