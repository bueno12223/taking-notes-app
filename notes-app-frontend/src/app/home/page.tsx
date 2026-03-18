"use client";

import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import NotesContent from "./components/NotesContent";
import NoteModal from "@/components/note/NoteModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { Note } from "@/types/note";
import { Category } from "@/types/category";
import AuthGuard from "@/components/auth/AuthGuard";

export default function HomePage() {
  const { data: initialNotes, isLoading: isNotesLoading } = useApi<Note[]>("/api/notes/");

  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
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

  const handleSelectCategory = (category: Category) => {
    setSelectedCategoryId((prev) => (prev === category.value ? null : category.value));
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    localNotes.forEach((note) => {
      counts[note.category] = (counts[note.category] || 0) + 1;
    });
    return counts;
  }, [localNotes]);

  const displayedNotes = useMemo(() => {
    const source = (localNotes.length === 0 && initialNotes) ? initialNotes : localNotes;
    if (!selectedCategoryId) return source;
    return source.filter((note) => note.category === selectedCategoryId);
  }, [localNotes, initialNotes, selectedCategoryId]);

  return (
    <AuthGuard>
      <AppLayout
        onSelectCategory={handleSelectCategory}
        selectedCategoryId={selectedCategoryId}
        counts={categoryCounts}
      >
        <div className="flex-1 flex flex-col min-h-0">
          <header className="flex items-center justify-end px-[37px] py-[33px]">
            <Button
              label="New Note"
              onClick={handleNewNote}
              icon={<Plus size={16} />}
              iconPosition="left"
            />
          </header>

          <div className="flex-1 overflow-auto px-[37px] pb-[37px]">
            <NotesContent
              notes={displayedNotes}
              isLoading={isNotesLoading}
              onNoteClick={handleEditNote}
            />
          </div>
        </div>
      </AppLayout>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
        onNoteSaved={handleNoteSaved}
      />
    </AuthGuard>
  );
}
