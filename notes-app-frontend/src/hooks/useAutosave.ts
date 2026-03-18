"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "@/types/note";
import { useApi } from "./useApi";

export type AutosaveFields = Pick<Note, "title" | "content" | "category">;
export type SaveStatus = "idle" | "saving" | "saved";

export interface AutosaveErrors {
  title: string | null;
  category: string | null;
  content: string | null;
}

interface UseAutosaveProps {
  noteId: number | null;
  data: AutosaveFields;
  onSaveSuccess: (note: Note) => void;
  initialLastSavedAt?: string | null;
  delay?: number;
}

interface UseAutosaveResult {
  saveStatus: SaveStatus;
  errors: AutosaveErrors;
  isValid: boolean;
  lastSavedAt: string | null;
}

function isContentEmpty(content: Record<string, unknown>): boolean {
  const doc = content as { content?: { content?: unknown[] }[] };
  if (!doc.content || doc.content.length === 0) return true;
  return doc.content.every((node) => !node.content || node.content.length === 0);
}

export function useAutosave({
  noteId,
  data,
  onSaveSuccess,
  initialLastSavedAt = null,
  delay = 1000,
}: UseAutosaveProps): UseAutosaveResult {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialLastSavedAt);

  const { execute: createNote } = useApi<Note>("/api/notes/", { lazy: true });
  const { execute: updateNote } = useApi<Note>(noteId ? `/api/notes/${noteId}/` : "/api/notes/0/", {
    lazy: true
  });

  const noteIdRef = useRef<number | null>(noteId);
  const isSavingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestDataRef = useRef(data);
  const latestIsValidRef = useRef(false);
  const lastSuccessfullySavedDataRef = useRef<string>("");

  useEffect(() => {
    noteIdRef.current = noteId;
  }, [noteId]);

  const { title, content, category } = data;

  const errors = useMemo<AutosaveErrors>(
    () => ({
      title: !title.trim() ? "Add a title to save" : null,
      category: !category ? "Select a category to save" : null,
      content: isContentEmpty(content) ? "Add some content to save" : null,
    }),
    [title, category, content]
  );

  const isValid = errors.title === null && errors.category === null && errors.content === null;

  useEffect(() => {
    latestDataRef.current = data;
    latestIsValidRef.current = isValid;
  }, [data, isValid]);

  const save = useCallback(
    async (saveData: AutosaveFields) => {
      const dataString = JSON.stringify(saveData);
      if (isSavingRef.current || dataString === lastSuccessfullySavedDataRef.current) return;
      
      isSavingRef.current = true;
      setSaveStatus("saving");

      try {
        const id = noteIdRef.current;
        let savedNote: Note | null = null;

        if (id === null) {
          savedNote = await createNote({ method: "POST", body: saveData });
        } else {
          savedNote = await updateNote({ method: "PATCH", body: saveData });
        }

        if (savedNote) {
          noteIdRef.current = savedNote.id;
          lastSuccessfullySavedDataRef.current = dataString;
          setLastSavedAt(savedNote.updated_at);
          setSaveStatus("saved");
          
          // Notify parent of successful save (create or update)
          onSaveSuccess(savedNote);

          if (savedFadeTimerRef.current) clearTimeout(savedFadeTimerRef.current);
          savedFadeTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("idle");
        }
      } catch {
        setSaveStatus("idle");
      } finally {
        isSavingRef.current = false;
      }
    },
    [createNote, updateNote, onSaveSuccess]
  );

  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    if (!isValid) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (JSON.stringify(data) === lastSuccessfullySavedDataRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      saveRef.current(latestDataRef.current);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, category, content, isValid, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current && latestIsValidRef.current && !isSavingRef.current) {
        clearTimeout(timerRef.current);
        saveRef.current(latestDataRef.current);
      }
      if (savedFadeTimerRef.current) clearTimeout(savedFadeTimerRef.current);
    };
  }, []);

  return { saveStatus, errors, isValid, lastSavedAt };
}
