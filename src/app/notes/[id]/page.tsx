'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';
import { fetcher } from '@/lib/api';
import { Note } from '@/lib/types';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function NoteDetailPage() {
  const { getToken } = useAuth();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
        if (!token) return;
      const data = await fetcher<Note>(`/notes/${id}`, token);
      setNote(data);
    })();
  }, [id, getToken]);

  if (!note) return <div>Loading…</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <div className="prose max-w-none border p-4 rounded">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
      <div className="italic text-gray-600">AI Summary: {note.summary}</div>
      <div className="space-x-1">
        {note.tags.map((t: string) => (
          <span key={t} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
