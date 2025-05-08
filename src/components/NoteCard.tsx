'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface NoteCardProps {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export function NoteCard({ id, title, summary, tags }: NoteCardProps) {
  return (
    <Link href={`/notes/${id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 border rounded-lg hover:shadow-md transition"
      >
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-gray-600 line-clamp-2 mb-2">{summary}</p>
        <div className="flex flex-wrap gap-1">
          {tags.map(t => (
            <span
              key={t}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
