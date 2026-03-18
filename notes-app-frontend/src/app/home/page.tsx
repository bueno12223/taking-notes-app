"use client";

import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import NotesContent from "./components/NotesContent";
import NoteModal from "@/components/note/NoteModal";
import { useApi } from "@/hooks/useApi";
import { Note } from "@/types/note";
import { Category } from "@/types/category";

export default function HomePage() {
  const { data: notes, isLoading: isNotesLoading } = useApi<Note[]>("/api/notes/");
  const { data: categories = [] } = useApi<Category[]>("/api/categories/");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };


  return (
    <>
      <AppLayout categories={categories ?? []} onNewNote={handleNewNote}>
        <div className="flex-1 flex flex-col overflow-auto h-full">
          <NotesContent notes={notes} isLoading={isNotesLoading} />
        </div>
      </AppLayout>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
        categories={categories ?? []}
      />
    </>
  );
}
