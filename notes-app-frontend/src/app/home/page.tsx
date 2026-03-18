"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import NotesContent from "./components/NotesContent";
import NoteModal from "@/components/note/NoteModal";
import { useApi } from "@/hooks/useApi";
import { Note } from "@/types/note";
import { Category } from "@/types/category";

export default function HomePage() {
  const { data: initialNotes, isLoading: isNotesLoading } = useApi<Note[]>("/api/notes/");
  const { data: categories = [] } = useApi<Category[]>("/api/categories/");

  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (initialNotes) {
      setLocalNotes(initialNotes);
    }
  }, [initialNotes]);

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleNoteSaved = (updatedNote: Note) => {
    setLocalNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== updatedNote.id);
      return [updatedNote, ...filtered];
    });
  };

  return (
    <>
      <AppLayout categories={categories ?? []} onNewNote={handleNewNote}>
        <div className="flex-1 flex flex-col overflow-auto h-full">
          <NotesContent
            notes={localNotes}
            isLoading={isNotesLoading}
            onNoteClick={handleEditNote}
          />
        </div>
      </AppLayout>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
        categories={categories ?? []}
        onNoteSaved={handleNoteSaved}
      />
    </>
  );
}
