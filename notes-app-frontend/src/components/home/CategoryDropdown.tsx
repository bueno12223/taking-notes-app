"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Category } from "@/types/category";
import { CATEGORY_DOT_COLORS } from "@/constants";
import CategoryItem from "./CategoryItem";

interface CategoryDropdownProps {
  selected?: Category | null;
  options: Category[];
  onSelect: (category: Category) => void;
}

export default function CategoryDropdown({ selected, options, onSelect }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col w-fit min-w-[165px]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-row items-center w-full px-[18px] py-[8px] gap-2 border border-brand-gold rounded-[6px] bg-brand-linen hover:bg-black/5 transition-colors"
      >
        <span
          className={`shrink-0 rounded-full w-[11px] h-[11px] ${selected ? (CATEGORY_DOT_COLORS[selected.value] || "bg-gray-400") : 'bg-transparent'}`}
        />
        <span className="font-sans text-[14px] text-black flex-1 text-left">
          {selected?.label || "Select Category"}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-brand-gold shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-brand-gold shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col bg-brand-linen rounded-[6px] overflow-hidden w-full absolute top-[calc(100%+8px)] left-0 z-50 shadow-lg border border-brand-gold/10 py-1">
          {options?.map((category) => (
            <CategoryItem
              key={category.value}
              category={category}
              showCount={false}
              onClick={() => handleSelect(category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
