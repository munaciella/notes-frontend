'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotesPage() {
  return (
    <div className="mt-0 md:mt-2 h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <h1 className="text-2xl font-semibold mb-2">
        Welcome to Bear-Like Notes
      </h1>
      <p className="text-center mb-4">
        Select a note from the sidebar, or{' '}
        <Link
          href="/notes/new"
          className="text-blue-500 hover:underline dark:text-blue-400"
        >
          create a new one
        </Link>
        .
      </p>
      <Image
        width={200}
        height={200}
        src="/nc-woman-typing-on-machine.png"
        alt="No note selected"
        className="w-56 opacity-70 mt-4 dark:invert"
        priority
      />
    </div>
  );
}
