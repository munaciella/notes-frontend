'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';
import { fetcher } from '@/lib/api';
import { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { NoteEditor } from '@/components/NoteEditor';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function NoteDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarising, setSummarising] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Not signed in');
        const data = await fetcher<Note>(`/notes/${id}`, token);
        setNote(data);
      } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          toast.error('Failed to load note', { description: errorMessage, style: { backgroundColor: '#DC2626', color: 'white' } });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
  }
  if (!note) {
    return <div className="p-4">Note not found</div>;
  }

  const handleSummarise = async () => {
    setSummarising(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Please sign in');
      const updated = await fetcher<Note>(`/notes/${note.id}/summarize`, token, { method: 'POST' });
      setNote(updated);
      toast.success('Note summarised', { style: { backgroundColor: '#16A34A', color: 'white' } });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error('Summarisation failed', { description: errorMessage, style: { backgroundColor: '#DC2626', color: 'white' } });
    } finally {
      setSummarising(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Sign in required');
      await fetcher(`/notes/${note.id}`, token, { method: 'DELETE' });
      toast.success('Note deleted successfully', { style: { backgroundColor: '#16A34A', color: 'white' } });
      router.push('/notes');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error('Deletion failed', { description: errorMessage, style: { backgroundColor: '#DC2626', color: 'white' } });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{note.title}</h1>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSummarise} disabled={summarising}>
            {summarising
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : 'Summarise Note'}
          </Button>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogDescription>Modify title, content or tags.</DialogDescription>
              </DialogHeader>
              <NoteEditor
                initialTitle={note.title}
                initialContent={note.content}
                initialTags={note.tags}
                onSave={async (updated) => {
                  try {
                    const token = await getToken();
                    if (!token) throw new Error('Not signed in');
                    const saved = await fetcher<Note>(`/notes/${note.id}`, token, {
                      method: 'PUT',
                      body: JSON.stringify(updated),
                    });
                    setNote(saved);
                    toast.success('Note updated successfully', { style: { backgroundColor: '#16A34A', color: 'white' } });
                  } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                    toast.error('Update failed', { description: errorMessage, style: { backgroundColor: '#DC2626', color: 'white' } });
                  }
                  }
                }
              />
            </DialogContent>
          </Dialog>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-xs">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmOpen(false);
                    handleDelete();
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none border p-4 rounded-lg">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      {/* AI Summary */}
      <div>
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="border p-4 rounded-lg min-h-[4rem] flex items-center justify-center">
          {summarising
            ? <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            : note.summary || <span className="text-gray-400">No summary yet</span>}
        </div>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
