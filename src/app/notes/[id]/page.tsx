'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotesRefresh } from '@/context/notes-refresh';
import dynamic from 'next/dynamic';
import { useAuth } from '@clerk/nextjs';
import { fetcher } from '@/lib/api';
import { Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { NoteEditor } from '@/components/NoteEditor';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function NoteDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const { triggerRefresh } = useNotesRefresh();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;
      const data = await fetcher<Note>(`/notes/${id}`, token);
      setNote(data);
      setLoading(false);
    })();
  }, [id, getToken]);

  if (loading) {
    return <div className="p-4">Loading…</div>;
  }
  if (!note) {
    return <div className="p-4">Note not found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header with Edit & Delete */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{note.title}</h1>

        <div className="flex gap-2">
          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>

            <DialogContent className="w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl mt-14">
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogDescription>
                  Update your title, content, or tags below.
                </DialogDescription>
              </DialogHeader>

              <NoteEditor
                initialTitle={note.title}
                initialContent={note.content}
                initialTags={note.tags}
                onSave={async (updated) => {
                  const token = await getToken();
                  if (!token) return;
                  // Call PUT /notes/:id
                  const saved = await fetcher<Note>(
                    `/notes/${note.id}`,
                    token,
                    {
                      method: 'PUT',
                      body: JSON.stringify(updated),
                    }
                  );
                  setNote(saved);
                  setEditOpen(false);
                  triggerRefresh();
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xs w-full">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this note? This action is
                  irreversible.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const token = await getToken();
                    if (!token) return;
                    // Call DELETE /notes/:id
                    await fetcher(`/notes/${note.id}`, token, {
                      method: 'DELETE',
                    });
                    router.push('/notes');
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Note content */}
      <div className="prose dark:prose-invert max-w-none border p-4 rounded-lg">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      {/* AI Summary */}
      {note.summary && (
        <div className="italic text-gray-600 dark:text-gray-400">
          AI Summary: {note.summary}
        </div>
      )}

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
