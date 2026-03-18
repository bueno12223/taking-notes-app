"use client";

import { Note } from "@/types/note";
import NotesSkeleton from "@/components/home/NotesSkeleton";
import EmptyState from "@/components/home/EmptyState";
import NotesGrid from "@/components/home/NotesGrid";

interface NotesContentProps {
  notes: Note[] | null;
  isLoading: boolean;
}

export default function NotesContent({ notes, isLoading }: NotesContentProps) {
  if (isLoading) {
    return <NotesSkeleton />;
  }

  if (!notes || notes.length === 0) {
    return <EmptyState />;
  }

  return <NotesGrid notes={notes} />;
}
