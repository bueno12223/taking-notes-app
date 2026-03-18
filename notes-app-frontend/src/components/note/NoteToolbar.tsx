"use client";

import { X } from "lucide-react";
import CategoryDropdown from "@/components/home/CategoryDropdown";

import { Category } from "@/types/category";

interface NoteToolbarProps {
  selected?: Category | null;
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onClose: () => void;
}

export default function NoteToolbar({
  selected,
  categories,
  onSelectCategory,
  onClose,
}: NoteToolbarProps) {
  return (
    <div className="relative flex items-start justify-between px-[37px] pt-[33px]">
      <CategoryDropdown
        selected={selected}
        options={categories}
        onSelect={onSelectCategory}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close note"
        className="text-brand-gold hover:opacity-70 transition-opacity"
      >
        <X size={24} cursor={'pointer'} />
      </button>
    </div>
  );
}
