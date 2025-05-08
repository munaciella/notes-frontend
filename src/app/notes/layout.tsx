import { TwoPaneLayout } from '@/components/Layout';
import { NotesSidebar } from '@/components/NotesSidebar';

export const metadata = { title: 'Your Notes' };

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <TwoPaneLayout sidebar={<NotesSidebar />}>{children}</TwoPaneLayout>;
}
