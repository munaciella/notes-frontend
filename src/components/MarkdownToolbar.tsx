'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export interface MarkdownToolbarProps {
  content: string;
  setContent: (c: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function MarkdownToolbar({
  content,
  setContent,
  textareaRef,
}: MarkdownToolbarProps) {
  const wrap = (before: string, after = before) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const selected = content.slice(start, end);
    const updated =
      content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(updated);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const prefixLine = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: pos } = ta;
    const text = content;
    const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
    const updated =
      text.slice(0, lineStart) + prefix + text.slice(lineStart);
    setContent(updated);
    setTimeout(() => {
      ta.focus();
      const cursor = pos + prefix.length;
      ta.setSelectionRange(cursor, cursor);
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
      <Button variant="outline" size="sm" onClick={() => prefixLine('# ')}>
        H1
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('## ')}>
        H2
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('### ')}>
        H3
      </Button>
      <Button variant="outline" size="sm" onClick={() => wrap('**')}>
        Bold
      </Button>
      <Button variant="outline" size="sm" onClick={() => wrap('_')}>
        Italic
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('- ')}>
        List
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('> ')}>
        Quote
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('```')}>
        Code
      </Button>
      <Button variant="outline" size="sm" onClick={() => prefixLine('---\n')}>
        HR
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => wrap('[', '](url)')}
      >
        Link
      </Button>
    </div>
  );
}
