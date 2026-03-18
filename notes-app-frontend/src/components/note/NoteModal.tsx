"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import NoteToolbar from "./NoteToolbar";
import NoteEditor from "./NoteEditor";
import { Note } from "@/types/note";
import { Category } from "@/types/category";
import { useAutosave } from "@/hooks/useAutosave";
import { AUTOSAVE_DELAY } from "./constants";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  categories: Category[];
  onNoteSaved?: (note: Note) => void;
}

export default function NoteModal({ 
  isOpen, 
  onClose, 
  note, 
  categories,
  onNoteSaved
}: NoteModalProps) {
  const [noteId, setNoteId] = useState<number | null>(note?.id ?? null);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState<Record<string, unknown>>(note?.content ?? {});
  const [category, setCategory] = useState(note?.category ?? categories[0]?.value ?? "");
  const [pendingClose, setPendingClose] = useState(false);

  const initialLastSavedAt = note?.updated_at ?? null;

  useEffect(() => {
    if (!isOpen) return;
    setNoteId(note?.id ?? null);
    setTitle(note?.title ?? "");
    setContent(note?.content ?? {});
    setCategory(note?.category ?? categories[0]?.value ?? "");
    setPendingClose(false);
  }, [isOpen, note, categories]);

  const { saveStatus, errors, lastSavedAt } = useAutosave({
    noteId,
    data: { title, content, category },
    onSaveSuccess: (updatedNote) => {
      setNoteId(updatedNote.id);
      onNoteSaved?.(updatedNote);
    },
    initialLastSavedAt,
    delay: AUTOSAVE_DELAY,
  });

  useEffect(() => {
    if (pendingClose && saveStatus !== "saving") {
      setPendingClose(false);
      onClose();
    }
  }, [pendingClose, saveStatus, onClose]);

  const selectedCategory = categories.find((c) => c.value === category) ?? null;

  const handleCategorySelect = (cat: Category) => setCategory(cat.value);

  const handleClose = () => {
    if (saveStatus === "saving") {
      setPendingClose(true);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-brand-linen flex flex-col overflow-hidden"
        >
          <NoteToolbar
            selected={selectedCategory}
            categories={categories}
            onSelectCategory={handleCategorySelect}
            onClose={handleClose}
          />
          <NoteEditor
            noteId={noteId}
            lastSavedAt={lastSavedAt}
            title={title}
            content={content}
            category={category}
            onTitleChange={setTitle}
            onContentChange={setContent}
            errors={errors}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
