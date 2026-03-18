"use client";

import { X } from "lucide-react";
import CategoryDropdown from "@/components/home/CategoryDropdown";

interface Category {
  name: string;
  color: string;
}

interface NoteToolbarProps {
  selected: Category;
  options: Category[];
  onSelectCategory: (category: Category) => void;
  onClose: () => void;
}

export default function NoteToolbar({
  selected,
  options,
  onSelectCategory,
  onClose,
}: NoteToolbarProps) {
  return (
    <div className="relative flex items-start justify-between px-[37px] pt-[33px]">
      <CategoryDropdown
        selected={selected}
        options={options}
        onSelect={onSelectCategory}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close note"
        className="text-brand-gold hover:opacity-70 transition-opacity"
      >
        <X size={24} />
      </button>
    </div>
  );
}
