"use client";

import React, { useState, useEffect } from "react";
import NoteEditor from "./NoteEditor";
import NoteToolbar from "./NoteToolbar";
import { useAutosave } from "@/hooks/useAutosave";
import { Note } from "@/types/note";
import { Category } from "@/types/category";
import { useCustomForm } from "@/hooks/use-custom-form";
import { getInitialNoteValues, noteValidationSchema, NoteFormValues } from "./validations";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  categories: Category[];
  onNoteSaved: (updatedNote: Note) => void;
}

export default function NoteModal({
  isOpen,
  onClose,
  note,
  categories,
  onNoteSaved
}: NoteModalProps) {
  const [noteId, setNoteId] = useState<number | null>(note?.id ?? null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(note?.updated_at ?? null);
  const [pendingClose, setPendingClose] = useState(false);

  const form = useCustomForm<NoteFormValues>({
    initialValues: getInitialNoteValues(note, categories[0]?.value),
    validationSchema: noteValidationSchema,
    onSubmit: () => { },
  });

  const onSaveSuccess = (savedNote: Note) => {
    setNoteId(savedNote.id);
    setLastSavedAt(savedNote.updated_at);
    onNoteSaved(savedNote);
    if (pendingClose) {
      onClose();
    }
  };

  const { saveStatus, errors: autosaveErrors } = useAutosave({
    noteId,
    data: form.values,
    onSaveSuccess,
  });

  useEffect(() => {
    if (isOpen) {
      setNoteId(note?.id ?? null);
      setLastSavedAt(note?.updated_at ?? null);
      form.setValues(getInitialNoteValues(note, categories[0]?.value));
      setPendingClose(false);
    }
  }, [isOpen, note, categories]);

  const handleClose = () => {
    if (saveStatus === "saving") return setPendingClose(true);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = categories.find(c => c.value === form.values.category) || categories[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-brand-linen transition-opacity animate-in fade-in duration-300 overflow-hidden">
      <div className="relative w-full h-full flex flex-col p-6 overflow-hidden">
        <div className="absolute inset-0 z-0" onClick={handleClose} />

        <div className="relative z-10 flex-1 flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 overflow-hidden">
          <NoteToolbar
            selected={selectedCategory}
            categories={categories}
            onSelectCategory={(cat) => form.setFieldValue("category", cat.value)}
            onClose={handleClose}
          />

          <div className="flex-1 flex min-h-0">
            <NoteEditor
              form={form}
              noteId={noteId}
              saveStatus={saveStatus}
              autosaveErrors={autosaveErrors}
              lastSavedAt={lastSavedAt}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
