'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave: (data: { title: string; content: string; tags: string[] }) => Promise<void>;
}

export function NoteEditor({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  onSave,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ title, content, tags });
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-2 h-full gap-4">
      {/* Editor Pane */}
      <div className="flex flex-col">
        <Input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          className="mb-2"
        />

        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={e => setTagInput(e.currentTarget.value)}
          />
          <Button
            variant="outline"
            onClick={addTag}
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {tags.map(t => (
            <span
              key={t}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your markdown…"
          value={content}
          onChange={e => setContent(e.currentTarget.value)}
          className="flex-1 w-full p-2 border rounded font-mono resize-none mb-4"
        />

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {/* Preview Pane */}
      <div className="prose max-w-none overflow-auto border p-4 rounded">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
