"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteToolbar from "./NoteToolbar";
import NoteEditor from "./NoteEditor";
import { Note } from "@/types/note";
import { Category } from "@/types/category";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  categories: Category[];
}

export default function NoteModal({ isOpen, onClose, note, categories }: NoteModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
            onSelectCategory={setSelectedCategory}
            onClose={onClose}
          />
          <NoteEditor />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
