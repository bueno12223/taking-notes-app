"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Category } from "@/types/category";
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
    <div className="flex flex-col gap-[7px] w-[225px]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-row items-center w-full px-[15px] py-[7px] gap-2 border border-brand-gold rounded-[6px]"
      >
        <span
          className={`shrink-0 rounded-full w-[11px] h-[11px] ${selected ? `bg-${selected.value}` : 'bg-transparent'}`}
        />
        <span className="font-sans font-normal text-[12px] text-black flex-1 text-left">
          {selected?.label || "Select Category"}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-brand-gold shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-brand-gold shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col bg-brand-linen rounded-[8px] overflow-hidden w-full absolute top-[100%] left-0 z-50">
          {options?.map((category) => (
            <CategoryItem
              key={category.value}
              category={category}
              onClick={() => handleSelect(category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
