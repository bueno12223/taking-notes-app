import * as yup from "yup";

export interface NoteFormValues {
  title: string;
  content: Record<string, unknown>;
  category: string;
}

export const noteInitialValues: NoteFormValues = {
  title: "",
  content: {},
  category: "",
};

export const getNoteInitialValues = (): NoteFormValues => ({ ...noteInitialValues });

export const noteSchema = yup.object({
  title: yup.string().max(255, "Title must be 255 characters or fewer").required("Title is required"),
  content: yup
    .mixed<Record<string, unknown>>()
    .test("has-content", "Content is required", (value) => {
      if (!value || typeof value !== "object") return false;
      const doc = value as { content?: unknown[] };
      return Array.isArray(doc.content) && doc.content.length > 0;
    })
    .required("Content is required"),
  category: yup.string().required("Category is required"),
});
