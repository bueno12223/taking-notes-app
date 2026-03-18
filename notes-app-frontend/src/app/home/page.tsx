"use client";

import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import NotesContent from "./components/NotesContent";
import NoteModal from "@/components/note/NoteModal";
import { useApi } from "@/hooks/useApi";
import { Note } from "@/types/note";

const MOCK_CATEGORIES = [
  { name: "Random Thoughts", color: "#EF9C66" },
  { name: "School", color: "#FCDC94" },
  { name: "Personal", color: "#78ABA8" },
];

export default function HomePage() {
  const { data: notes, isLoading } = useApi<Note[]>("/api/notes/");
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
      <AppLayout categories={MOCK_CATEGORIES} onNewNote={handleNewNote}>
        <div className="flex-1 flex flex-col overflow-auto h-full">
          <NotesContent notes={notes} isLoading={isLoading} />
        </div>
      </AppLayout>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
      />
    </>
  );
}
