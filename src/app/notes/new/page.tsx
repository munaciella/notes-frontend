"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@/lib/api";
import { NoteEditor } from "@/components/NoteEditor";
import { Note } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewNotePage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleSave = async ({
    title,
    content,
    tags,
  }: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    const token = await getToken();
    if (!token) {
      toast.error("You must be signed in to create a note.", {
        style: { backgroundColor: "#DC2626", color: "white" },
      });
      return;
    }

    const toastId = toast("Saving note…", {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      style: { backgroundColor: "#2563EB", color: "white" }, // blue/info
    });

    try {
      const note = await fetcher<Note>("/notes", token, {
        method: "POST",
        body: JSON.stringify({ title, content, tags }),
      });

      toast.success("Note created!", {
        id: toastId,
        style: { backgroundColor: "#16A34A", color: "white" },
      });

      router.push(`/notes/${note.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to save note.", {
          id: toastId,
          description: err.message,
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } else {
        toast.error("An unknown error occurred.", {
          id: toastId,
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      }
    }
  };

  return <NoteEditor onSave={handleSave} />;
}
