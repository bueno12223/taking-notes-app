"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import NoteToolbar from "./NoteToolbar";
import NoteEditor from "./NoteEditor";
import { Note } from "@/types/note";
import { Category } from "@/types/category";
import { useCustomForm } from "@/hooks/use-custom-form";
import { getNoteInitialValues, noteSchema, NoteFormValues } from "./validations";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  categories: Category[];
}

export default function NoteModal({ isOpen, onClose, note, categories }: NoteModalProps) {
  const form = useCustomForm<NoteFormValues>({
    initialValues: getNoteInitialValues(),
    validationSchema: noteSchema,
    onSubmit: (values) => {
      console.log("Note submitted:", values);
    },
  });

  useEffect(() => {
    if (isOpen) {
      const defaultCategory = note?.category ?? categories[0]?.value ?? "";
      form.resetForm({
        values: {
          title: note?.title ?? "",
          content: note?.content ?? {},
          category: defaultCategory,
        },
      });
    }
  }, [isOpen, note, categories]);

  const selectedCategory = categories.find((c) => c.value === form.values.category) ?? null;

  const handleCategorySelect = (category: Category) => {
    form.setFieldValue("category", category.value);
  };

  const handleClose = () => {
    form.resetForm();
    onClose();
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
            title={form.values.title}
            content={form.values.content}
            onTitleChange={(val) => form.setFieldValue("title", val)}
            onContentChange={(val) => form.setFieldValue("content", val)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
