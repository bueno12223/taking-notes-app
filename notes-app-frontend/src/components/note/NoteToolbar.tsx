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
    <div className="relative flex items-center justify-between px-4 h-[39px] mt-[33px] pointer-events-auto">
      <div className="w-[225px] h-[39px]">
        <CategoryDropdown
          selected={selected}
          options={categories}
          onSelect={onSelectCategory}
        />
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close note"
        className="text-brand-gold hover:opacity-70 transition-opacity p-1"
      >
        <X size={32} className="text-[#957139]" cursor="pointer" />
      </button>
    </div>
  );
}
