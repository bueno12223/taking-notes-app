import * as Yup from "yup";
import { Note, TiptapNode } from "@/types/note";
import { isContentEmpty } from "@/lib/note-utils";

export interface NoteFormValues {
  title: string;
  content: TiptapNode | Record<string, unknown>;
  category: string;
}

export const initialNoteValues: NoteFormValues = {
  title: "",
  content: {},
  category: "brand-peach",
};

export const getInitialNoteValues = (note: Note | null, defaultCategory: string): NoteFormValues => {
  if (!note) {
    return {
      ...initialNoteValues,
      category: defaultCategory || "brand-peach",
    };
  }
  return {
    title: note.title,
    content: note.content,
    category: note.category,
  };
};

export const noteValidationSchema = Yup.object({
  title: Yup.string()
    .required("Add a title to save")
    .trim(),
  category: Yup.string()
    .required("Select a category to save"),
  content: Yup.mixed<TiptapNode | Record<string, unknown>>()
    .required("Add some content to save")
    .test("is-not-empty", "Add some content to save", (value) => {
      if (!value) return false;
      return !isContentEmpty(value as TiptapNode);
    }),
}).defined();
