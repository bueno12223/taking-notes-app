"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "@/types/note";
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

/**
 * Props configuration for the useAutosave hook.
 */
interface UseAutosaveProps {
  /** The unique identifier of the note. Null if creating a new note. */
  noteId: number | null;
  /** The data object containing title, content, and category for autosaving. */
  data: AutosaveFields;
  /** Callback function triggered upon a successful save or create. */
  onSaveSuccess: (note: Note) => void;
  /** ISO timestamp representing when the data was last saved successfully. */
  initialLastSavedAt?: string | null;
  /** Debounce delay in milliseconds before triggering the save operation. */
  delay?: number;
  /** Conditional flag to enable or disable the autosaving logic entirely. */
  enabled?: boolean;
}

/**
 * Result object returned by the useAutosave hook.
 */
interface UseAutosaveResult {
  /** The current status of the save operation: idle, saving, or saved. */
  saveStatus: SaveStatus;
  /** An object mapping validation errors for individual fields. */
  errors: AutosaveErrors;
  /** Boolean indicating whether the current data passes all validation rules. */
  isValid: boolean;
  /** ISO timestamp of the last successful save operation. */
  lastSavedAt: string | null;
}

/**
 * A custom hook that manages automatic saving of note data with debounce and validation support.
 * 
 * It identifies whether to perform a POST (create) or PATCH (update) based on the presence of a noteId.
 * Validation is performed internally, and saving only proceeds if the data has changed from the 
 * state that was successfully saved last.
 * 
 * @param {UseAutosaveProps} props - The hook configuration properties.
 * @returns {UseAutosaveResult} An object containing the current save status and validation metadata.
 * 
 * @example
 * const { saveStatus, errors } = useAutosave({
 *   noteId,
 *   data: { title, content, category },
 *   onSaveSuccess: (note) => console.log("Note saved:", note),
 *   enabled: form.dirty
 * });
 */
export function useAutosave({
  noteId,
  data,
  onSaveSuccess,
  initialLastSavedAt = null,
  delay = AUTOSAVE_DELAY,
  enabled = true,
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
  
  const lastSuccessfullySavedDataRef = useRef<string>(noteId !== null ? JSON.stringify(data) : "");

  useEffect(() => {
    noteIdRef.current = noteId;
    if (noteId !== null) {
      lastSuccessfullySavedDataRef.current = JSON.stringify(data);
    } else {
      lastSuccessfullySavedDataRef.current = "";
    }
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
    if (!enabled || !isValid) {
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
  }, [title, category, content, isValid, delay, enabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current && latestIsValidRef.current && !isSavingRef.current && enabled) {
        clearTimeout(timerRef.current);
        saveRef.current(latestDataRef.current);
      }
      if (savedFadeTimerRef.current) clearTimeout(savedFadeTimerRef.current);
    };
  }, [enabled]);

  return { saveStatus, errors, isValid, lastSavedAt };
}
