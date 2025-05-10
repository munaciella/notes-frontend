"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/api";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetOverlay,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useNotesRefresh } from "@/context/notes-refresh";

interface Note {
  id: string;
  title: string;
}

export function NotesSidebar() {
  const { getToken } = useAuth();
  const pathname = usePathname();
  const { refreshKey } = useNotesRefresh();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          toast.error("You need to be logged in to view your notes", {
            style: { backgroundColor: "#DC2626", color: "white" },
          });
          return;
        }
        const data = await fetcher<Note[]>(
          `/notes?q=${encodeURIComponent(q)}`,
          token
        );
        setNotes(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error("Failed to load notes.", {
            description: err.message || "An unknown error occurred.",
            style: { backgroundColor: "#DC2626", color: "white" },
          });
        } else {
          console.error("An unknown error occurred:", err);
          toast.error("Failed to load notes.", {
            description: "An unknown error occurred.",
            style: { backgroundColor: "#DC2626", color: "white" },
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [q, getToken, pathname, refreshKey]);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Notes</h2>
        <div className="flex items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQ(input);
            }}
            className="relative flex-1"
          >
            <Input
              placeholder="Search…"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              disabled={loading}
              className="w-full pr-8"
            />
            {input && (
            <button
              type="button"
              onClick={() => {
                setInput('');
                setQ('');
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
          </form>

          <Link href="/notes/new">
            <Button variant="outline" className="p-3 text-lg">
              +
            </Button>
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {notes.length === 0 && !loading && (
          <p className="text-center text-gray-500">No notes found.</p>
        )}
        {notes.map((n) => (
          <Link
            key={n.id}
            href={`/notes/${n.id}`}
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {n.title}
          </Link>
        ))}
      </nav>
    </div>
  );

  const SpinnerOverlay = (
    <div className="flex items-center justify-center h-full ml-32">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );

  return (
    <>
      {/* Mobile: hamburger → full-screen sheet */}
      <div className="md:hidden mt-4">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="m-2 p-2">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetOverlay className="fixed inset-0 bg-black/50 z-40" />
          <SheetContent side="left" className="w-full p-0 z-50">
            <div className="relative h-full flex flex-col bg-white dark:bg-gray-900">
              {/* Close button */}
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4"
                  aria-label="Close sidebar"
                />
              </SheetClose>

              {/* Header + New Note */}
              <div className="p-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Notes</h2>
                <Link 
                href="/notes/new"
                onClick={() => setSheetOpen(false)}
                className="inline-flex"
                >
                  <Button variant="outline">
                    <span className="p-1 text-lg">+
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Search */}
              <div className="px-6 mb-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setQ(input);
                  }}
                >
                  <Input
                    placeholder="Search…"
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                </form>
              </div>

              {/* Notes list */}
              <nav className="flex-1 overflow-y-auto px-6 space-y-1">
                {loading ? (
                  SpinnerOverlay
                ) : notes.length === 0 ? (
                  <p className="text-center text-gray-500">No notes found.</p>
                ) : (
                  notes.map((n) => (
                    <SheetClose asChild key={n.id}>
                      <Link
                        href={`/notes/${n.id}`}
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {n.title}
                      </Link>
                    </SheetClose>
                  ))
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:flex md:w-80 h-full">
        {loading ? SpinnerOverlay : SidebarContent}
      </div>
    </>
  );
}
