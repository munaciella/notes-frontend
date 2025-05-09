import { TwoPaneLayout } from '@/components/Layout';
import { NotesSidebar } from '@/components/NotesSidebar';
import { NotesRefreshProvider } from '@/context/notes-refresh';

export const metadata = { title: 'Your Notes' };

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotesRefreshProvider>
  <TwoPaneLayout sidebar={<NotesSidebar />}>
    {children}
    </TwoPaneLayout>
  </NotesRefreshProvider>
  )
}
