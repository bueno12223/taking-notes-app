"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteToolbar from "./NoteToolbar";
import NoteEditor from "./NoteEditor";
import { Note } from "@/types/note";

interface Category {
  name: string;
  color: string;
}

const MOCK_CATEGORIES: Category[] = [
  { name: "Random Thoughts", color: "#EF9C66" },
  { name: "School", color: "#FCDC94" },
  { name: "Personal", color: "#78ABA8" },
];

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
}

export default function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(MOCK_CATEGORIES[0]);

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
            options={MOCK_CATEGORIES}
            onSelectCategory={setSelectedCategory}
            onClose={onClose}
          />
          <NoteEditor />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
