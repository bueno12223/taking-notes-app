"use client";

import AppLayout from "@/components/layouts/AppLayout";
import EmptyState from "@/components/home/EmptyState";
import NotesSkeleton from "@/components/home/NotesSkeleton";
import NotesGrid from "@/components/home/NotesGrid";
import { useApi } from "@/hooks/useApi";
import { Note } from "@/types/note";

const MOCK_CATEGORIES = [
  { name: "Random Thoughts", color: "#EF9C66" },
  { name: "School", color: "#FCDC94" },
  { name: "Personal", color: "#78ABA8" },
];

export default function HomePage() {
  const { data: notes, isLoading } = useApi<Note[]>("/api/notes/");

  const renderContent = () => {
    if (isLoading) {
      return <NotesSkeleton />;
    }

    if (!notes || notes.length === 0) {
      return <EmptyState />;
    }

    return <NotesGrid notes={notes} />;
  };

  return (
    <AppLayout categories={MOCK_CATEGORIES}>
      <div className="flex-1 flex flex-col overflow-auto h-full">
        {renderContent()}
      </div>
    </AppLayout>
  );
}
