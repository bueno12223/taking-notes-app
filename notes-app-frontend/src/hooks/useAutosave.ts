"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note, TiptapNode } from "@/types/note";
import { useApi } from "./useApi";
import { AUTOSAVE_DELAY } from "@/constants";
import { isContentEmpty } from "@/lib/note-utils";

export type AutosaveFields = Pick<Note, "title" | "content" | "category">;
export type SaveStatus = "idle" | "saving" | "saved";

export interface AutosaveErrors {
  title: string | null;
  category: string | null;
  content: string | null;
}

interface UseAutosaveProps {
  /** The unique identifier of the note. Null if creating a new note. */
  noteId: number | null;
  /** The data to be autosaved. */
  data: AutosaveFields;
  /** Callback triggered when a save operation completes successfully. */
  onSaveSuccess: (note: Note) => void;
  /** Optional initial ISO date of the last save. */
  initialLastSavedAt?: string | null;
  /** Optional debounce delay in milliseconds. Defaults to global AUTOSAVE_DELAY. */
  delay?: number;
}

interface UseAutosaveResult {
  /** Current status of the save operation (idle, saving, or saved). */
  saveStatus: SaveStatus;
  /** Field-specific validation errors. */
  errors: AutosaveErrors;
  /** True if all fields are valid for saving. */
  isValid: boolean;
  /** ISO timestamp of the last successful save. */
  lastSavedAt: string | null;
}

/**
 * A custom hook that handles automatic saving of note data with debouncing and validation.
 * 
 * It manages both creation (POST) and updates (PATCH) depending on whether `noteId` is provided.
 * Saving only occurs if the data is valid and has changed since the last successful save.
 * 
 * @example
 * const { saveStatus, errors } = useAutosave({
 *   noteId: actualNoteId,
 *   data: { title, content, category },
 *   onSaveSuccess: (note) => console.log("Saved!", note)
 * });
 */
export function useAutosave({
  noteId,
  data,
  onSaveSuccess,
  initialLastSavedAt = null,
  delay = AUTOSAVE_DELAY,
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
          savedNote = await createNote({ method: "POST", body: saveData as Record<string, unknown> });
        } else {
          savedNote = await updateNote({ method: "PATCH", body: saveData as Record<string, unknown> });
        }

        if (savedNote) {
          noteIdRef.current = savedNote.id;
          lastSuccessfullySavedDataRef.current = dataString;
          setLastSavedAt(savedNote.updated_at);
          setSaveStatus("saved");

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
